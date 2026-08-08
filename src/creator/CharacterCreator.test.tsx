import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import racesFixture from '../../public/data/races-srd.json'
import classesFixture from '../../public/data/classes-srd.json'
import { CharacterCreator } from './CharacterCreator'
import { createDraft, getDraft } from '../db/characterDrafts'
import { db } from '../db/schema'

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string) => {
      const fixture = input.includes('races-srd.json') ? racesFixture : classesFixture
      return new Response(JSON.stringify(fixture), { status: 200 })
    }),
  )
})

afterEach(async () => {
  vi.unstubAllGlobals()
  cleanup()
  await db.characterDrafts.clear()
})

describe('CharacterCreator', () => {
  it('affiche l’étape Race en premier avec l’indicateur de progression', async () => {
    render(<CharacterCreator draft={createDraft()} />)

    expect(screen.getByText('Étape 1/2 — Race')).toBeInTheDocument()
    expect(await screen.findByText('Humain')).toBeInTheDocument()
  })

  it('sélectionner une race l’enregistre (autosave) et active Suivant', async () => {
    const draft = createDraft()
    render(<CharacterCreator draft={draft} />)

    fireEvent.click(await screen.findByText('Elfe'))

    expect(screen.getByRole('button', { name: 'Suivant' })).toBeEnabled()
    const saved = await getDraft(draft.id)
    expect(saved?.raceId).toBe('elf')
  })

  it('navigue vers l’étape Classe et affiche le message caractéristiques après sélection', async () => {
    const draft = { ...createDraft(), raceId: 'elf', currentStep: 'class' as const }
    render(<CharacterCreator draft={draft} />)

    expect(screen.getByText('Étape 2/2 — Classe')).toBeInTheDocument()
    expect(await screen.findByText('Magicien')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Suivant' })).toBeDisabled()
    expect(screen.queryByText('Étape Caractéristiques — bientôt disponible')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Magicien'))

    expect(screen.getByRole('button', { name: 'Suivant' })).toBeDisabled()
    expect(screen.getByText('Étape Caractéristiques — bientôt disponible')).toBeInTheDocument()

    const saved = await getDraft(draft.id)
    expect(saved?.classId).toBe('wizard')
  })

  it('le bouton Précédent revient à l’étape Race', async () => {
    const draft = { ...createDraft(), raceId: 'human', currentStep: 'class' as const }
    render(<CharacterCreator draft={draft} />)

    fireEvent.click(screen.getByRole('button', { name: 'Précédent' }))

    expect(screen.getByText('Étape 1/2 — Race')).toBeInTheDocument()
    const saved = await getDraft(draft.id)
    expect(saved?.currentStep).toBe('race')
  })
})

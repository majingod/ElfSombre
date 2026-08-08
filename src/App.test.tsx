import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import racesFixture from '../public/data/races-srd.json'
import classesFixture from '../public/data/classes-srd.json'
import App from './App'
import { createDraft, saveDraft } from './db/characterDrafts'
import { db } from './db/schema'

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

describe('App', () => {
  it('n’affiche pas "Reprendre" sans brouillon existant', async () => {
    render(<App />)

    expect(await screen.findByText('Grimoire 3.5')).toBeInTheDocument()
    expect(screen.queryByText('Reprendre la création en cours')).not.toBeInTheDocument()
  })

  it('affiche "Reprendre" quand un brouillon existe déjà', async () => {
    await saveDraft(createDraft())
    render(<App />)

    expect(await screen.findByText('Reprendre la création en cours')).toBeInTheDocument()
  })

  it('"Créer un personnage" ouvre le créateur à l’étape Race', async () => {
    render(<App />)

    fireEvent.click(await screen.findByText('Créer un personnage'))

    expect(await screen.findByText('Étape 1/2 — Race')).toBeInTheDocument()
  })
})

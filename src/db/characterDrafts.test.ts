import { afterEach, describe, expect, it } from 'vitest'
import { db } from './schema'
import { createDraft, deleteDraft, getDraft, listDrafts, saveDraft } from './characterDrafts'

describe('characterDrafts', () => {
  afterEach(async () => {
    await db.characterDrafts.clear()
  })

  it('cycle create → save → get', async () => {
    const draft = createDraft()
    expect(draft.currentStep).toBe('race')
    expect(draft.level).toBe(1)
    expect(draft.campaignId).toBeNull()

    draft.raceId = 'elf'
    await saveDraft(draft)

    const loaded = await getDraft(draft.id)
    expect(loaded?.raceId).toBe('elf')
    expect(loaded?.id).toBe(draft.id)
  })

  it('deleteDraft supprime le brouillon', async () => {
    const draft = createDraft()
    await saveDraft(draft)

    await deleteDraft(draft.id)

    expect(await getDraft(draft.id)).toBeUndefined()
  })

  it('listDrafts renvoie les brouillons triés par updatedAt décroissant', async () => {
    const older = { ...createDraft(), id: 'draft-older', updatedAt: '2026-01-01T00:00:00.000Z' }
    const newer = { ...createDraft(), id: 'draft-newer', updatedAt: '2026-06-01T00:00:00.000Z' }
    const middle = { ...createDraft(), id: 'draft-middle', updatedAt: '2026-03-01T00:00:00.000Z' }

    await db.characterDrafts.bulkAdd([older, newer, middle])

    const drafts = await listDrafts()

    expect(drafts.map((draft) => draft.id)).toEqual(['draft-newer', 'draft-middle', 'draft-older'])
  })
})

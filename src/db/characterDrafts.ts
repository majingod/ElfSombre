/**
 * Brouillons du créateur de personnage pas-à-pas (jalon 4.1). Voir
 * CLAUDE.md — "Données persistées" pour la convention de migration Dexie.
 */
import { db, type CharacterDraft } from './schema'

const CHARACTER_DRAFT_SCHEMA_VERSION = 1

export function createDraft(): CharacterDraft {
  const now = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    schemaVersion: CHARACTER_DRAFT_SCHEMA_VERSION,
    campaignId: null,
    currentStep: 'race',
    raceId: null,
    classId: null,
    level: 1,
    createdAt: now,
    updatedAt: now,
  }
}

export async function saveDraft(draft: CharacterDraft): Promise<CharacterDraft> {
  const saved: CharacterDraft = { ...draft, updatedAt: new Date().toISOString() }
  await db.characterDrafts.put(saved)
  return saved
}

export function getDraft(id: string): Promise<CharacterDraft | undefined> {
  return db.characterDrafts.get(id)
}

export async function listDrafts(): Promise<CharacterDraft[]> {
  const drafts = await db.characterDrafts.toArray()
  return drafts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function deleteDraft(id: string): Promise<void> {
  return db.characterDrafts.delete(id)
}

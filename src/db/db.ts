import Dexie, { type EntityTable } from 'dexie'

/**
 * Enregistrement de personnage persisté en IndexedDB. `schemaVersion` permet
 * des migrations Dexie chaînées (v1 → v2 → ...), jamais destructives sans
 * export automatique préalable (voir CLAUDE.md).
 */
export interface CharacterRecord {
  id: string
  schemaVersion: number
  name: string
  campaignId: string | null
  createdAt: string
  updatedAt: string
}

export class GrimoireDatabase extends Dexie {
  characters!: EntityTable<CharacterRecord, 'id'>

  constructor() {
    super('grimoire-3-5')

    this.version(1).stores({
      characters: 'id, campaignId, updatedAt',
    })
  }
}

export const db = new GrimoireDatabase()

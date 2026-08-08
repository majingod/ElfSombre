import Dexie, { type EntityTable } from 'dexie'

export interface CampaignRecord {
  id: string
  schemaVersion: number
  name: string
}

export interface CharacterRecord {
  id: string
  schemaVersion: number
  name: string
  campaignId: string | null
  updatedAt: string
}

/**
 * Brouillon du créateur de personnage pas-à-pas (jalon 4). `currentStep`
 * suit la progression dans l'assistant ; les étapes non encore construites
 * (caractéristiques, compétences, dons, équipement) n'ont pas de champ ici
 * tant qu'elles ne sont pas implémentées.
 */
export interface CharacterDraft {
  id: string
  schemaVersion: number
  campaignId: string | null
  currentStep: 'race' | 'class'
  raceId: string | null
  classId: string | null
  level: number
  createdAt: string
  updatedAt: string
}

/**
 * Convention de migration Dexie (voir CLAUDE.md — "Données persistées") :
 * chaque changement de forme des enregistrements ajoute une nouvelle
 * version chaînée, ex. `this.version(2).stores({...}).upgrade(tx => ...)`,
 * sans jamais modifier une version déjà publiée. Le champ `schemaVersion`
 * de chaque enregistrement indique la version au moment de l'écriture, ce
 * qui permet à l'`upgrade()` de ne migrer que les documents qui en ont
 * besoin. Toute migration qui supprime ou transforme des données de façon
 * destructive doit être précédée d'un export automatique des données
 * concernées.
 */
export class GrimoireDatabase extends Dexie {
  campaigns!: EntityTable<CampaignRecord, 'id'>
  characters!: EntityTable<CharacterRecord, 'id'>
  characterDrafts!: EntityTable<CharacterDraft, 'id'>

  constructor() {
    super('grimoire-3-5')

    this.version(1).stores({
      campaigns: 'id, name',
      characters: 'id, campaignId, updatedAt',
    })

    // v2 : ajout du store characterDrafts (jalon 4.1) — pure addition, aucune
    // transformation des enregistrements existants, donc pas d'upgrade().
    this.version(2).stores({
      campaigns: 'id, name',
      characters: 'id, campaignId, updatedAt',
      characterDrafts: 'id, updatedAt',
    })
  }
}

export const db = new GrimoireDatabase()

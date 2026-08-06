/**
 * Types TS du compendium SRD (couche 1) — races et classes de base.
 * Voir CLAUDE.md — "Architecture — trois couches".
 */

export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

export type SaveProgression = 'good' | 'poor'

export type BabProgression = 'full' | 'threeQuarter' | 'half'

export interface RaceDefinition {
  id: string
  name: string
  size: 'small' | 'medium'
  speed: number
  abilityAdjustments: Partial<Record<AbilityKey, number>>
  darkvision: number
  lowLightVision: boolean
  languages: { automatic: string[]; bonus: string[] }
  weaponProficiencies: string[]
  traits: string[]
  favoredClass: string
  levelAdjustment: number
  source: 'srd'
}

export interface ClassLevelEntry {
  level: number
  features: string[]
}

export interface ClassDefinition {
  id: string
  name: string
  hitDie: number
  babProgression: BabProgression
  saveProgressions: { fort: SaveProgression; ref: SaveProgression; will: SaveProgression }
  skillPointsBase: number
  classSkills: string[]
  levelFeatures: ClassLevelEntry[]
  spellcaster?: { type: 'prepared' | 'spontaneous'; ability: AbilityKey }
  source: 'srd'
}

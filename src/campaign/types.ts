import type { ValidationIssue } from '../engine/types'

export type { ValidationIssue }

export type AbilityGenerationMethod = 'freeform' | 'constrained-assign'

/**
 * Contrainte de génération des caractéristiques pour un profil de campagne.
 * `min`/`max` bornent chaque score ; `modifierSum`/`parity` sont des
 * contraintes optionnelles supplémentaires (répartition imposée par la
 * table). `evaluatedBeforeRacial` précise si ces contraintes s'appliquent
 * aux scores bruts (avant ajustements raciaux) ou après.
 */
export type AbilityGenerationProfile = {
  method: AbilityGenerationMethod
  modifierSum?: { op: 'eq' | 'lte'; value: number }
  parity?: { odd: number; even: number }
  min: number
  max: number
  evaluatedBeforeRacial: boolean
}

export type WealthItemCapRank = number | 'rest'

export type WealthItemCap = {
  rank: WealthItemCapRank
  pct: number
  gp: number
  inclusive?: boolean
}

/**
 * Richesse de départ. `null` signifie qu'aucune surcharge n'est définie par
 * le profil : le moteur applique la table SRD standard (or de départ par
 * classe).
 */
export type StartingWealth = {
  total: number
  itemCaps: WealthItemCap[]
} | null

export type CampaignProfile = {
  id: string
  name: string
  schemaVersion: number
  startingLevel: number
  abilityGeneration: AbilityGenerationProfile
  startingWealth: StartingWealth
  allowedSources: string[]
  customEntities: Record<string, unknown>
}

import type { CampaignProfile } from '../campaign/types'
import type { AbilityName, AbilityScores, ValidationIssue } from './types'

const ABILITY_ORDER: AbilityName[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function validateAbilityGeneration(
  scores: AbilityScores,
  profile: CampaignProfile,
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const { abilityGeneration } = profile
  const layer: ValidationIssue['layer'] = profile.id === 'base-3.5' ? 'core' : 'campaign'
  const campaignId = layer === 'campaign' ? profile.id : undefined

  for (const ability of ABILITY_ORDER) {
    const score = scores[ability]

    if (score < abilityGeneration.min) {
      issues.push({
        layer,
        severity: 'error',
        code: 'ABILITY_SCORE_BELOW_MIN',
        field: `abilities.${ability}`,
        message: `${ability} vaut ${score}, ce qui est inférieur au minimum autorisé (${abilityGeneration.min}).`,
        campaignId,
      })
    }

    if (score > abilityGeneration.max) {
      issues.push({
        layer,
        severity: 'error',
        code: 'ABILITY_SCORE_ABOVE_MAX',
        field: `abilities.${ability}`,
        message: `${ability} vaut ${score}, ce qui dépasse le maximum autorisé (${abilityGeneration.max}).`,
        campaignId,
      })
    }
  }

  if (abilityGeneration.modifierSum) {
    const sum = ABILITY_ORDER.reduce(
      (total, ability) => total + abilityModifier(scores[ability]),
      0,
    )
    const { op, value } = abilityGeneration.modifierSum
    const isValid = op === 'eq' ? sum === value : sum <= value

    if (!isValid) {
      issues.push({
        layer,
        severity: 'error',
        code: 'ABILITY_MOD_SUM',
        field: 'abilities',
        message:
          op === 'eq'
            ? `La somme des modificateurs (${sum}) doit être exactement ${value}.`
            : `La somme des modificateurs (${sum}) doit être inférieure ou égale à ${value}.`,
        campaignId,
      })
    }
  }

  if (abilityGeneration.parity) {
    const oddCount = ABILITY_ORDER.filter((ability) => scores[ability] % 2 !== 0).length
    const evenCount = ABILITY_ORDER.length - oddCount

    if (oddCount !== abilityGeneration.parity.odd || evenCount !== abilityGeneration.parity.even) {
      issues.push({
        layer,
        severity: 'error',
        code: 'ABILITY_PARITY',
        field: 'abilities',
        message: `La répartition pair/impair (${evenCount} pairs, ${oddCount} impairs) ne correspond pas à celle attendue (${abilityGeneration.parity.even} pairs, ${abilityGeneration.parity.odd} impairs).`,
        campaignId,
      })
    }
  }

  return issues
}

import type {
  AbilityName,
  AbilityScoreGenerationProfile,
  AbilityScores,
  ValidationIssue,
} from './types'

const ABILITY_ORDER: AbilityName[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function validateAbilityGeneration(
  scores: AbilityScores,
  profile: AbilityScoreGenerationProfile,
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const layer: ValidationIssue['layer'] = profile.campaignId ? 'campaign' : 'core'

  for (const ability of ABILITY_ORDER) {
    const score = scores[ability]

    if (profile.min !== undefined && score < profile.min) {
      issues.push({
        layer,
        severity: 'error',
        code: 'ABILITY_SCORE_BELOW_MIN',
        field: `abilities.${ability}`,
        message: `${ability} vaut ${score}, ce qui est inférieur au minimum autorisé (${profile.min}).`,
        campaignId: profile.campaignId,
      })
    }

    if (profile.max !== undefined && score > profile.max) {
      issues.push({
        layer,
        severity: 'error',
        code: 'ABILITY_SCORE_ABOVE_MAX',
        field: `abilities.${ability}`,
        message: `${ability} vaut ${score}, ce qui dépasse le maximum autorisé (${profile.max}).`,
        campaignId: profile.campaignId,
      })
    }
  }

  if (profile.modifierSum) {
    const sum = ABILITY_ORDER.reduce(
      (total, ability) => total + abilityModifier(scores[ability]),
      0,
    )
    const { op, value } = profile.modifierSum
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
        campaignId: profile.campaignId,
      })
    }
  }

  if (profile.parity) {
    const oddCount = ABILITY_ORDER.filter((ability) => scores[ability] % 2 !== 0).length
    const evenCount = ABILITY_ORDER.length - oddCount

    if (oddCount !== profile.parity.odd || evenCount !== profile.parity.even) {
      issues.push({
        layer,
        severity: 'error',
        code: 'ABILITY_PARITY',
        field: 'abilities',
        message: `La répartition pair/impair (${evenCount} pairs, ${oddCount} impairs) ne correspond pas à celle attendue (${profile.parity.even} pairs, ${profile.parity.odd} impairs).`,
        campaignId: profile.campaignId,
      })
    }
  }

  return issues
}

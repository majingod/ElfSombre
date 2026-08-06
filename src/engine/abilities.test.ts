import { describe, expect, it } from 'vitest'
import { abilityModifier, validateAbilityGeneration } from './abilities'
import type { AbilityScoreGenerationProfile, AbilityScores } from './types'

describe('abilityModifier', () => {
  it.each([
    [12, 1],
    [13, 1],
    [7, -2],
    [18, 4],
  ])('abilityModifier(%i) === %i', (score, expected) => {
    expect(abilityModifier(score)).toBe(expected)
  })
})

describe('validateAbilityGeneration', () => {
  const profile: AbilityScoreGenerationProfile = {
    min: 3,
    max: 18,
    modifierSum: { op: 'eq', value: 8 },
    parity: { odd: 3, even: 3 },
  }

  const validScores: AbilityScores = {
    str: 18,
    dex: 16,
    con: 14,
    int: 13,
    wis: 11,
    cha: 7,
  }

  it('accepte le jeu 18/16/14/13/11/7 (somme des mods = 8, parité 3/3)', () => {
    expect(validateAbilityGeneration(validScores, profile)).toEqual([])
  })

  it('rejette une somme de modificateurs incorrecte', () => {
    const scores: AbilityScores = { ...validScores, cha: 10 }
    const issues = validateAbilityGeneration(scores, profile)
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'ABILITY_MOD_SUM', layer: 'core' }),
    )
  })

  it('rejette une répartition pair/impair incorrecte', () => {
    const scores: AbilityScores = {
      str: 18,
      dex: 16,
      con: 14,
      int: 12,
      wis: 10,
      cha: 8,
    }
    const issues = validateAbilityGeneration(scores, profile)
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'ABILITY_PARITY', layer: 'core' }),
    )
  })

  it('rejette un score sous le minimum', () => {
    const scores: AbilityScores = { ...validScores, cha: 2 }
    const issues = validateAbilityGeneration(scores, profile)
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'ABILITY_SCORE_BELOW_MIN',
        field: 'abilities.cha',
      }),
    )
  })

  it('rejette un score au-dessus du maximum', () => {
    const scores: AbilityScores = { ...validScores, str: 20 }
    const issues = validateAbilityGeneration(scores, profile)
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'ABILITY_SCORE_ABOVE_MAX',
        field: 'abilities.str',
      }),
    )
  })

  it('marque les problèmes comme layer "campaign" quand le profil porte un campaignId', () => {
    const campaignProfile: AbilityScoreGenerationProfile = {
      ...profile,
      campaignId: 'table-du-vendredi',
    }
    const scores: AbilityScores = { ...validScores, cha: 10 }
    const issues = validateAbilityGeneration(scores, campaignProfile)
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'ABILITY_MOD_SUM',
        layer: 'campaign',
        campaignId: 'table-du-vendredi',
      }),
    )
  })
})

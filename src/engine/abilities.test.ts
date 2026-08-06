import { describe, expect, it } from 'vitest'
import { loadCampaignProfile } from '../campaign/loadProfile'
import { abilityModifier, validateAbilityGeneration } from './abilities'
import type { AbilityScores } from './types'

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
  const base35 = loadCampaignProfile('base-3.5')
  const exampleStrict = loadCampaignProfile('example-strict')

  const validScores: AbilityScores = {
    str: 18,
    dex: 16,
    con: 14,
    int: 13,
    wis: 11,
    cha: 7,
  }

  it('accepte le jeu 18/16/14/13/11/7 pour example-strict (somme des mods = 8, parité 3/3)', () => {
    expect(validateAbilityGeneration(validScores, exampleStrict)).toEqual([])
  })

  it('accepte le même jeu pour base-3.5 (aucune contrainte de somme/parité)', () => {
    expect(validateAbilityGeneration(validScores, base35)).toEqual([])
  })

  it('rejette une somme de modificateurs incorrecte (example-strict)', () => {
    const scores: AbilityScores = { ...validScores, cha: 10 }
    const issues = validateAbilityGeneration(scores, exampleStrict)
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'ABILITY_MOD_SUM', layer: 'campaign' }),
    )
  })

  it('rejette une répartition pair/impair incorrecte (example-strict)', () => {
    const scores: AbilityScores = {
      str: 18,
      dex: 16,
      con: 14,
      int: 12,
      wis: 10,
      cha: 8,
    }
    const issues = validateAbilityGeneration(scores, exampleStrict)
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'ABILITY_PARITY', layer: 'campaign' }),
    )
  })

  it('rejette un score sous le minimum', () => {
    const scores: AbilityScores = { ...validScores, cha: 2 }
    const issues = validateAbilityGeneration(scores, base35)
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'ABILITY_SCORE_BELOW_MIN',
        field: 'abilities.cha',
        layer: 'core',
      }),
    )
  })

  it('rejette un score au-dessus du maximum', () => {
    const scores: AbilityScores = { ...validScores, str: 20 }
    const issues = validateAbilityGeneration(scores, base35)
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'ABILITY_SCORE_ABOVE_MAX',
        field: 'abilities.str',
        layer: 'core',
      }),
    )
  })

  it('rejette un score sous le minimum de example-strict (6) même si valide pour base-3.5', () => {
    const scores: AbilityScores = { str: 6, dex: 6, con: 6, int: 6, wis: 6, cha: 6 }
    expect(validateAbilityGeneration(scores, base35)).toEqual([])

    const issues = validateAbilityGeneration({ ...scores, cha: 5 }, exampleStrict)
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'ABILITY_SCORE_BELOW_MIN',
        field: 'abilities.cha',
        layer: 'campaign',
        campaignId: 'example-strict',
      }),
    )
  })

  it('marque les problèmes comme layer "campaign" avec campaignId quand le profil n\'est pas base-3.5', () => {
    const scores: AbilityScores = { ...validScores, cha: 10 }
    const issues = validateAbilityGeneration(scores, exampleStrict)
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'ABILITY_MOD_SUM',
        layer: 'campaign',
        campaignId: 'example-strict',
      }),
    )
  })
})

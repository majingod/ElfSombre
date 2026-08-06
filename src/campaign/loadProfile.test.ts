import { describe, expect, it } from 'vitest'
import { loadCampaignProfile } from './loadProfile'

describe('loadCampaignProfile', () => {
  it('null et "base-3.5" renvoient le même profil', () => {
    expect(loadCampaignProfile(null)).toEqual(loadCampaignProfile('base-3.5'))
  })

  it('le profil de base est sans contrainte de somme/parité', () => {
    const profile = loadCampaignProfile('base-3.5')
    expect(profile.abilityGeneration.method).toBe('freeform')
    expect(profile.abilityGeneration.modifierSum).toBeUndefined()
    expect(profile.abilityGeneration.parity).toBeUndefined()
    expect(profile.abilityGeneration.min).toBe(3)
    expect(profile.abilityGeneration.max).toBe(18)
  })

  it('"example-strict" correspond aux valeurs de la fixture', () => {
    const profile = loadCampaignProfile('example-strict')
    expect(profile.startingLevel).toBe(6)
    expect(profile.abilityGeneration).toEqual({
      method: 'constrained-assign',
      modifierSum: { op: 'eq', value: 8 },
      parity: { odd: 3, even: 3 },
      min: 6,
      max: 18,
      evaluatedBeforeRacial: true,
    })
    expect(profile.startingWealth).toEqual({
      total: 13000,
      itemCaps: [
        { rank: 1, pct: 0.35, gp: 4550 },
        { rank: 2, pct: 0.25, gp: 3250 },
        { rank: 3, pct: 0.15, gp: 1950 },
        { rank: 'rest', pct: 0.1, gp: 1300, inclusive: false },
      ],
    })
  })

  it('un id inconnu lève une erreur claire', () => {
    expect(() => loadCampaignProfile('table-inconnue')).toThrow(/table-inconnue/)
  })
})

import { describe, expect, it } from 'vitest'
import { computeMaxRanks, computeSkillModifier } from './skills'

describe('computeSkillModifier', () => {
  it('additionne rangs, modificateur de caractéristique et bonus divers', () => {
    expect(
      computeSkillModifier({ ranks: 5, abilityMod: 3, synergyBonus: 2, miscBonus: 1 }),
    ).toBe(11)
  })

  it('sans bonus optionnels', () => {
    expect(computeSkillModifier({ ranks: 4, abilityMod: -1 })).toBe(3)
  })

  it("applique la pénalité d'armure quand la compétence y est sensible", () => {
    expect(
      computeSkillModifier({
        ranks: 5,
        abilityMod: 2,
        armorCheckPenalty: 3,
        affectedByArmorCheck: true,
      }),
    ).toBe(4)
  })

  it("n'applique pas la pénalité d'armure quand la compétence n'y est pas sensible", () => {
    expect(
      computeSkillModifier({
        ranks: 5,
        abilityMod: 2,
        armorCheckPenalty: 3,
        affectedByArmorCheck: false,
      }),
    ).toBe(7)
  })
})

describe('computeMaxRanks', () => {
  it('compétence de classe = level + 3', () => {
    expect(computeMaxRanks(1, true)).toBe(4)
  })

  it('compétence hors-classe = (level + 3) / 2, peut être un demi-rang', () => {
    expect(computeMaxRanks(2, false)).toBe(2.5)
  })

  it('compétence de classe niveau 10', () => {
    expect(computeMaxRanks(10, true)).toBe(13)
  })

  it('compétence hors-classe niveau 10', () => {
    expect(computeMaxRanks(10, false)).toBe(6.5)
  })
})

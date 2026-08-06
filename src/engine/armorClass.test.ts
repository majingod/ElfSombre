import { describe, expect, it } from 'vitest'
import { computeAC } from './armorClass'

describe('computeAC', () => {
  it('plafonne le bonus de Dextérité au maxDexBonus', () => {
    expect(
      computeAC({
        armorBonus: 4,
        shieldBonus: 0,
        dexMod: 3,
        maxDexBonus: 2,
        sizeModifier: 0,
        naturalArmor: 0,
        deflection: 0,
        dodge: 0,
        misc: 0,
      }),
    ).toBe(16)
  })

  it('sans maxDexBonus, le bonus de Dextérité complet est appliqué', () => {
    expect(
      computeAC({
        armorBonus: 0,
        shieldBonus: 0,
        dexMod: 5,
        sizeModifier: 0,
        naturalArmor: 0,
        deflection: 0,
        dodge: 0,
        misc: 0,
      }),
    ).toBe(15)
  })

  it('personnage sans armure, taille Petit (+1)', () => {
    expect(
      computeAC({
        armorBonus: 0,
        shieldBonus: 0,
        dexMod: 0,
        sizeModifier: 1,
        naturalArmor: 0,
        deflection: 0,
        dodge: 0,
        misc: 0,
      }),
    ).toBe(11)
  })

  it('cumule tous les bonus (armure complète, taille Moyen)', () => {
    expect(
      computeAC({
        armorBonus: 8,
        shieldBonus: 2,
        dexMod: -1,
        maxDexBonus: 0,
        sizeModifier: 0,
        naturalArmor: 3,
        deflection: 1,
        dodge: 1,
        misc: 1,
      }),
    ).toBe(25)
  })

  it('un maxDexBonus négatif peut infliger une pénalité de Dextérité', () => {
    expect(
      computeAC({
        armorBonus: 0,
        shieldBonus: 0,
        dexMod: 2,
        maxDexBonus: -2,
        sizeModifier: 0,
        naturalArmor: 0,
        deflection: 0,
        dodge: 0,
        misc: 0,
      }),
    ).toBe(8)
  })
})

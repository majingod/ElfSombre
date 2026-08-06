import { describe, expect, it } from 'vitest'
import { computeMaxHP } from './hitPoints'

describe('computeMaxHP', () => {
  it('niveau 1 = toujours hitDie + conMod, quelle que soit la méthode', () => {
    expect(computeMaxHP(10, 1, 2)).toBe(12)
    expect(computeMaxHP(10, 1, 2, 'max')).toBe(12)
    expect(computeMaxHP(10, 1, 2, 'manual', { manualRolls: [] })).toBe(12)
  })

  it("méthode 'average' (par défaut)", () => {
    expect(computeMaxHP(10, 6, 2, 'average')).toBe(12 + 5 * (Math.ceil((10 + 1) / 2) + 2))
    expect(computeMaxHP(10, 6, 2)).toBe(52)
  })

  it("méthode 'max'", () => {
    expect(computeMaxHP(10, 6, 2, 'max')).toBe(72)
  })

  it("méthode 'manual' utilise les jets fournis par le joueur", () => {
    expect(computeMaxHP(10, 6, 2, 'manual', { manualRolls: [7, 4, 9, 10, 6] })).toBe(58)
  })

  it("méthode 'roll' est déterministe avec un rng injecté (proche du max)", () => {
    expect(computeMaxHP(10, 3, 2, 'roll', { rng: () => 0.999 })).toBe(12 + 2 * (10 + 2))
  })

  it("méthode 'roll' ne casse pas avec un rng renvoyant 0 (jet minimum)", () => {
    expect(computeMaxHP(10, 3, 2, 'roll', { rng: () => 0 })).toBe(12 + 2 * (1 + 2))
  })

  it('jamais moins de 1 PV par niveau après application du modificateur de Constitution', () => {
    expect(computeMaxHP(4, 5, -4, 'manual', { manualRolls: [1, 1, 1, 1] })).toBe(5)
  })

  it('la méthode manual est robuste à un jet manquant (traité comme 0)', () => {
    expect(computeMaxHP(8, 2, 1, 'manual', { manualRolls: [] })).toBe(10)
  })
})

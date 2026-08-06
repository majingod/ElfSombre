import { describe, expect, it } from 'vitest'
import { computeBAB, computeSaveBonus } from './combat'

describe('computeBAB', () => {
  it("'full' niveau 20 : attaques itératives tous les 5 points", () => {
    expect(computeBAB('full', 20)).toEqual([20, 15, 10, 5])
  })

  it("'full' niveau 1", () => {
    expect(computeBAB('full', 1)).toEqual([1])
  })

  it("'half' niveau 6 : BAB 3 < 6, pas d'itératif", () => {
    expect(computeBAB('half', 6)).toEqual([3])
  })

  it("'half' niveau 16 : BAB 8 >= 6, une itération", () => {
    expect(computeBAB('half', 16)).toEqual([8, 3])
  })

  it("'half' niveau 12 : BAB 6, seuil exact d'itération", () => {
    expect(computeBAB('half', 12)).toEqual([6, 1])
  })

  it("'threeQuarter' niveau 20", () => {
    expect(computeBAB('threeQuarter', 20)).toEqual([15, 10, 5])
  })

  it("'threeQuarter' niveau 1", () => {
    expect(computeBAB('threeQuarter', 1)).toEqual([0])
  })

  it('niveau 0 pour toutes les progressions', () => {
    expect(computeBAB('full', 0)).toEqual([0])
    expect(computeBAB('half', 0)).toEqual([0])
    expect(computeBAB('threeQuarter', 0)).toEqual([0])
  })
})

describe('computeSaveBonus', () => {
  it("'good' niveau 6 recoupe la table du Guerrier (Fort +5)", () => {
    expect(computeSaveBonus('good', 6)).toBe(5)
  })

  it("'poor' niveau 6 recoupe la table du Guerrier (Réf/Vol +2)", () => {
    expect(computeSaveBonus('poor', 6)).toBe(2)
  })

  it("'good' niveau 1", () => {
    expect(computeSaveBonus('good', 1)).toBe(2)
  })

  it("'poor' niveau 1", () => {
    expect(computeSaveBonus('poor', 1)).toBe(0)
  })
})

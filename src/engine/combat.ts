/**
 * Bonus de base à l'attaque (BAB) et jets de sauvegarde — SRD 3.5.
 * Voir CLAUDE.md — "Interdits absolus" (règles 3.5 uniquement).
 */
import type { BabProgression, SaveProgression } from '../data/types'

function babFromValue(bab: number): number[] {
  if (bab < 6) return [bab]

  const attacks: number[] = []
  for (let value = bab; value > 0; value -= 5) {
    attacks.push(value)
  }
  return attacks
}

export function computeBAB(progression: BabProgression, level: number): number[] {
  const bab =
    progression === 'full'
      ? level
      : progression === 'threeQuarter'
        ? Math.floor((level * 3) / 4)
        : Math.floor(level / 2)

  return babFromValue(bab)
}

export function computeSaveBonus(progression: SaveProgression, level: number): number {
  return progression === 'good' ? Math.floor(level / 2) + 2 : Math.floor(level / 3)
}

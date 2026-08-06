/**
 * Points de vie maximum — SRD 3.5.
 * Voir CLAUDE.md — "Interdits absolus" (règles 3.5 uniquement).
 */

export type HitPointMethod = 'average' | 'max' | 'roll' | 'manual'

export interface ComputeMaxHPOptions {
  manualRolls?: number[]
  rng?: () => number
}

function hpForLevel(
  hitDie: number,
  conMod: number,
  method: HitPointMethod,
  levelIndex: number,
  options: ComputeMaxHPOptions,
): number {
  const roll =
    method === 'average'
      ? Math.ceil((hitDie + 1) / 2)
      : method === 'max'
        ? hitDie
        : method === 'manual'
          ? (options.manualRolls?.[levelIndex] ?? 0)
          : Math.floor((options.rng ?? Math.random)() * hitDie) + 1

  return Math.max(1, roll + conMod)
}

export function computeMaxHP(
  hitDie: number,
  level: number,
  conMod: number,
  method: HitPointMethod = 'average',
  options: ComputeMaxHPOptions = {},
): number {
  let total = Math.max(1, hitDie + conMod)

  for (let level_ = 2; level_ <= level; level_++) {
    total += hpForLevel(hitDie, conMod, method, level_ - 2, options)
  }

  return total
}

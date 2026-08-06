/**
 * Classe d'armure (CA) — SRD 3.5.
 * Voir CLAUDE.md — "Interdits absolus" (règles 3.5 uniquement).
 */

export interface ComputeACParams {
  armorBonus: number
  shieldBonus: number
  dexMod: number
  maxDexBonus?: number
  sizeModifier: number
  naturalArmor: number
  deflection: number
  dodge: number
  misc: number
}

export function computeAC(params: ComputeACParams): number {
  const {
    armorBonus,
    shieldBonus,
    dexMod,
    maxDexBonus,
    sizeModifier,
    naturalArmor,
    deflection,
    dodge,
    misc,
  } = params

  const effectiveDexBonus = Math.min(dexMod, maxDexBonus ?? Infinity)

  return (
    10 +
    armorBonus +
    shieldBonus +
    effectiveDexBonus +
    sizeModifier +
    naturalArmor +
    deflection +
    dodge +
    misc
  )
}

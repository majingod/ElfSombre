/**
 * Compétences — modificateur total et rangs maximum — SRD 3.5.
 * Voir CLAUDE.md — "Interdits absolus" (règles 3.5 uniquement).
 */

export interface ComputeSkillModifierParams {
  ranks: number
  abilityMod: number
  synergyBonus?: number
  miscBonus?: number
  armorCheckPenalty?: number
  affectedByArmorCheck?: boolean
}

export function computeSkillModifier(params: ComputeSkillModifierParams): number {
  const {
    ranks,
    abilityMod,
    synergyBonus = 0,
    miscBonus = 0,
    armorCheckPenalty = 0,
    affectedByArmorCheck = false,
  } = params

  const penalty = affectedByArmorCheck ? armorCheckPenalty : 0

  return ranks + abilityMod + synergyBonus + miscBonus - penalty
}

export function computeMaxRanks(level: number, isClassSkill: boolean): number {
  const classSkillMax = level + 3
  return isClassSkill ? classSkillMax : classSkillMax / 2
}

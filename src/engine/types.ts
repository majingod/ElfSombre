/**
 * Contrat de validation partagé par les trois couches (core / sources / campaign).
 * Voir CLAUDE.md — "Contrat de validation".
 */
export type ValidationIssue = {
  layer: 'core' | 'sources' | 'campaign'
  severity: 'error' | 'warning' | 'info'
  code: string
  field: string
  message: string
  campaignId?: string
}

export type AbilityName = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

export type AbilityScores = Record<AbilityName, number>

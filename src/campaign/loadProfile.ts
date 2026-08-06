import type { CampaignProfile } from './types'
import base35Profile from './profiles/base-3.5.json'
import exampleStrictProfile from './profiles/example-strict.json'

const PROFILES: Record<string, CampaignProfile> = {
  'base-3.5': base35Profile as CampaignProfile,
  'example-strict': exampleStrictProfile as CampaignProfile,
}

/**
 * `id` null équivaut à "base-3.5" : D&D 3.5 pur, sans surcharge de
 * campagne (voir CLAUDE.md — Couche 2).
 */
export function loadCampaignProfile(id: string | null): CampaignProfile {
  const key = id ?? 'base-3.5'
  const profile = PROFILES[key]

  if (!profile) {
    throw new Error(`Profil de campagne inconnu : "${id}".`)
  }

  return profile
}

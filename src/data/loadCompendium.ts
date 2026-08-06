/**
 * Chargement du compendium SRD (couche 1) depuis `public/data/`, précaché
 * par le service worker. Le chemin tient compte de `base: '/ElfSombre/'`
 * (vite.config.ts) via `import.meta.env.BASE_URL`.
 */
import type { ClassDefinition, RaceDefinition } from './types'

async function fetchCompendiumJson<T>(fileName: string): Promise<T> {
  const url = `${import.meta.env.BASE_URL}data/${fileName}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Échec du chargement du compendium "${fileName}" (${response.status}).`)
  }

  return response.json() as Promise<T>
}

export function loadRaces(): Promise<RaceDefinition[]> {
  return fetchCompendiumJson<RaceDefinition[]>('races-srd.json')
}

export function loadClasses(): Promise<ClassDefinition[]> {
  return fetchCompendiumJson<ClassDefinition[]>('classes-srd.json')
}

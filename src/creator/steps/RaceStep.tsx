import { useEffect, useState } from 'react'
import { loadRaces } from '../../data/loadCompendium'
import type { AbilityKey, RaceDefinition } from '../../data/types'

const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: 'For',
  dex: 'Dex',
  con: 'Con',
  int: 'Int',
  wis: 'Sag',
  cha: 'Cha',
}

function summarizeRace(race: RaceDefinition): string {
  const parts: string[] = []

  const adjustments = Object.entries(race.abilityAdjustments).map(
    ([ability, value]) => `${value > 0 ? '+' : ''}${value} ${ABILITY_LABELS[ability as AbilityKey]}`,
  )
  if (adjustments.length > 0) parts.push(adjustments.join(', '))

  if (race.darkvision > 0) parts.push(`Vision dans le noir ${race.darkvision} m`)
  if (race.lowLightVision) parts.push('Vision nocturne')
  if (race.traits.length > 0) parts.push(race.traits.join(', '))

  return parts.length > 0 ? parts.join(' · ') : 'Aucun trait particulier'
}

interface RaceStepProps {
  selectedRaceId: string | null
  onSelect: (raceId: string) => void
}

export function RaceStep({ selectedRaceId, onSelect }: RaceStepProps) {
  const [races, setRaces] = useState<RaceDefinition[] | null>(null)

  useEffect(() => {
    let cancelled = false
    loadRaces().then((loaded) => {
      if (!cancelled) setRaces(loaded)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!races) {
    return <p className="text-slate-400">Chargement des races…</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {races.map((race) => {
        const selected = race.id === selectedRaceId
        return (
          <li key={race.id}>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(race.id)}
              className={`w-full rounded border px-3 py-2 text-left ${
                selected ? 'border-purple-400 bg-purple-950' : 'border-slate-700'
              }`}
            >
              <span className="block font-semibold">{race.name}</span>
              <span className="block text-sm text-slate-400">{summarizeRace(race)}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

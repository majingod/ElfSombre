import { useEffect, useState } from 'react'
import { loadClasses } from '../../data/loadCompendium'
import type { BabProgression, ClassDefinition } from '../../data/types'

const BAB_LABELS: Record<BabProgression, string> = {
  full: 'BAB plein',
  threeQuarter: 'BAB aux 3/4',
  half: 'BAB à la moitié',
}

function summarizeClass(klass: ClassDefinition): string {
  const parts = [BAB_LABELS[klass.babProgression]]

  parts.push(
    klass.spellcaster
      ? `Lanceur de sorts ${klass.spellcaster.type === 'prepared' ? 'préparés' : 'spontanés'}`
      : 'Non lanceur de sorts',
  )

  return parts.join(' · ')
}

interface ClassStepProps {
  selectedClassId: string | null
  onSelect: (classId: string) => void
}

export function ClassStep({ selectedClassId, onSelect }: ClassStepProps) {
  const [classes, setClasses] = useState<ClassDefinition[] | null>(null)

  useEffect(() => {
    let cancelled = false
    loadClasses().then((loaded) => {
      if (!cancelled) setClasses(loaded)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!classes) {
    return <p className="text-slate-400">Chargement des classes…</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {classes.map((klass) => {
        const selected = klass.id === selectedClassId
        return (
          <li key={klass.id}>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(klass.id)}
              className={`w-full rounded border px-3 py-2 text-left ${
                selected ? 'border-purple-400 bg-purple-950' : 'border-slate-700'
              }`}
            >
              <span className="block font-semibold">{klass.name}</span>
              <span className="block text-sm text-slate-400">{summarizeClass(klass)}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

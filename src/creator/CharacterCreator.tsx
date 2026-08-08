import { useState } from 'react'
import { saveDraft } from '../db/characterDrafts'
import type { CharacterDraft } from '../db/schema'
import { RaceStep } from './steps/RaceStep'
import { ClassStep } from './steps/ClassStep'

/**
 * Étapes du créateur (jalon 4.1 : uniquement Race + Classe). Les tâches
 * suivantes du jalon 4 ajouteront ici Caractéristiques, Compétences, Dons,
 * Équipement sans réécrire la navigation.
 */
const STEPS = ['race', 'class'] as const
type Step = (typeof STEPS)[number]

const STEP_LABELS: Record<Step, string> = {
  race: 'Race',
  class: 'Classe',
}

interface CharacterCreatorProps {
  draft: CharacterDraft
}

export function CharacterCreator({ draft: initialDraft }: CharacterCreatorProps) {
  const [draft, setDraft] = useState(initialDraft)
  const stepIndex = STEPS.indexOf(draft.currentStep)

  async function applyPatch(patch: Partial<CharacterDraft>) {
    const updated = { ...draft, ...patch }
    setDraft(updated)
    await saveDraft(updated)
  }

  function goToStep(index: number) {
    const step = STEPS[index]
    if (step) void applyPatch({ currentStep: step })
  }

  const isLastStep = stepIndex === STEPS.length - 1
  const canGoNext = draft.currentStep === 'race' ? Boolean(draft.raceId) : false

  return (
    <main className="flex min-h-svh flex-col items-center gap-6 bg-slate-950 px-4 py-8 text-slate-100">
      <h1 className="text-2xl font-semibold">Créateur de personnage</h1>
      <p className="text-sm text-slate-400">
        Étape {stepIndex + 1}/{STEPS.length} — {STEP_LABELS[draft.currentStep]}
      </p>

      <div className="w-full max-w-md">
        {draft.currentStep === 'race' && (
          <RaceStep selectedRaceId={draft.raceId} onSelect={(raceId) => void applyPatch({ raceId })} />
        )}
        {draft.currentStep === 'class' && (
          <ClassStep selectedClassId={draft.classId} onSelect={(classId) => void applyPatch({ classId })} />
        )}
      </div>

      {isLastStep && draft.classId && (
        <p className="text-sm text-slate-400">Étape Caractéristiques — bientôt disponible</p>
      )}

      <div className="flex w-full max-w-md justify-between">
        <button
          type="button"
          disabled={stepIndex === 0}
          onClick={() => goToStep(stepIndex - 1)}
          className="rounded border border-slate-700 px-4 py-2 disabled:opacity-40"
        >
          Précédent
        </button>
        <button
          type="button"
          disabled={isLastStep || !canGoNext}
          onClick={() => goToStep(stepIndex + 1)}
          className="rounded border border-slate-700 px-4 py-2 disabled:opacity-40"
        >
          Suivant
        </button>
      </div>
    </main>
  )
}

import { useEffect, useState } from 'react'
import { CharacterCreator } from './creator/CharacterCreator'
import { createDraft, listDrafts, saveDraft } from './db/characterDrafts'
import type { CharacterDraft } from './db/schema'

type Screen = { name: 'home' } | { name: 'creator'; draft: CharacterDraft }

function App() {
  const [swStatus, setSwStatus] = useState<'unsupported' | 'attente' | 'actif'>(
    'attente',
  )
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const [latestDraft, setLatestDraft] = useState<CharacterDraft | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setSwStatus('unsupported')
      return
    }
    navigator.serviceWorker.ready.then(() => setSwStatus('actif'))
  }, [])

  useEffect(() => {
    if (screen.name !== 'home') return
    let cancelled = false
    listDrafts().then((drafts) => {
      if (!cancelled) setLatestDraft(drafts[0] ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [screen.name])

  async function handleCreate() {
    const draft = await saveDraft(createDraft())
    setScreen({ name: 'creator', draft })
  }

  function handleResume() {
    if (!latestDraft) return
    setScreen({ name: 'creator', draft: latestDraft })
  }

  if (screen.name === 'creator') {
    return <CharacterCreator draft={screen.draft} />
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100">
      <h1 className="text-4xl font-semibold">Grimoire 3.5</h1>
      <p className="text-slate-400">
        Compagnon de joueur D&amp;D 3.5 — 100 % hors-ligne
      </p>
      <p className="rounded border border-slate-700 px-3 py-1 text-sm">
        Service worker :{' '}
        {swStatus === 'actif'
          ? 'actif'
          : swStatus === 'unsupported'
            ? 'non supporté'
            : 'en attente…'}
      </p>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => void handleCreate()}
          className="rounded border border-purple-400 bg-purple-950 px-4 py-2"
        >
          Créer un personnage
        </button>
        {latestDraft && (
          <button
            type="button"
            onClick={handleResume}
            className="rounded border border-slate-700 px-4 py-2"
          >
            Reprendre la création en cours
          </button>
        )}
      </div>
    </main>
  )
}

export default App

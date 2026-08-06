import { useEffect, useState } from 'react'

function App() {
  const [swStatus, setSwStatus] = useState<'unsupported' | 'attente' | 'actif'>(
    'attente',
  )

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setSwStatus('unsupported')
      return
    }
    navigator.serviceWorker.ready.then(() => setSwStatus('actif'))
  }, [])

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
    </main>
  )
}

export default App

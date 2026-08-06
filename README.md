# Grimoire 3.5.1

PWA compagnon de joueur pour D&D **édition 3.5** — fiche de personnage à
calculs automatiques, créateur pas-à-pas, compendium hors-ligne.
100 % autonome : aucun backend, aucune API appelée à l'exécution.

Voir [CLAUDE.md](./CLAUDE.md) pour l'architecture et les conventions du
projet, et [JOURNAL.md](./JOURNAL.md) pour l'historique des décisions.

## Commandes

```sh
npm run dev       # serveur de développement
npm test          # tests Vitest
npm run build     # build de production (base '/ElfSombre/')
npm run preview   # sert le build de production localement
```

## Stack

React + TypeScript + Vite · Tailwind CSS · vite-plugin-pwa (Workbox) ·
Dexie (IndexedDB) · Vitest.

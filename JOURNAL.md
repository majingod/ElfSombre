# Journal

## 2026-08-06 — Scaffolding initial du projet

**Fait**
- Initialisation Vite + React + TypeScript.
- Ajout de Tailwind CSS (`@tailwindcss/vite`), `vite-plugin-pwa` (manifest
  français "Grimoire 3.5", icônes placeholder 192/512, `display: standalone`,
  precache Workbox incluant `public/data/*.json`), Dexie et Vitest
  (+ Testing Library, jsdom).
- `vite.config.ts` configuré avec `base: '/ElfSombre/'` pour GitHub Pages.
- Structure de dossiers posée : `src/engine/` (moteur 3.5 pur),
  `src/campaign/` (profils de campagne), `src/data/` (types du compendium),
  `src/db/` (Dexie + schéma versionné), `src/ui/` (composants),
  `public/data/` (compendium JSON, vide pour l'instant).
- Premier module moteur : `src/engine/abilities.ts`
  (`abilityModifier`, `validateAbilityGeneration`) avec le contrat
  `ValidationIssue` de CLAUDE.md, testé en Vitest (modificateurs, somme des
  modificateurs, parité, min/max, distinction layer `core`/`campaign`).
- Workflow GitHub Actions : tests + build sur chaque PR ; tests + build +
  déploiement GitHub Pages sur push vers `main`.
- `LICENSES/OGL.txt` créé (texte de la licence à coller ultérieurement).
- App minimale affichant "Grimoire 3.5" et l'état du service worker.
- `navigator.storage.persist()` appelé au premier lancement (`src/main.tsx`).

**Décisions prises**
- `validateAbilityGeneration` tague chaque `ValidationIssue` en layer `core`
  si le profil ne porte pas de `campaignId`, sinon en layer `campaign` — le
  moteur reste agnostique de la campagne, c'est la présence d'un
  `campaignId` sur le profil qui détermine la couche responsable du refus.
- Tailwind CSS v4 via le plugin Vite officiel (pas de fichier de config
  séparé, tout passe par `@import 'tailwindcss'` dans `src/index.css`).
- Icônes PWA générées en placeholder (PNG uni violet) en attendant un
  vrai visuel.

**Prochaine étape**
- Premier profil de campagne réel dans `src/campaign/`.
- Début du compendium SRD (`public/data/*.json` + types dans
  `src/data/compendium.ts`).
- Fiche de personnage (calculs automatiques) et créateur pas-à-pas.

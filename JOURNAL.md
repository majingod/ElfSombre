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

## 2026-08-06 — Profils de campagne + moteur de caractéristiques complet

**Fait**
- `src/campaign/types.ts` : type `CampaignProfile` (id, name, schemaVersion,
  startingLevel, `abilityGeneration` {method, modifierSum?, parity?, min,
  max, evaluatedBeforeRacial}, startingWealth, allowedSources,
  customEntities). Réutilise `ValidationIssue` de `src/engine/types.ts` sans
  le dupliquer.
- `src/campaign/profiles/base-3.5.json` : profil sans surcharge
  (`method: "freeform"`, min 3, max 18, `startingWealth: null`).
- `src/campaign/profiles/example-strict.json` : fixture de **test**
  générique à contraintes strictes (somme des mods = 8, parité 3/3, min 6
  max 18, niveau de départ 6, richesse 13000 po avec 4 plafonds). Elle ne
  représente aucune campagne réelle — pas de nom, maison ou lore de table.
- `src/campaign/loadProfile.ts` : `loadCampaignProfile(id)` — `null` ou
  `"base-3.5"` renvoient le profil de base ; un id inconnu lève une erreur.
- `src/engine/abilities.ts` : `validateAbilityGeneration(scores, profile)`
  consomme désormais un `CampaignProfile` complet au lieu de paramètres
  séparés ; `abilityModifier` inchangé.
- `src/db/schema.ts` (remplace `src/db/db.ts`) : tables Dexie `campaigns`
  (id, name) et `characters` (id, name, campaignId nullable, updatedAt),
  `schemaVersion = 1`, avec commentaire sur la convention de migration
  attendue pour v2.
- Tests Vitest pour `loadCampaignProfile`, `validateAbilityGeneration` sur
  les deux profils, et Dexie (personnage avec `campaignId` null puis avec
  `"example-strict"`). Ajout de `fake-indexeddb` en devDependency pour que
  Dexie fonctionne sous jsdom en test.

**Décisions prises**
- La tâche demandait initialement un profil `xilthren-veyl.json` recopiant
  un document de campagne (`campagne-xilthren-veyl.md`) absent du repo et
  de tout l'historique git. Conformément à l'interdit n°2/3 de CLAUDE.md
  (jamais inventer de contenu de campagne, jamais le committer ici), ce
  profil n'a pas été créé ; `example-strict.json` le remplace comme fixture
  de test neutre portant les mêmes contraintes numériques.
- `layer` dans `validateAbilityGeneration` vaut `'core'` si
  `profile.id === 'base-3.5'`, `'campaign'` sinon (avec `campaignId =
  profile.id`) — le moteur reste agnostique de la campagne, c'est l'id du
  profil chargé qui détermine la couche responsable du refus.
- `startingWealth` est `null` dans le profil de base : ceci signifie
  « aucune surcharge », le moteur devra retomber sur la table SRD standard
  d'or de départ par classe (à implémenter) plutôt que sur un total fixe
  arbitraire.

**Prochaine étape**
- Début du compendium SRD (`public/data/*.json` + types dans
  `src/data/compendium.ts`).
- Fiche de personnage (calculs automatiques) et créateur pas-à-pas.

## 2026-08-06 — Schémas TS du compendium + premier import SRD

**Fait**
- `src/data/types.ts` : `AbilityKey`, `SaveProgression`, `BabProgression`,
  `RaceDefinition`, `ClassLevelEntry`, `ClassDefinition`.
- `public/data/races-srd.json` : 4 races SRD (humain, elfe, nain, drow).
- `public/data/classes-srd.json` : 2 classes de base SRD (guerrier,
  magicien).
- `src/data/loadCompendium.ts` : `loadRaces()` / `loadClasses()` — `fetch`
  vers `public/data/*.json` avec `import.meta.env.BASE_URL` pour rester
  compatible avec `base: '/ElfSombre/'`.
- Tests Vitest (`loadCompendium.test.ts`) : `fetch` mocké via
  `vi.stubGlobal` renvoyant les fixtures JSON importées statiquement ;
  valeurs verrouillées (`elf.abilityAdjustments.dex`,
  `drow.levelAdjustment`, `fighter.babProgression`,
  `wizard.spellcaster.ability`, `wizard.levelFeatures[level:1]`).

**Décisions prises**
- `loadCompendium.ts` utilise `fetch` (et non un import statique) car
  `public/data/` n'est pas précaché par le graphe de modules Vite — c'est
  le service worker qui le précache pour l'usage hors-ligne à l'exécution.
- Le mock de `fetch` dans les tests importe les fixtures JSON directement
  (`resolveJsonModule`) plutôt que de lire le disque via `node:fs`, pour
  éviter d'ajouter les types Node à `tsconfig.app.json`.

**Prochaine étape**
- Étoffer le compendium (dons, sorts, objets) et faire converger
  `src/data/compendium.ts` avec ces nouveaux types spécifiques.
- Fiche de personnage (calculs automatiques) et créateur pas-à-pas.

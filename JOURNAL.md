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

## 2026-08-06 — Moteur de combat/PV/CA/compétences (couche 0)

**Fait**
- `src/engine/combat.ts` : `computeBAB(progression, level)` — séquence
  d'attaques (attaque itérative tous les 5 points de BAB au-dessus de 0,
  jamais sous BAB 6) ; `computeSaveBonus(progression, level)` — 'good' =
  `floor(level/2)+2`, 'poor' = `floor(level/3)`. Réutilise les types
  `BabProgression`/`SaveProgression` déjà définis dans `src/data/types.ts`
  plutôt que de les redéfinir dans le moteur.
- `src/engine/hitPoints.ts` : `computeMaxHP(hitDie, level, conMod, method,
  options)` — 1er niveau toujours `hitDie + conMod` ; niveaux suivants
  selon `method` ('average' | 'max' | 'roll' | 'manual'), `rng` et
  `manualRolls` injectables ; jamais moins de 1 PV par niveau.
- `src/engine/armorClass.ts` : `computeAC(params)` — somme des bonus de CA
  avec bonus de Dextérité plafonné par `maxDexBonus`.
- `src/engine/skills.ts` : `computeSkillModifier(params)` — rangs +
  modificateur + synergie + divers − pénalité d'armure (si applicable) ;
  `computeMaxRanks(level, isClassSkill)` — `level+3` en classe,
  `(level+3)/2` hors-classe (peut être un demi-rang).
- Tests Vitest exhaustifs pour les 4 modules (58 tests au total dans le
  dépôt, tous verts), verrouillant les valeurs imposées par la tâche
  (BAB full 20, half 6/16, jets Guerrier niveau 6, PV average/max/manual/
  roll, CA avec Dex plafonnée, rangs max classe/hors-classe).

**Décisions prises**
- `armorCheckPenalty` est une magnitude positive (ex. 3 pour une pénalité
  de −3) soustraite au modificateur total quand `affectedByArmorCheck`
  est vrai — convention choisie faute de précédent dans le dépôt.
- La règle « jamais moins de 1 PV par niveau » s'applique aussi au 1er
  niveau (pas seulement aux niveaux suivants), pour rester cohérente avec
  un `conMod` très négatif sur un petit dé de vie.
- `computeMaxHP` reste pure : la méthode 'roll' ne lance jamais de dé
  elle-même sans qu'un `rng` soit fourni ou implicite (`Math.random` par
  défaut, toujours injectable) — aucune des 4 méthodes n'est favorisée
  dans l'implémentation.

**Prochaine étape**
- Brancher ces fonctions de moteur sur `useCharacterCalculations` côté UI
  (jalon fiche de personnage).
- Étoffer le compendium (dons, sorts, objets).

## 2026-08-08 — Jalon 4.1 : squelette du créateur de personnage (Race + Classe)

**Fait**
- `src/db/schema.ts` : nouvelle interface `CharacterDraft` (id,
  schemaVersion, campaignId nullable, `currentStep: 'race' | 'class'`,
  raceId/classId nullables, level, createdAt/updatedAt) et store Dexie
  `characterDrafts: 'id, updatedAt'` ajouté en `version(2)` — pure addition
  de store, aucune transformation des enregistrements existants, donc pas
  d'`upgrade()`.
- `src/db/characterDrafts.ts` : `createDraft()` (factory pure, `level: 1`,
  `campaignId: null`, `currentStep: 'race'`), `saveDraft(draft)` (upsert
  avec `updatedAt` rafraîchi), `getDraft(id)`, `listDrafts()` (triés par
  `updatedAt` décroissant), `deleteDraft(id)`. Tests Vitest : cycle
  create → save → get, suppression, tri de `listDrafts()`.
- `src/creator/CharacterCreator.tsx` : wizard générique piloté par un
  tableau `STEPS = ['race', 'class']` — ajouter une étape future (jalon
  4.2+) n'impose pas de réécrire la navigation. Indicateur "Étape N/2 —
  Nom", boutons Précédent/Suivant, autosave Dexie (`saveDraft`) à chaque
  sélection et à chaque changement d'étape. Sur l'étape Classe, une fois
  `classId` renseigné : bouton Suivant désactivé + message "Étape
  Caractéristiques — bientôt disponible" (l'étape elle-même n'est pas
  construite, conformément au scope de la tâche).
- `src/creator/steps/RaceStep.tsx` / `ClassStep.tsx` : listent les
  races/classes via `loadRaces()`/`loadClasses()` (compendium déjà importé
  au jalon 3), résumé court (ajustements de caractéristiques, vision,
  traits pour les races ; progression BAB et type de lanceur de sorts pour
  les classes), sélection simple qui écrit `raceId`/`classId` dans le
  brouillon.
- `src/App.tsx` : écran d'accueil remplacé par titre "Grimoire 3.5",
  statut PWA/SW conservé, bouton "Créer un personnage" (crée + persiste un
  nouveau brouillon puis ouvre le créateur), et "Reprendre la création en
  cours" affiché uniquement si `listDrafts()` renvoie au moins un
  brouillon (charge le plus récent).
- Tests Vitest (`CharacterCreator.test.tsx`, `App.test.tsx`) avec
  Testing Library, `fetch` mocké sur les fixtures JSON du compendium comme
  dans `loadCompendium.test.ts`, et `fake-indexeddb` déjà en place pour
  Dexie.

**Décisions prises**
- `createDraft()` reste une fonction pure (pas d'écriture Dexie) ; c'est
  `saveDraft()` qui persiste — permet de tester la factory sans I/O et
  suit l'ordre `create → save → get` demandé par la tâche.
- Le résumé des traits raciaux/classes est généré à la volée depuis les
  champs déjà présents dans `RaceDefinition`/`ClassDefinition` (pas de
  nouvelle table de libellés français pour les clés de traits) : suffisant
  pour un résumé court, une localisation complète pourra venir plus tard
  si besoin.
- Portée strictement limitée aux étapes Race et Classe : pas de champ pour
  Caractéristiques/Compétences/Dons/Équipement dans `CharacterDraft`, pas
  de sélection de profil de campagne, pas de navigation applicative
  au-delà du flux Accueil → Créateur.

**Prochaine étape**
- Jalon 4.2 : étape Caractéristiques (génération selon le profil de
  campagne, `campaignId` du brouillon devient réellement utile) et
  sélection du profil de campagne.
- Étapes Compétences, Dons, Équipement dans des tâches suivantes du
  jalon 4.

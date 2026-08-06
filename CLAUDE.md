# CLAUDE.md — Compagnon de joueur D&D 3.5 (PWA)

## Contexte
PWA compagnon de joueur pour D&D **édition 3.5** — fiche de personnage à calculs automatiques, créateur pas-à-pas, compendium hors-ligne. 100 % autonome : aucun backend, aucune API appelée à l'exécution. Cible : Android/Chrome, mobile-first, installable, fonctionne sans réseau.

## Interdits absolus
1. **Jamais de règles D&D 5e.** Pas de proficiency bonus, pas d'advantage/disadvantage. La 3.5 : BAB par classe, JS Vigueur/Réflexes/Volonté, points de compétence ×4 au niveau 1, don général tous les 3 niveaux, pénalité d'XP de multiclassage, sorts préparés vs spontanés.
2. **Jamais reconstruire de mémoire du contenu WotC hors SRD.** Le SRD 3.5 (OGL 1.0a) est librement utilisable. Tout contenu de supplément (Spell Compendium, séries Complete, etc.) doit être fourni par l'utilisateur — ne jamais l'inventer ni le paraphraser de mémoire.
3. **Ce repo ne contient que du contenu ouvert** (code + données SRD + texte OGL 1.0a). Les données de suppléments et de campagne s'importent localement dans l'app de chaque joueur — elles ne sont **jamais** commitées ici.

## Architecture — trois couches
- **Couche 0 — `src/engine/`** : moteur 3.5 pur. Fonctions pures TypeScript, zéro import UI, zéro règle maison, zéro accès au stockage. **Toute fonction de règles a des tests Vitest** — les tests sont la mémoire long terme du projet.
- **Couche 1 — contenu** : compendium JSON statique dans `public/data/` (SRD uniquement), précaché par le service worker. Index de recherche construit au premier lancement et stocké en IndexedDB.
- **Couche 2 — `src/campaign/`** : profils de campagne déclaratifs (JSON) = contraintes de validation + surcharges de valeurs. Le moteur ne connaît aucune campagne. `campaignId === null` → D&D 3.5 pur.

## Stack
React + TypeScript + Vite · Tailwind CSS · vite-plugin-pwa (Workbox) · Dexie (IndexedDB) · Vitest.
Pas de backend, pas de Redux, pas de localStorage pour les données (IndexedDB uniquement).

## Contrat de validation
Toute validation renvoie `ValidationIssue[]`, jamais un simple booléen :

```ts
type ValidationIssue = {
  layer: 'core' | 'sources' | 'campaign';  // qui refuse
  severity: 'error' | 'warning' | 'info';
  code: string;        // 'ABILITY_MOD_SUM', 'ITEM_CAP_EXCEEDED'…
  field: string;       // 'abilities.str', 'inventory[3]'…
  message: string;     // en français, affiché tel quel
  campaignId?: string; // si layer === 'campaign'
};
```

L'UI distingue toujours « illégal en 3.5 » (`core`) de « refusé par les règles de ta table » (`campaign`).

## Conventions
- Entités de jeu en **anglais** dans le code (`spell`, `feat`, `savingThrow`, `baseAttackBonus`) ; textes de l'UI en **français**.
- Composants fonction + hooks personnalisés (`useCharacterCalculations`, `useSpellSlots`). La logique de règles ne vit jamais dans un composant.
- Données persistées : chaque enregistrement porte un `schemaVersion` ; migrations Dexie pures, chaînées (`v1 → v2 → …`), testées ; jamais destructives sans export automatique préalable.
- Modificateur de caractéristique : `Math.floor((score - 10) / 2)`.
- Un personnage stocke un `rulesetSnapshot` (copie figée du profil de campagne à sa création).

## Pièges connus
- `vite.config.ts` : `base: '/<nom-du-repo>/'` obligatoire pour GitHub Pages, sinon 404 sur les assets et le service worker.
- Appeler `navigator.storage.persist()` au premier lancement.
- Le service worker précache `public/data/*.json` : l'app doit fonctionner 100 % hors-ligne après la première visite (tester en mode avion).

## Workflow
- Une tâche = une branche = une PR, petite et bornée. `npm test` vert avant tout commit.
- Mettre à jour **JOURNAL.md** à la fin de chaque tâche : fait / décisions prises / prochaine étape.
- CI (GitHub Actions) : tests + build + déploiement GitHub Pages à chaque merge dans `main`.

## Commandes
`npm run dev` · `npm test` · `npm run build` · `npm run preview`

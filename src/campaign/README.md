# Profils de campagne

Couche 2 — profils de campagne déclaratifs (JSON) : contraintes de validation
et surcharges de valeurs. Le moteur (`src/engine/`) ne connaît aucune
campagne. `campaignId === null` signifie D&D 3.5 pur (SRD).

`types.ts` définit la forme `CampaignProfile`. `loadProfile.ts` expose
`loadCampaignProfile(id)` : `null` ou `"base-3.5"` renvoient le profil de
base (sans surcharge) ; un id inconnu lève une erreur.

`profiles/base-3.5.json` est le profil de base. `profiles/example-strict.json`
est une fixture de test générique (contraintes strictes de génération des
caractéristiques et de richesse de départ) — elle ne représente aucune
campagne réelle : conformément à l'interdit n°3 de CLAUDE.md, le contenu de
campagne (noms, maisons, lore) n'est jamais commité dans ce repo public.

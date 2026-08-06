/**
 * Types TS du compendium SRD (couche 1). Les données elles-mêmes vivent en
 * JSON statique dans public/data/, précaché par le service worker.
 *
 * Ce fichier est un point de départ — les types seront étoffés au fur et à
 * mesure que le contenu du compendium (sorts, dons, classes...) est ajouté.
 */

export type CompendiumEntryKind = 'spell' | 'feat' | 'class' | 'race' | 'item'

export interface CompendiumEntry {
  id: string
  kind: CompendiumEntryKind
  name: string
  source: 'SRD'
}

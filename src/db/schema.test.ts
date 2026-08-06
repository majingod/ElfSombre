import { afterEach, describe, expect, it } from 'vitest'
import { db } from './schema'

describe('GrimoireDatabase', () => {
  afterEach(async () => {
    await db.characters.clear()
    await db.campaigns.clear()
  })

  it('crée un personnage avec campaignId null (D&D 3.5 pur)', async () => {
    await db.characters.add({
      id: 'char-1',
      schemaVersion: 1,
      name: 'Eldorin',
      campaignId: null,
      updatedAt: new Date().toISOString(),
    })

    const character = await db.characters.get('char-1')
    expect(character?.campaignId).toBeNull()
  })

  it('crée un personnage rattaché à un profil de campagne', async () => {
    await db.campaigns.add({ id: 'example-strict', schemaVersion: 1, name: 'Exemple — contraintes strictes' })
    await db.characters.add({
      id: 'char-2',
      schemaVersion: 1,
      name: 'Sylara',
      campaignId: 'example-strict',
      updatedAt: new Date().toISOString(),
    })

    const character = await db.characters.get('char-2')
    expect(character?.campaignId).toBe('example-strict')
  })
})

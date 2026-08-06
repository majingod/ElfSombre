import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import racesFixture from '../../public/data/races-srd.json'
import classesFixture from '../../public/data/classes-srd.json'
import { loadClasses, loadRaces } from './loadCompendium'

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string) => {
      const fixture = input.includes('races-srd.json') ? racesFixture : classesFixture
      return new Response(JSON.stringify(fixture), { status: 200 })
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadRaces', () => {
  it('renvoie 4 races avec les bons ids', async () => {
    const races = await loadRaces()
    expect(races.map((race) => race.id)).toEqual(['human', 'elf', 'dwarf', 'drow'])
  })

  it('elf.abilityAdjustments.dex vaut 2', async () => {
    const races = await loadRaces()
    const elf = races.find((race) => race.id === 'elf')
    expect(elf?.abilityAdjustments.dex).toBe(2)
  })

  it('drow.levelAdjustment vaut 2', async () => {
    const races = await loadRaces()
    const drow = races.find((race) => race.id === 'drow')
    expect(drow?.levelAdjustment).toBe(2)
  })
})

describe('loadClasses', () => {
  it('renvoie 2 classes avec les bons ids', async () => {
    const classes = await loadClasses()
    expect(classes.map((klass) => klass.id)).toEqual(['fighter', 'wizard'])
  })

  it('fighter.babProgression vaut "full"', async () => {
    const classes = await loadClasses()
    const fighter = classes.find((klass) => klass.id === 'fighter')
    expect(fighter?.babProgression).toBe('full')
  })

  it('wizard.spellcaster.ability vaut "int"', async () => {
    const classes = await loadClasses()
    const wizard = classes.find((klass) => klass.id === 'wizard')
    expect(wizard?.spellcaster?.ability).toBe('int')
  })

  it('wizard.levelFeatures contient un entry level:1 avec "scribeScroll"', async () => {
    const classes = await loadClasses()
    const wizard = classes.find((klass) => klass.id === 'wizard')
    const levelOne = wizard?.levelFeatures.find((entry) => entry.level === 1)
    expect(levelOne?.features).toContain('scribeScroll')
  })
})

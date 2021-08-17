import * as Schemas from './schemas'
import * as h from './helper'
import { createConnections } from './connections'
import seedrandom from 'seedrandom'
import { TestCollection } from '../mockDb'

export interface CreateBundleInput {
  devices: number
  suppliers: number
  organisations: number
  keys: number
  events: number
}

export const createPartialBundle = (
  rng: h.RNG,
  input: CreateBundleInput
): Schemas.PartialBundle => ({
  devices: h.createNItems(rng, input.devices, Schemas.randDevice),
  suppliers: h.createNItems(rng, input.suppliers, Schemas.randSupplier),
  organisations: h.createNItems(
    rng,
    input.organisations,
    Schemas.randOrganisation
  ),
  keys: h.createNItems(rng, input.keys, Schemas.randKey),
  events: h.createNItems(rng, input.events, Schemas.randEvent)
})

export const createBundle = (input: CreateBundleInput, seed: string) => {
  const rng = seedrandom(seed)
  const pBundle = createPartialBundle(rng, input)
  return createConnections(rng, pBundle)
}

export const bundleToTestData = (bundle: Schemas.Bundle): TestCollection[] =>
  Object.entries(bundle).map(([key, value]) => ({
    collection: key,
    objects: value
  }))

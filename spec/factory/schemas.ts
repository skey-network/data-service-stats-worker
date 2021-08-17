import * as h from './helper'

export interface Device {
  address: string
  supplier: string
  name: string
  active: boolean
  connected: boolean
  visible: boolean
}

export interface Supplier {
  address: string
  name: string
  organisations: string[]
}

export interface Organisation {
  address: string
  name: string
  users: string[]
}

export interface Key {
  assetId: string
  issuer: string
  device: string
  owner: string
  burned: boolean
}

export interface Event {
  txHash: string
  assetId: string
  device: string
}

export interface Bundle {
  devices: Device[]
  suppliers: Supplier[]
  organisations: Organisation[]
  keys: Key[]
  events: Event[]
}

export interface PartialBundle {
  devices: Partial<Device>[]
  suppliers: Partial<Supplier>[]
  organisations: Partial<Organisation>[]
  keys: Partial<Key>[]
  events: Partial<Event>[]
}

export const randDevice = (rng: h.RNG): Partial<Device> => ({
  address: h.randAddress(rng),
  name: h.randWord(rng),
  active: h.randBool(rng),
  connected: h.randBool(rng),
  visible: h.randBool(rng)
})

export const randSupplier = (rng: h.RNG): Partial<Supplier> => ({
  address: h.randAddress(rng),
  name: h.randWord(rng),
  organisations: []
})

export const randOrganisation = (rng: h.RNG): Partial<Organisation> => ({
  address: h.randAddress(rng),
  name: h.randWord(rng),
  users: []
})

export const randKey = (rng: h.RNG): Partial<Key> => ({
  assetId: h.randTxHash(rng),
  burned: h.randBool(rng)
})

export const randEvent = (rng: h.RNG): Partial<Event> => ({
  txHash: h.randTxHash(rng)
})

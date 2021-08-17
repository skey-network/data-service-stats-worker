import {
  createNItems,
  randAddress,
  randElement,
  randInt,
  randSubArray,
  RNG
} from './helper'
import { Bundle, PartialBundle } from './schemas'

export const createConnections = (rng: RNG, bundle: PartialBundle): Bundle => {
  const connectFunctions = [
    connectDevicesSuppliers,
    connectKeysSuppliers,
    connectKeysOwners,
    connectKeysDevices,
    connectEventsKeys,
    connectEventsDevices,
    connectSuppliersOrganisations,
    connectOrganisationsUsers
  ]

  connectFunctions.forEach((func) => func(rng, bundle))

  return bundle as Bundle
}

export const connectDevicesSuppliers = (rng: RNG, ctx: PartialBundle) => {
  for (const device of ctx.devices) {
    device.supplier = randElement(rng, ctx.suppliers).address
  }
}

export const connectKeysSuppliers = (rng: RNG, ctx: PartialBundle) => {
  for (const key of ctx.keys) {
    key.issuer = randElement(rng, ctx.suppliers).address
  }
}

export const connectKeysOwners = (rng: RNG, ctx: PartialBundle) => {
  for (const key of ctx.keys) {
    key.owner = randElement(rng, [
      ...ctx.suppliers,
      ...ctx.organisations
    ]).address
  }
}

export const connectKeysDevices = (rng: RNG, ctx: PartialBundle) => {
  for (const key of ctx.keys) {
    key.device = randElement(rng, ctx.devices).address
  }
}

export const connectEventsKeys = (rng: RNG, ctx: PartialBundle) => {
  for (const event of ctx.events) {
    event.assetId = randElement(rng, ctx.keys).assetId
  }
}

export const connectEventsDevices = (rng: RNG, ctx: PartialBundle) => {
  for (const event of ctx.events) {
    event.device = randElement(rng, ctx.devices).address
  }
}

export const connectSuppliersOrganisations = (rng: RNG, ctx: PartialBundle) => {
  for (const supplier of ctx.suppliers) {
    supplier.organisations = randSubArray(rng, ctx.organisations).map(
      (org) => org.address!
    )
  }
}

export const connectOrganisationsUsers = (rng: RNG, ctx: PartialBundle) => {
  for (const org of ctx.organisations) {
    const length = randInt(rng, 0, 50)
    org.users = createNItems(rng, length, randAddress)
  }
}

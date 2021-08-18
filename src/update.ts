import { resolveSuppliers } from './resolvers/suppliers'
import { resolveOrganisations } from './resolvers/organisations'
import { resolveKeys } from './resolvers/keys'
import { resolveDevices } from './resolvers/devices'
import {
  ResolverContext,
  ResolverData,
  ResolverResult
} from './resolvers/common'
import { getCollections } from './db'
import { MongoClient } from 'mongodb'

// Run all resolvers
export const resolveAll = async (ctx: ResolverContext) => {
  const [suppliers, organisations, keys, devices] = await Promise.all([
    resolveSuppliers(ctx),
    resolveOrganisations(ctx),
    resolveKeys(ctx),
    resolveDevices(ctx)
  ])

  return { suppliers, organisations, keys, devices }
}

// Needed to update nested properties in mongodb
// Using dot notation
export const dataToDotNotation = (prefix: string, data: ResolverData) =>
  Object.entries(data)
    .map(([sectionKey, sectionValue]) =>
      Object.entries(sectionValue)
        .map(([countKey, countValue]) => ({
          [`${prefix}.${sectionKey}.${countKey}`]: countValue
        }))
        .reduce((prev, curr) => ({ ...prev, ...curr }), {})
    )
    .reduce((prev, curr) => ({ ...prev, ...curr }), {})

// Send update
export const bulkUpdate = async (client: MongoClient, update: any) => {
  const result = await client
    .db()
    .collection('stats')
    .bulkWrite(update)
    .catch(console.error)

  return result ?? null
}

// Needed to update nested properties in mongodb
// Using dot notation
export const toCurrentUpdateObjects = (stats: {
  [key: string]: ResolverResult[]
}) => {
  return Object.entries(stats)
    .map(([key, value]) =>
      value.map((item) => ({
        id: item.id,
        type: key,
        'current.timestamp': item.timestamp,
        ...dataToDotNotation('current.data', item.data)
      }))
    )
    .flat()
    .map((x) => ({
      updateOne: {
        update: { $set: x },
        upsert: true,
        filter: { id: x.id }
      }
    }))
}

// Should append to array of objects in every document
export const toHistoricalUpdateObjects = (stats: {
  [key: string]: ResolverResult[]
}) => {
  return Object.entries(stats)
    .map(([key, value]) =>
      value.map((item) => ({
        ...item,
        type: key
      }))
    )
    .flat()
    .map((x) => ({
      updateOne: {
        update: {
          $addToSet: {
            historical: {
              timestamp: x.timestamp,
              data: x.data
            }
          }
        },
        upsert: false,
        filter: { id: x.id }
      }
    }))
}

export const getStats = async (client: MongoClient) => {
  const collections = getCollections(client)
  const obj = await resolveAll({ collections }).catch(console.error)
  return obj ?? null
}

// Use this
export const runUpdate = async (
  client: MongoClient,
  mode: 'current' | 'historical'
) => {
  const stats = await getStats(client)
  if (!stats) return null

  const toUpdateObjects =
    mode === 'current' ? toCurrentUpdateObjects : toHistoricalUpdateObjects

  const updates = toUpdateObjects(stats)

  return await bulkUpdate(client, updates)
}

import { resolveSuppliers } from './resolvers/suppliers'
import { resolveOrganisations } from './resolvers/organisations'
import { resolveKeys } from './resolvers/keys'
import { resolveDevices } from './resolvers/devices'
import { ResolverContext } from './resolvers/common'
import { connect, disconnect, getCollections } from './db'
import { config } from './config'
import { x } from 'joi'
import { UpdateOneModel } from 'mongodb'

const resolveAll = async (ctx: ResolverContext) => {
  const [suppliers, organisations, keys, devices] = await Promise.all([
    resolveSuppliers(ctx),
    resolveOrganisations(ctx),
    resolveKeys(ctx),
    resolveDevices(ctx)
  ])

  return { suppliers, organisations, keys, devices }
}

const main = async () => {
  const client = await connect(config.db)
  const collections = getCollections(client)

  const obj = await resolveAll({ collections })
  const parsed = Object.entries(obj)
    .map(([key, value]) =>
      value.map((item: any) => ({
        id: item.id,
        current: { timestamp: item.timestamp, data: item.data },
        type: key
      }))
    )
    .flat()

  const updates: { updateOne: UpdateOneModel }[] = parsed.map((x) => ({
    updateOne: { update: { $set: x }, upsert: true, filter: { id: x.id } }
  }))
  
  console.log(updates.length)
  console.log('start')
  await client.db().collection('stats').bulkWrite(updates)

  console.log('end')

  await disconnect(client)
}

main().then(() => process.exit(0))

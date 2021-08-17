import { MongoClient } from 'mongodb'
import { Config, loadConfig } from './config'
import { countCollection } from './count'
import { connect, disconnect } from './db'
import { resolveSuppliers } from './resolvers/suppliers'

// export interface CollectionResult {
//   collection: string
//   all: number
//   groups: {
//     field: string
//     value: any
//     count: number
//   }[]
// }

// export const countAllCollections = async (
//   client: MongoClient,
//   config: Config
// ) => {
//   const results: CollectionResult[] = []

//   for (const collectionConfig of config.collections) {
//     const collection = client.db().collection(collectionConfig.name)

//     const result = await countCollection(
//       collection,
//       config.collections[0].groups ?? []
//     )

//     results.push({ collection: collectionConfig.name, ...result })
//   }

//   return results
// }

const main = async () => {
  const config = loadConfig()

  if (!config) {
    console.error('failed to load config')
    process.exit(1)
  }

  const client = await connect(config.db)

  // const results = await resolveSuppliers(client.db())
  // console.log(results)

  await disconnect(client)
  process.exit(0)
}

main()

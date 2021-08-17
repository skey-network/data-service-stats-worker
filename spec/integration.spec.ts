import { getCollections } from '../src/db'
import { resolveSuppliers } from '../src/resolvers/suppliers'
import { bundleToTestData, createBundle } from './factory/factory'
import * as Db from './mockDb'

describe('test with db', () => {
  let db: Db.MockDb
  let testData: Db.TestCollection[]

  beforeAll(async () => {
    db = await Db.getInstance()

    const bundle = createBundle(
      {
        devices: 5000,
        suppliers: 10,
        organisations: 10,
        keys: 5000,
        events: 5000
      },
      'BUTTER'
    )

    testData = bundleToTestData(bundle)
    await Db.insertTestData(db, testData)
  })

  afterAll(async () => {
    await Db.cleanUp(db)
  })

  it('suppliers', async () => {
    const collections = getCollections(db.client)
    const results = await resolveSuppliers({ collections })
    console.log(results)
  })
})

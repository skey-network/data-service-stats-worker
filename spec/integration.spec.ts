import { Collections, getCollections } from '../src/db'
import { resolveDevices } from '../src/resolvers/devices'
import { resolveKeys } from '../src/resolvers/keys'
import { resolveOrganisations } from '../src/resolvers/organisations'
import { resolveSuppliers } from '../src/resolvers/suppliers'
import { bundleToTestData, createBundle } from './factory/factory'
import * as Db from './mockDb'

describe('test with db', () => {
  let db: Db.MockDb
  let testData: Db.TestCollection[]
  let collections: Collections

  beforeAll(async () => {
    db = await Db.getInstance()

    const bundle = createBundle(
      {
        devices: 1000,
        suppliers: 10,
        organisations: 10,
        keys: 1000,
        events: 1000
      },
      'BUTTER'
    )

    testData = bundleToTestData(bundle)
    await Db.insertTestData(db, testData)
    collections = getCollections(db.client)
  })

  afterAll(async () => {
    await Db.cleanUp(db)
  })

  it('suppliers', async () => {
    const results = await resolveSuppliers({ collections })
    expect(results).toBeDefined()
  })

  it('organisations', async () => {
    const results = await resolveOrganisations({ collections })
    expect(results).toBeDefined()
  })

  it('devices', async () => {
    const results = await resolveDevices({ collections })
    expect(results).toBeDefined()
  })

  it('keys', async () => {
    const results = await resolveKeys({ collections })
    expect(results).toBeDefined()
  })
})

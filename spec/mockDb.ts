import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect } from '../src/db'

export interface MockDb {
  mongod: MongoMemoryServer
  client: MongoClient
}

export interface TestCollection {
  collection: string
  objects: any[]
}

export const getInstance = async (): Promise<MockDb> => {
  const mongod = await MongoMemoryServer.create()
  const client = await connect(mongod.getUri())

  return { mongod, client }
}

export const cleanUp = async (db: MockDb) => {
  await db.client.close()
  await db.mongod.stop()
}

export const insertTestData = async (
  db: MockDb,
  collections: TestCollection[]
) => {
  for (const { collection, objects } of collections) {
    await db.client.db().collection(collection).insertMany(objects)
  }
}

export const removeTestData = async (
  db: MockDb,
  collections: TestCollection[]
) => {
  for (const { collection, objects } of collections) {
    const conn = db.client.db().collection(collection)
    await Promise.all(objects.map((obj) => conn.deleteMany(obj)))
  }
}

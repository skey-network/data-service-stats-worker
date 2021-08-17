import { Collection, MongoClient } from 'mongodb'
import { DatabaseConfig } from './config'

export interface Collections {
  devices: Collection
  suppliers: Collection
  organisations: Collection
  events: Collection
  keys: Collection
}

export const createUri = (options: DatabaseConfig) => {
  const { host, port, name, username, password } = options
  return `mongodb://${username}:${password}@${host}:${port}/${name}`
}

export const connect = async (config: DatabaseConfig | string) => {
  const uri = typeof config === 'object' ? createUri(config) : config
  const client = await MongoClient.connect(uri)
  await client.connect()
  return client
}

export const getCollections = (client: MongoClient): Collections => {
  const db = client.db()

  return {
    devices: db.collection('devices'),
    suppliers: db.collection('suppliers'),
    organisations: db.collection('organisations'),
    events: db.collection('events'),
    keys: db.collection('keys')
  }
}

export const disconnect = (client: MongoClient) => client.close

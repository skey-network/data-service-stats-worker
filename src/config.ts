import { readFileSync } from 'fs'
import Joi from 'joi'
import YAML from 'yaml'

export interface Config {
  collections: CollectionConfig[]
  db: DatabaseConfig
}

export interface CollectionConfig {
  name: string
  groups?: GroupConfig[]
}

export interface GroupConfig {
  field: string
  value: any
}

export interface DatabaseConfig {
  host: string
  port: number
  name: string
  username: string
  password: string
}

export const configSchema = Joi.object({
  collections: Joi.array()
    .required()
    .items(
      Joi.object({
        name: Joi.string().required(),
        groups: Joi.array()
          .optional()
          .items(
            Joi.object({
              field: Joi.string().required(),
              value: Joi.any()
            })
          )
      })
    ),
  db: Joi.object({
    host: Joi.string().required(),
    port: Joi.number().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
  })
})

export const CONFIG_PATH = './config.yml'

export const loadConfig = (): Config | null => {
  try {
    const text = readFileSync(CONFIG_PATH, 'utf-8')
    const obj = YAML.parse(text)
    const validation = configSchema.validate(obj)

    if (validation.error) {
      console.error(validation.error)
    }

    if (validation.warning) {
      console.error(validation.warning)
    }

    return validation.error ? null : obj
  } catch (err) {
    console.error(err)
    return null
  }
}

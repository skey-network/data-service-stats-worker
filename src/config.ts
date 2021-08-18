import Joi from 'joi'

const { env, argv } = process

export interface Config {
  app: AppConfig
  db: DatabaseConfig
}

export interface AppConfig {
  mode: 'current' | 'historical'
}

export interface DatabaseConfig {
  host: string
  port: number
  name: string
  username: string
  password: string
}

export const config = (): Config => ({
  app: {
    mode: argv[2] as any
  },
  db: {
    name: env.DB_NAME ?? 'admin',
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? '27017'),
    username: env.DB_USERNAME ?? 'root',
    password: env.DB_PASSWORD ?? 'password'
  }
})

const configSchema = Joi.object({
  app: Joi.object({
    mode: Joi.string().valid('current', 'historical').required()
  }),
  db: Joi.object({
    name: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
  })
})

export const assertConfig = () => {
  const validation = configSchema.validate(config())

  if (validation.error) {
    console.error(validation.error)
    process.exit(1)
  }
}

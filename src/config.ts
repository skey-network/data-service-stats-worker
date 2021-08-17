const { env } = process

export interface Config {
  db: DatabaseConfig
}

export interface DatabaseConfig {
  host: string
  port: number
  name: string
  username: string
  password: string
}

export const config: Config = {
  db: {
    name: env.DB_NAME ?? 'admin',
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? '27017'),
    username: env.DB_USERNAME ?? 'root',
    password: env.DB_PASSWORD ?? 'password'
  }
}

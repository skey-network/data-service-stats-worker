import { connect, disconnect } from './db'
import { assertConfig, config } from './config'
import { runUpdate } from './update'

const main = async () => {
  assertConfig()

  const client = await connect(config().db)

  const result = await runUpdate(client, config().app.mode)
  console.log(result)

  await disconnect(client)
}

main().then(() => process.exit(0))

# Stats worker

## Description

Tool used to make statistical data for other database models. Use `current` mode to count database documents and save results as current stats. Use `historical` mode to count documents and save current values to array. The historical values will be used to make charts etc.

## Run in development

```bash
yarn install

# Without environment variables
npm run dev -- current

# With environment variable
DB_HOST=172.17.0.1 npm run dev -- current
```

## Run with docker

```bash
docker build -t stats-worker .

# Without environment variables
docker run -it stats-worker current

# With environment variable
docker run -it -e DB_HOST=172.17.0.1 stats-worker current
```

## Parameters

| Parameter  | Description               | Default Value |
| ---------- | :------------------------ | :------------ |
| Positional | `current` or `historical` | -             |

## Environment variables

| Parameter   | Description       | Default Value |
| ----------- | :---------------- | :------------ |
| DB_NAME     | Database name     | admin         |
| DB_HOST     | Database host     | localhost     |
| DB_USERNAME | Database username | root          |
| DB_PORT     | Database port     | 27017         |
| DB_PASSWORD | Database password | password      |

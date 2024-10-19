# Requirements

- Docker and docker-compose for database
- Node
- Yarn

# Setup

Launch database:

```
docker compose up -d
```

Run migration:

```
yarn migrate
```

Start server:

```
yarn start
```

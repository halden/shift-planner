# Shift Planner

## Requirements

- [Docker](https://www.docker.com/get-started/)
- [Node.js](https://nodejs.org/en/) (optional)
- [Nest CLI](https://docs.nestjs.com/cli/overview) (optional)
- [PM2](https://pm2.keymetrics.io/) (optional)

## Quick Start

Run

```bash
$ docker compose up
```

## API Documentation

Swagger interface: http://localhost:3000/api

OpenAPI schema: http://localhost:3000/api-json

## Database
Wait for it to initialize completely, and visit http://localhost:8080/.

Alternatively connect directly via localhost:3306 and use `root`/`example` as user/password credentials.

Create tables and seed users with shifts:

```bash
# add seed data
$ npm run migration:dev
```

NB! Ideally, change `synchronize` to `false` for local development after migration is complete.

## Local Development

```bash
# installation
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# unit tests
$ npm run test

# generate migration file
$ migration:generate-dev ./path-to-the-entity
```

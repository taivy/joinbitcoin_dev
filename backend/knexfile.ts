import 'dotenv/config';
import * as Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';

const dbUrl: string = process.env.DATABASE_URL;

module.exports = {
  client: 'pg',
  connection: dbUrl,
  migrations: {
    directory: './src/database/migrations',
    stub: './src/database/migration.stub',
  },
  ...knexSnakeCaseMappers()
} as Knex.Config;

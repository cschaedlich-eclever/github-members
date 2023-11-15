import type { Knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config({
  path: !process.env.NODE_ENV ? '../.env' : `../.env.${process.env.NODE_ENV}`
});

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'migrations'
  }
};

module.exports = config;

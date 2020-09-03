import * as Knex from 'knex';

const tableName = 'external.coinbase_auth0_ids';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('coinbaseId');
    t.string('auth0Id');
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
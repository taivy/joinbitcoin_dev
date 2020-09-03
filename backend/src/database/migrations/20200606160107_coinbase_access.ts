import * as Knex from 'knex';

const tableName = 'external.coinbase_access';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('coinbaseId').unique();
    t.string('accessToken');
    t.string('refreshToken');
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
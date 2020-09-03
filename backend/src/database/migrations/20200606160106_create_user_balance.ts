import * as Knex from 'knex';

const tableName = 'dca.balances';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('coinbaseId').unique();
    t.string('currency');
    t.float('balance');
    t.float('available');
    t.float('hold');
    t.string('profileId');
    t.boolean('tradingEnabled');
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
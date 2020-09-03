import * as Knex from 'knex';

const tableName = 'trading.auto_trade';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('auth0Id');
    t.enu('status', ['new', 'active', 'inactive', 'error'], { useNative: true, enumName: 'status', existingType: false});
    t.float('amount');
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
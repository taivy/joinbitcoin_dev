import * as Knex from 'knex';

const tableName = 'external.coinbase_ad';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
    t.enu('vendor', ['localbitcoins', 'paxful', 'bitquick', 'coinbase'], { useNative: true, enumName: 'vendor', existingType: true});
    t.string('currency');
    t.string('cryptoCurrency');
    t.float('amount');

    t.unique(['currency', 'cryptoCurrency']);
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
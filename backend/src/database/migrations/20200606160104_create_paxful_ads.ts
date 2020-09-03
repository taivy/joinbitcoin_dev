import * as Knex from 'knex';

const tableName = 'external.paxful_ad';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
    t.enu('vendor', ['localbitcoins', 'paxful', 'bitquick', 'coinbase'], { useNative: true, enumName: 'vendor', existingType: true});
    t.uuid('sellerId')
      .references('id')
      .inTable('external.paxful_user');
    t.float('fiatUsdPricePerCrypto');
    t.float('fiatUsdPricePerBtc');
    t.float('fiatAmountRangeMin');
    t.float('fiatAmountRangeMax');
    t.string('currency');
    t.string('paymentType');

    t.unique(['sellerId', 'fiatUsdPricePerBtc', 'currency']);
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
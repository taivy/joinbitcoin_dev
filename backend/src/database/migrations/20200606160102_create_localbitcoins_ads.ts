import * as Knex from 'knex';

const tableName = 'external.localbitcoins_ad';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, t => {
    t.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
    t.enu('vendor', ['localbitcoins', 'paxful', 'bitquick', 'coinbase'], { useNative: true, enumName: 'vendor', existingType: false});
    t.uuid('sellerId')
      .references('id')
      .inTable('external.localbitcoins_user');
    t.integer('maxBtc');
    t.integer('minBtc');
    t.float('price');
    t.string('currency');
    t.integer('rating');
    t.string('paymentType');

    t.unique(['sellerId', 'price', 'currency']);
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
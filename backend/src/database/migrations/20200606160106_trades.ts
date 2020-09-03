import * as Knex from 'knex';

const tableName = 'dca.trades';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, t => {
    t.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('coinbaseId').unique();
    t.float('price');
    t.float('size');
    t.string('productId');
    t.string('side');
    t.string('stp');
    t.string('type');
    t.string('timeInForce');
    t.string('postOnly');
    t.string('createdAt');
    t.float('fillFees');
    t.float('filledSize');
    t.float('executedValue');
    t.string('status');
    t.boolean('settled');
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
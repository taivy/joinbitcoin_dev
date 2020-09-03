import * as Knex from 'knex';

const tableName = 'external.localbitcoins_user';

export async function up(knex: Knex) {
  const createSchemas = [
    knex.schema.raw('CREATE SCHEMA external'),
    knex.schema.raw('CREATE SCHEMA dca'),
    knex.schema.raw('CREATE SCHEMA trading'),
  ];

  await Promise.all(createSchemas);

  await knex.schema.createTable(tableName, t => {
    t.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));

    t.string('username').unique();
    t.string('name');
    t.string('lastOnline');
    t.string('tradeCount');
    t.integer('feedbackScore');
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
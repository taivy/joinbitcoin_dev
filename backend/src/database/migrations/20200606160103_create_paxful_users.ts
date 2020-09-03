import * as Knex from 'knex';

const tableName = 'external.paxful_user';

export async function up(knex: Knex) {
  await knex.schema.createTable(tableName, t => {
    t.uuid('id').unique().defaultTo(knex.raw('uuid_generate_v4()'));

    t.string('username').unique();
    t.string('profileLink');
    t.integer('lastOnline');
    t.integer('feedbackPositive');
    t.integer('feedbackNegative');
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
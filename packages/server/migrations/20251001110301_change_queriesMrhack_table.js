/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('queriesMrhack', (table) => {
    table.integer('value');
    table.boolean('status').defaultTo('false');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('queriesMrhack', (table) => {
    table.dropColumn('value');
    table.dropColumn('status');
  });
};

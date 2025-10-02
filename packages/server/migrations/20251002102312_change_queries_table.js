/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('queries', (table) => {
    table.decimal('value');
    table.boolean('status').defaultTo('false');
    table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('queries', (table) => {
    table.dropColumn('value');
    table.dropColumn('status');
    table.dropColumn('created_at');
  });
};

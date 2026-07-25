/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('games', (table) => {
    table.text('summary');
    table.string('apple_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('games', (table) => {
    table.dropColumn('summary');
    table.dropColumn('apple_id');
  });
};

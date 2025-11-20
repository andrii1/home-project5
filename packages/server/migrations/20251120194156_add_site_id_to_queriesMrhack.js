/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('queriesMrhack', (table) => {
    table.integer('site_id').unsigned();
    table
      .foreign('site_id')
      .references('id')
      .inTable('sites')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('queriesMrhack', (table) => {
    table.dropColumn('site_id');
  });
};

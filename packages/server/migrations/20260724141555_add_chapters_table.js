/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('chapters', (table) => {
    table.increments();
    table.text('title').notNullable();
    table.string('slug').notNullable();
    table.text('description').nullable();
    table.integer('game_id').unsigned();
    table.foreign('game_id').references('id').inTable('games');
    table.text('url_image').nullable();
    table.string('meta_description').nullable();
    table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
    table.unique(['slug']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('chapters');
};

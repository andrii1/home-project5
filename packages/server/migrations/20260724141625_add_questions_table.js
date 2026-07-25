/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('questions', (table) => {
    table.increments();
    table.string('question_id', 100).notNullable();
    table.text('title').nullable();
    table.text('description').nullable();
    table.integer('chapter_id').unsigned();
    table.foreign('chapter_id').references('id').inTable('chapters');
    table.text('url_image').nullable();
    table.string('meta_description').nullable();
    table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
    table.datetime('updated_at', { precision: 6 }).defaultTo(knex.fn.now(6));
    table.unique(['chapter_id', 'question_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('questions');
};

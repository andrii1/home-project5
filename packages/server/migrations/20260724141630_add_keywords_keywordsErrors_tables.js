/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('keywords', (table) => {
      table.increments();
      table.string('slug').notNullable();
      table.string('title').notNullable();
      table.text('meta_description').nullable();
    })
    .createTable('keywordsChapters', (table) => {
      table.increments();
      table.integer('chapter_id').unsigned();
      table.foreign('chapter_id').references('id').inTable('chapters');
      table.integer('keyword_id').unsigned();
      table.foreign('keyword_id').references('id').inTable('keywords');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('keywordsChapters').dropTable('keywords');
};

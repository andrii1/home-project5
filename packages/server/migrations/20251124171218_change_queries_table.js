// migrations/20250224_add_dataSource_to_queries.js

export async function up(knex) {
  await knex.schema.alterTable('queries', (table) => {
    table
      .enum('data_source', [
        'googleTrends',
        'searchConsole',
        'keywordTool',
        'ahrefs',
      ])
      .notNullable()
      .defaultTo('googleTrends');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('queries', (table) => {
    table.dropColumn('data_source');
  });
}

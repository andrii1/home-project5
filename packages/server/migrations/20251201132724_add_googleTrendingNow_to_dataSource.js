// migrations/20250224_add_googleTrendingNow_to_dataSource.js

export async function up(knex) {
  await knex.schema.alterTable('queries', (table) => {
    table
      .enum('data_source', [
        'googleTrends',
        'searchConsole',
        'keywordTool',
        'ahrefs',
        'googleTrendingNow',
      ])
      .notNullable()
      .defaultTo('googleTrends')
      .alter();
  });
}

export async function down(knex) {
  await knex.schema.alterTable('queries', (table) => {
    table
      .enum('data_source', [
        'googleTrends',
        'searchConsole',
        'keywordTool',
        'ahrefs',
      ])
      .notNullable()
      .defaultTo('googleTrends')
      .alter();
  });
}

export function up(knex) {
  return knex.schema.createTable('sites', (table) => {
    table.increments();
    table.string('name').notNullable();
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists('sites');
}

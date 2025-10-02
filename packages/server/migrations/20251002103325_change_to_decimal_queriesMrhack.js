// migrations/20251002123456_change_value_to_decimal.js

export async function up(knex) {
  await knex.schema.alterTable('queriesMrhack', (table) => {
    table.decimal('value', 6, 2).alter();
    // DECIMAL(6,2) → up to 9999.99
  });
}

export async function down(knex) {
  await knex.schema.alterTable('queriesMrhack', (table) => {
    table.integer('value').alter();
    // rollback: back to INT
  });
}

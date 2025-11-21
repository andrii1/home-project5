// knex migrate:make rename_name_to_title

export const up = function (knex) {
  return knex.schema.table('sites', function (table) {
    table.renameColumn('name', 'title');
  });
};

export const down = function (knex) {
  return knex.schema.table('sites', function (table) {
    table.renameColumn('title', 'name');
  });
};

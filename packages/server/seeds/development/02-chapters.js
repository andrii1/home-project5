/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('chapters').del();
  await knex('chapters').insert([
    {
      title: 'Julia & Thomas',
      slug: 'julia-thomas',
      description: null,
      game_id: 1,
      url_image: null,
      meta_description: null,
    },
    {
      title: 'Noor case',
      slug: 'noor-case',
      description: null,
      game_id: 2,
      url_image: null,
      meta_description: null,
    },
    {
      title: 'Felix case',
      slug: 'felix-case',
      description: null,
      game_id: 2,
      url_image: null,
      meta_description: null,
    },
    {
      title: 'Rei case',
      slug: 'rei-case',
      description: null,
      game_id: 2,
      url_image: null,
      meta_description: null,
    },
  ]);
};

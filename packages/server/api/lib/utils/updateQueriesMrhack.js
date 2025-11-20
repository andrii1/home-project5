const knex = require('../../config/db');

async function updateSiteId() {
  try {
    const updated = await knex('queriesMrhack').update({ site_id: 1 });

    console.log(`Updated ${updated} rows.`);
  } catch (err) {
    console.error('Error updating site_id:', err);
  } finally {
    await knex.destroy();
  }
}

updateSiteId();

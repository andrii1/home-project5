const knex = require('../../../config/db');
require('dotenv').config();

const API_PATH = process.env.API_PATH_DEALS_PROD;

function formatMySqlDate(isoString) {
  const d = new Date(isoString);
  if (isNaN(d)) return null;
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

async function run() {
  try {
    const response = await fetch(`${API_PATH}/queries`);
    const rows = await response.json();

    if (!rows.length) {
      console.log('No rows found in queries.');
      return;
    }

    const cleanedRows = rows.map(({ id, created_at, updated_at, ...rest }) => ({
      ...rest,
      created_at: created_at ? formatMySqlDate(created_at) : null,
      updated_at: updated_at ? formatMySqlDate(updated_at) : null,
      site_id: 3,
    }));

    await knex('queries').insert(cleanedRows);

    console.log(`Inserted ${cleanedRows.length} rows into queries.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await knex.destroy();
  }
}

run();

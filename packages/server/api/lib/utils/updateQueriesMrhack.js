const knex = require('../../../config/db');
require('dotenv').config();

const API_PATH = process.env.API_PATH_DEALS_PROD;

async function run() {
  try {
    // 1. Fetch all rows from queries
    // const rows = await knex('queries');

    const response = await fetch(`${API_PATH}/queries`);
    const rows = await response.json();

    if (!rows.length) {
      console.log('No rows found in queries.');
      return;
    }

    // 2. Remove id + add site_id
    const cleanedRows = rows.map((r) => {
      const { id, ...data } = r; // remove auto-increment id
      return {
        ...data,
        site_id: 2,
      };
    });

    // 3. Insert into queriesMrhack
    await knex('queriesMrhack').insert(cleanedRows);

    console.log(`Inserted ${cleanedRows.length} rows into queriesMrhack.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await knex.destroy();
  }
}

run();

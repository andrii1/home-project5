const knex = require('../../../config/db');

async function run() {
  try {
    // 1. Fetch rows from queries table
    const rows = await knex('queries');

    if (!rows.length) {
      console.log('No rows found in queries table.');
      return;
    }

    // 2. Add site_id = 2
    const updatedRows = rows.map((r) => ({
      ...r,
      site_id: 2,
    }));

    // 3. Insert into queriesMrhack
    await knex('queriesMrhack').insert(updatedRows);

    console.log(
      `Inserted ${updatedRows.length} rows into queriesMrhack with site_id = 2`,
    );
  } catch (err) {
    console.error(err);
  } finally {
    knex.destroy();
  }
}

run();

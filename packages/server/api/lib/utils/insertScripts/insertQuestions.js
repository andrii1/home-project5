/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
require('dotenv').config();
const knex = require('../../../../config/db');

async function insert() {
  try {
    const chapters = await knex('chapters').select('*');

    for (const chapter of chapters) {
      const questions = Array.from({ length: 20 }, (_, index) => ({
        question_id: String(index + 1),
        chapter_id: chapter.id,
      }));

      await knex('questions').insert(questions);

      console.log(`Inserted questions for chapter ${chapter.id}`);
    }

    console.log('Done ✅');
  } catch (error) {
    console.error('Error inserting questions:', error);
  } finally {
    await knex.destroy();
  }
}

insert();

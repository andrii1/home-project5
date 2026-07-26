/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
require('dotenv').config();
const knex = require('../../../../config/db');
const generateSlug = require('../generateSlug');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is set in your .env
});

const chapters = [
  {
    title: 'Julia & Thomas',
    game_id: 1,
  },
  {
    title: 'Cassie & Jeremy',
    game_id: 1,
  },
  {
    title: 'Camille & Eden',
    game_id: 1,
  },
  {
    title: 'Emma & Maya',
    game_id: 1,
  },
  {
    title: 'Lucas & Sarah',
    game_id: 1,
  },
  {
    title: 'Lina & Max',
    game_id: 1,
  },
  {
    title: 'Frank & Jade',
    game_id: 1,
  },
  {
    title: 'Claire & Pierre',
    game_id: 1,
  },
  {
    title: 'Samia & Iris',
    game_id: 1,
  },
  {
    title: 'Theo & Asha',
    game_id: 1,
  },
  {
    title: 'Nadine & Gwen',
    game_id: 1,
  },
  {
    title: 'Anna & Milo',
    game_id: 1,
  },
  {
    title: 'Noam & Tyreese',
    game_id: 1,
  },
  {
    title: 'Anna & Markus',
    game_id: 1,
  },
  {
    title: 'Isabela & Rafael',
    game_id: 1,
  },
  {
    title: 'Noor & Julian',
    game_id: 1,
  },
  {
    title: 'Sophia & James',
    game_id: 1,
  },
  {
    title: 'Emily & Rob',
    game_id: 1,
  },
  {
    title: 'Chiara & Giulia',
    game_id: 1,
  },
  {
    title: 'Melania & Lisa',
    game_id: 1,
  },
  {
    title: 'NOOR',
    game_id: 2,
  },
  {
    title: 'FELIX',
    game_id: 2,
  },
  {
    title: 'REI',
    game_id: 2,
  },
  {
    title: 'DANNY',
    game_id: 2,
  },
  {
    title: 'ZOE',
    game_id: 2,
  },
  {
    title: 'AVA',
    game_id: 2,
  },
  {
    title: 'WREN',
    game_id: 2,
  },
  {
    title: 'JUNO',
    game_id: 2,
  },
];

// Helper: ensure the slug is unique by checking the DB
async function ensureUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;

  // eslint-disable-next-line no-await-in-loop
  while (await slugExists(slug)) {
    const suffix = `-${counter}`;
    const maxBaseLength = 200 - suffix.length; // adjust max length if needed
    slug = `${baseSlug.slice(0, maxBaseLength)}${suffix}`;
    counter += 1;
  }

  return slug;
}

// Helper: check if a slug already exists in the database
async function slugExists(slug) {
  const existing = await knex('chapters').where({ slug }).first();
  return !!existing;
}

// Insert games with slugs
async function insertGames() {
  for (const chapter of chapters) {
    try {
      const baseSlug = generateSlug(chapter.title);
      const uniqueSlug = await ensureUniqueSlug(baseSlug);
      await knex('chapters').insert({
        title: chapter.title,
        slug: uniqueSlug,
        game_id: chapter.game_id,
      });
    } catch (error) {
      console.error('Error inserting chapters:', error);
    }
  }

  console.log('Done ✅');
}

insertGames();
// fetchAppByAppleId('6745106241');

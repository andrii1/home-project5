/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
require('dotenv').config();
const app = require('app-store-scraper/lib/app');
const knex = require('../../../../config/db');
const generateSlug = require('../generateSlug');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is set in your .env
});

const chapters = [
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
      const baseSlug = generateSlug(chapter.slug);
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

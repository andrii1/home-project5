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

const games = [{ title: 'Stalkie' }, { title: 'Cold Trace' }];

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
  const existing = await knex('games').where({ slug }).first();
  return !!existing;
}

// Insert games with slugs
async function insertGames() {
  console.log('API key exists:', !!process.env.OPENAI_API_KEY);
  console.log('API key prefix:', process.env.OPENAI_API_KEY?.slice(0, 10));
  try {
    console.log('Inserting games with slugs...');

    for (const game of games) {
      try {
        const baseSlug = generateSlug(game.title);
        const uniqueSlug = await ensureUniqueSlug(baseSlug);

        // const completionMetaDescription = await openai.chat.completions.create({
        //   model: 'gpt-4o-mini',
        //   messages: [
        //     {
        //       role: 'user',
        //       content: `Write a short, engaging meta description SEO for game "${game.title}". Maximum 150 characters.`,
        //     },
        //   ],
        //   temperature: 0.7,
        //   max_tokens: 100,
        // });
        // const metaDescription =
        //   completionMetaDescription.choices[0].message.content.trim();

        await knex('games').insert({
          title: game.title,
          slug: uniqueSlug,
        });
      } catch (error) {
        console.error('Error inserting games:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Response:', error.response);
      }
    }

    console.log('Done ✅');
  } catch (error) {
    console.error('Error inserting games:', error);
  } finally {
    await knex.destroy();
  }
}

insertGames();

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

const games = [
  { appleId: '6745106241', slug: 'stalkie' },
  { appleId: '6762513021', slug: 'coldtrace' },
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
  const existing = await knex('games').where({ slug }).first();
  return !!existing;
}

async function createGameWithChatGpt(gameTitle, gameDescription) {
  const prompt = `
Extract information about this game/app.

Game: ${gameTitle}.

Description: ${gameDescription}.

Return ONLY valid JSON in this format:

{

  "summary": "",
  "metaDescription": "",
  "urlX": "",
  "urlDiscord": "",
  "urlGooglePlayStore": "",

}

Rules:
- summary: short summary of a game, max 150 characters.
- metaDescription: max 160 characters.
- Use the official X/Twitter profile if one exists.
- Use the official Discord invite if one exists.
- Use the official Google Play URL if available.
- If a value is unknown or doesn't exist, return null.
- Return ONLY JSON.
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0,
  });

  console.log('OpenAI response received');

  const content = completion.choices[0].message.content;

  console.log('Response length:', content.length);
  console.log('Finish reason:', completion.choices[0].finish_reason);

  return JSON.parse(content);
}

async function fetchAppByAppleId(appleId) {
  const url = `https://itunes.apple.com/lookup?id=${appleId}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);

  return data.results[0];
}

// Insert games with slugs
async function insertGames() {
  console.log('API key exists:', !!process.env.OPENAI_API_KEY);
  console.log('API key prefix:', process.env.OPENAI_API_KEY?.slice(0, 10));
  try {
    console.log('Inserting games with slugs...');

    for (const game of games) {
      try {
        const gameResult = await fetchAppByAppleId(game.appleId);
        gameTitle = gameResult.trackName;
        gameDescription = gameResult.description;
        gameUrl = gameResult.sellerUrl;
        gameImageUrl = gameResult.artworkUrl512;

        const baseSlug = generateSlug(game.slug);
        const uniqueSlug = await ensureUniqueSlug(baseSlug);

        const createdGame = await createGameWithChatGpt(
          gameTitle,
          gameDescription,
        );

        await knex('games').insert({
          title: gameTitle,
          description: gameDescription,
          slug: uniqueSlug,
          meta_description: createdGame.metaDescription,
          summary: createdGame.summary,
          url: gameUrl,
          apple_id: game.appleId,
          url_image: gameImageUrl,
          url_x: createdGame.urlX,
          url_discord: createdGame.urlDiscord,
          url_google_play_store: createdGame.urlGooglePlayStore,
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

/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-return-await */
/* eslint-disable prefer-template */
// const fetch = require("node-fetch");

require('dotenv').config();

const OpenAI = require('openai');
const fetchSerpApi = require('../serpApi');
const insertErrors = require('./insertErrors');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is set in your .env
});

const today = new Date();
const todayDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

const allowedDays = [0, 3, 5];

if (!allowedDays.includes(todayDay)) {
  console.log('Not an allowed day, skipping job.');
  process.exit(0);
}

const seedList = [
  'error',
  'is down',
  'not working',
  'stopped working',
  `doesn't work`,
  'unable',
  `can't`,
];

// Credentials (from .env)
const USER_UID = process.env.USER_UID_MAH_PROD;
const API_PATH = process.env.API_PATH_MAH_PROD;

// fetch helpers

async function insertQuery(queryObj) {
  const res = await fetch(`${API_PATH}/queries`, {
    method: 'POST',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryObj),
  });
  return await res.json(); // assume it returns { id, title }
}

async function dedupeQueries(queries) {
  const dedupedQueries = [];

  for (const query of queries) {
    const result = await insertQuery(query);

    if (result.existing) {
      console.log('Duplicate query skipped:', query);
      continue;
    }

    dedupedQueries.push(query.title);
  }

  return dedupedQueries;
}

const createErrorMain = async () => {
  let queries = [];

  if (allowedDays.includes(todayDay)) {
    const q = await fetchSerpApi('7', seedList, false, 1);
    queries = queries.concat(q);
  }

  console.log('queries', queries);

  const dedupedQueries = await dedupeQueries(queries);

  console.log('dedupedQueries', dedupedQueries);

  await insertErrors(dedupedQueries);
};

createErrorMain().catch(console.error);

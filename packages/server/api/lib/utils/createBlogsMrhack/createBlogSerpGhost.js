/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-return-await */
/* eslint-disable prefer-template */
// const fetch = require("node-fetch");

require('dotenv').config();
const GhostAdminAPI = require('@tryghost/admin-api');

const OpenAI = require('openai');
const fetchSerpApi = require('./serpApi');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is set in your .env
});

const api = new GhostAdminAPI({
  url: 'https://mrhack.io',
  key: process.env.GHOST_API_KEY, // from Ghost custom integration
  version: 'v4.0', // or whatever version your Ghost install uses
});

const today = new Date();
const todayDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

const allowedDays = [0, 3, 5]; // Sunday, Wednesday, Friday

if (!allowedDays.includes(todayDay)) {
  console.log('Not an allowed day, skipping job.');
  process.exit(0);
}

// Credentials (from .env)
const USER_UID = process.env.USER_UID_MAH_PROD;
const API_PATH = process.env.API_PATH_MAH_PROD;
// WordPress Credentials (from .env)

// fetch helpers

async function insertQuery(queryObj) {
  const res = await fetch(`${API_PATH}/queries?table=queriesMrhack`, {
    method: 'POST',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryObj),
  });
  return await res.json(); // assume it returns { id, title }
}

async function createBlogContent(queryParam) {
  // Generate a short description using OpenAI

  const prompt = `Create a blog, based on query ${queryParam}. Treat ${queryParam} as main keyword - it should be spread in the blog. At least 1300 words. Output with html tags, no markdown, to insert in Ghost CMS.`;
  // console.log(prompt);

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const reply = completion.choices[0].message.content.trim();
  return reply;
}

const createPost = async (postDataParam) => {
  try {
    const post = await api.posts.add(postDataParam);
    console.log('Post created:', post.url);
  } catch (err) {
    console.error('Error creating post:', err);
  }
};

function capitalizeFirstWord(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const createPostMain = async () => {
  const queries = await fetchSerpApi('1');
  console.log('queries', queries);

  for (const query of queries) {
    const newQuery = await insertQuery({
      title: query,
    });

    if (newQuery.existing) {
      console.log('Duplicate query skipped:', query);
      continue;
    }

    const blogTitle = capitalizeFirstWord(query);
    const blogContent = await createBlogContent(query);

    const postData = {
      title: blogTitle,
      mobiledoc: JSON.stringify({
        version: '0.3.1',
        atoms: [],
        cards: [
          [
            'html',
            {
              cardName: 'html',
              html: blogContent,
            },
          ],
        ],
        markups: [],
        sections: [[10, 0]],
      }),
      status: 'published',
    };

    await createPost(postData);
  }
};

createPostMain().catch(console.error);

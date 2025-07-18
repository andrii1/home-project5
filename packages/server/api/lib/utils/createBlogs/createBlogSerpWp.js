/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-return-await */
/* eslint-disable prefer-template */
// const fetch = require("node-fetch");

require('dotenv').config();

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is set in your .env
});

const today = new Date();
const todayDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

const allowedDays = [0, 3, 5]; // Sunday, Wednesday, Friday

if (!allowedDays.includes(todayDay)) {
  console.log('Not an allowed day, skipping job.');
  process.exit(0);
}

const fetchSerpApi = require('./serpApi');

// Credentials (from .env)
const USER_UID = process.env.USER_UID_MAH_PROD;
const API_PATH = process.env.API_PATH_MAH_PROD;
// WordPress Credentials (from .env)

const WP_URL_POSTS = process.env.WP_URL_POSTS_TB;
const WP_USERNAME = process.env.WP_USERNAME_TB;
const WP_APPLICATION_PASSWORD = process.env.WP_APPLICATION_PASSWORD_TB;

const auth =
  'Basic ' +
  Buffer.from(`${WP_USERNAME}:${WP_APPLICATION_PASSWORD}`).toString('base64'); // Basic Auth token

// const tag = "nostalgia";

// const blogUrl = "https://motivately.co/";

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

async function createBlogContent(queryParam) {
  // Generate a short description using OpenAI

  const prompt = `Create a blog, based on query ${queryParam}. Treat ${queryParam} as main keyword - it should be spread in the blog. At least 1300 words. Output with html tags, no markdown, to insert in Wordpress.`;
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
    const response = await fetch(WP_URL_POSTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth, // Authentication header
      },
      body: JSON.stringify(postDataParam),
    });

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log('Post created successfully:', data);
  } catch (error) {
    console.error('Error creating post:', error);
  }
};

function cleanUp(str) {
  return str
    .replace(/\bquotes?\b/gi, '') // remove "quote"/"quotes"
    .replace(/\s+/g, ' ') // collapse extra spaces
    .trim(); // remove leading/trailing space
}

function capitalizeFirstWord(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const createPostMain = async () => {
  const queries = await fetchSerpApi();
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
      content: blogContent,
      status: 'publish',
      categories: [91],
    };

    createPost(postData);
  }
};

createPostMain().catch(console.error);

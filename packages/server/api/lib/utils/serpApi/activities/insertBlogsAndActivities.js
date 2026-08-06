/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-return-await */
/* eslint-disable prefer-template */
// const fetch = require("node-fetch");

require('dotenv').config();

const fetchSerpApi = require('../serpApi');
const searchApps = require('../searchApps');
const insertApps = require('../insertApps');
const OpenAI = require('openai');
const { seedList } = require('../data/activities');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is set in your .env
});

const today = new Date();
const todayDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

const allowedDays = [0, 1];
const allowedDaysWeekWorld = [0];
const allowedDaysWeekUs = [1];

if (!allowedDays.includes(todayDay)) {
  console.log('Not an allowed day, skipping job.');
  process.exit(0);
}

// Credentials (from .env)
const USER_UID_ACTIVITIES = process.env.USER_UID_ACTIVITIES_PROD;
const API_PATH_ACTIVITIES = process.env.API_PATH_ACTIVITIES_PROD;
const USER_UID = process.env.USER_UID_MAH_PROD;
const API_PATH = process.env.API_PATH_MAH_PROD;

// fetch helpers

function capitalizeFirstWord(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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

  const prompt = `
You are an expert travel writer and SEO content strategist.

Write a comprehensive, original blog article targeting the keyword: "${queryParam}".

Requirements:
- The primary keyword is "${queryParam}".
- Use the keyword naturally throughout the article. Do not keyword stuff.
- Write at least 1,500 words.
- Use Markdown formatting.
- Start directly with the introduction. Do NOT include a title or H1.
- Use descriptive H2 and H3 headings.
- Write in an informative, engaging, and trustworthy style.
- Include practical advice, examples, and tips.
- Avoid fluff and generic filler.
- Keep paragraphs relatively short (2–4 sentences).
- Use bullet lists and numbered lists where appropriate.
- Answer common questions readers may have.
- Include relevant semantic keywords and synonyms naturally.
- Do not mention AI, ChatGPT, or that the article was generated.
- Do not include "Published by", author names, dates, or placeholders.
- Do not invent statistics or facts. If mentioning numbers, they should be well-known or approximate.
- End with a concise conclusion.

The article should satisfy someone searching for "${queryParam}" and provide enough value that they do not need to search elsewhere.
`;
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
    const response = await fetch(`${API_PATH_ACTIVITIES}/blogs`, {
      method: 'POST',
      headers: {
        token: `token ${USER_UID_ACTIVITIES}`,
        'Content-Type': 'application/json',
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

const createPostMain = async () => {
  // const queries = await fetchSerpApi('7');

  let queries;
  if (allowedDaysWeekWorld.includes(todayDay)) {
    queries = await fetchSerpApi('7', seedList, false, 5, 'en', '');
  }

  if (allowedDaysWeekUs.includes(todayDay)) {
    queries = await fetchSerpApi('7', seedList, false, 5);
  }

  // if (allowedDaysDay.includes(todayDay)) {
  //   queries = await fetchSerpApi('1', seedList, false, 3, 'en', '');
  // }

  console.log('queries', queries);
  const dedupedQueries = [];
  for (const query of queries) {
    try {
      const newQuery = await insertQuery(query);

      if (newQuery.existing) {
        console.log('Duplicate query skipped:', query.title);
        continue;
      }

      dedupedQueries.push(query.title);

      // CREATE BLOG

      const blogTitle = capitalizeFirstWord(query.title);
      const blogContent = await createBlogContent(query.title);

      const postData = {
        title: blogTitle,
        content: blogContent,
        status: 'published',
        user_id: '1',
      };

      await createPost(postData);
    } catch (err) {
      console.error(`Error processing query "${query.title}":`, err);
    }
  }

  // const apps = await searchApps(dedupedQueries);
  // await insertApps(apps);
};

createPostMain().catch(console.error);

/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
require('dotenv').config();
const HttpError = require('../lib/utils/http-error');
const normalizeValue = require('../../api/lib/utils/normalizeValue');

const { SERP_API_KEY } = process.env;
const USER_UID = process.env.USER_UID_MAH_PROD;

const excludeList = [
  'insurance',
  'cars',
  'mortgage',
  'loan',
  'renters',
  'vehicle',
  'mutual',
  'cheap',
  'auto',
  'state',
];

const serpCategories = [
  { id: 0, name: 'All categories' },
  // { id: 3, name: 'Arts & Entertainment' },
  // { id: 5, name: 'Computers & Electronics' },
  // { id: 7, name: 'Finance' },
  // { id: 8, name: 'Games' },
  // { id: 11, name: 'Home & Garden' },
  // { id: 12, name: 'Business & Industrial' },
  // { id: 13, name: 'Internet & Telecom' },
  // { id: 14, name: 'People & Society' },
  // { id: 16, name: 'News' },
  // { id: 18, name: 'Shopping' },
  // { id: 19, name: 'Law & Government' },
  // { id: 20, name: 'Sports' },
  // { id: 22, name: 'Books & Literature' },
  // { id: 23, name: 'Performing Arts' },
  // { id: 24, name: 'Visual Art & Design' },
  // { id: 25, name: 'Advertising & Marketing' },
  // { id: 28, name: 'Office Services' },
  // { id: 29, name: 'Real Estate' },
  // { id: 30, name: 'Computer Hardware' },
  // { id: 1075, name: 'Courts & Judiciary' },
  // { id: 1076, name: 'Signage' },
  // { id: 1077, name: 'Sports News' },
];

const seedListApp = ['app'];

async function fetchSerpApi(seedParam, periodParam, categoryParam) {
  const params = new URLSearchParams({
    engine: 'google_trends',
    q: seedParam,
    hl: 'en',
    geo: 'US',
    date: `now ${periodParam}-d`,
    data_type: 'RELATED_QUERIES',
    api_key: SERP_API_KEY,
  });

  if (categoryParam) {
    params.set('cat', categoryParam);
  }

  try {
    const response = await fetch(`https://serpapi.com/search?${params}`);
    const data = await response.json();
    const rising = data.related_queries?.rising || [];
    const categoryName = categoryParam
      ? serpCategories.find((c) => c.id === categoryParam)?.name ||
        categoryParam
      : null;
    const periodName =
      periodParam === '7' ? 'weekly' : periodParam === '1' ? 'daily' : '';
    const filteredData = rising
      .map((item) => ({
        title: item.query,
        value: normalizeValue(item.value),
        source: `${seedParam}, ${periodName}${
          categoryName ? `, ${categoryName}` : ''
        }`,
      }))
      .filter(
        (item) =>
          !excludeList.some((word) => item.title.toLowerCase().includes(word)),
      );

    console.log(filteredData);
    return filteredData;
  } catch (error) {
    console.error(`Error on fetch:`, error);
  }
}

const getQueriesTrends = async ({ token, days = 7 }) => {
  const userUid = token.split(' ')[1];
  const correctUser = userUid === USER_UID;
  // const user = (await knex('users').where({ uid: userUid }))[0];

  if (!token) {
    throw new HttpError('There are not users', 401);
  }

  if (!correctUser) {
    throw new HttpError('Access denined for user', 401);
  }

  try {
    const allQueries = [];
    for (const seed of seedListApp) {
      for (const category of serpCategories) {
        const result = await fetchSerpApi(seed, days, category.id);
        allQueries.push(...result);
      }
    }
    allQueries.sort((a, b) => b.value - a.value);
    return allQueries;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getQueriesTrends,
};

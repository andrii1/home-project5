/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
require('dotenv').config();

const { SERP_API_KEY } = process.env;
const normalizeValue = require('../normalizeValue');

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
  // { id: 0, name: 'All categories' },
  { id: 3, name: 'Arts & Entertainment' },
  { id: 5, name: 'Computers & Electronics' },
  { id: 7, name: 'Finance' },
  { id: 8, name: 'Games' },
  { id: 11, name: 'Home & Garden' },
  { id: 12, name: 'Business & Industrial' },
  { id: 13, name: 'Internet & Telecom' },
  { id: 14, name: 'People & Society' },
  { id: 16, name: 'News' },
  { id: 18, name: 'Shopping' },
  { id: 19, name: 'Law & Government' },
  { id: 20, name: 'Sports' },
  { id: 22, name: 'Books & Literature' },
  { id: 23, name: 'Performing Arts' },
  { id: 24, name: 'Visual Art & Design' },
  { id: 25, name: 'Advertising & Marketing' },
  { id: 28, name: 'Office Services' },
  { id: 29, name: 'Real Estate' },
  { id: 30, name: 'Computer Hardware' },
  { id: 1075, name: 'Courts & Judiciary' },
  { id: 1076, name: 'Signage' },
  { id: 1077, name: 'Sports News' },
];

// const seedList = ["maker", "template", "generator", "calculator", "tool"];
const seedList = ['app', 'error', 'website', 'app iphone', 'widget'];
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
    const filteredData = data.related_queries.rising
      .map((item) => ({
        title: item.query,
        value: normalizeValue(item.value), // relative score
      }))
      .filter(
        (item) =>
          !excludeList.some((word) => item.query.toLowerCase().includes(word)),
      );

    console.log(filteredData);
    return filteredData;
  } catch (error) {
    console.error(`Error on fetch:`, error);
  }
}

const useAllQueries = async (period, withCategories = false) => {
  const allQueries = [];
  if (withCategories) {
    for (const seed of seedListApp) {
      for (const category of serpCategories) {
        const result = await fetchSerpApi(seed, period, category.id);
        allQueries.push(...result);
      }
    }
  } else {
    for (const seed of seedList) {
      const result = await fetchSerpApi(seed, period);
      allQueries.push(...result);
    }
  }
  console.log(allQueries);

  return allQueries;
};

// useAllQueries().catch(console.error);
module.exports = useAllQueries;

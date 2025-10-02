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
// const seedList = ["maker", "template", "generator", "calculator", "tool"];
const seedList = [
  'maker',
  'template',
  'generator',
  'creator',
  'examples',
  'calculator',
  'converter',
];

const list =
  'Maker, template, generator, ideas, examples, design, creator, generator online, template generator, file generator, samples, calculator, tool, app, converter';

async function fetchSerpApi(seedParam, periodParam) {
  const params = new URLSearchParams({
    engine: 'google_trends',
    q: seedParam,
    hl: 'en',
    geo: 'US',
    date: `now ${periodParam}-d`,
    data_type: 'RELATED_QUERIES',
    api_key: SERP_API_KEY,
  });

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

const useAllQueries = async (period) => {
  const allQueries = [];
  for (const seed of seedList) {
    const result = await fetchSerpApi(seed, period);
    allQueries.push(...result);
  }
  console.log(allQueries);

  return allQueries;
};

// useAllQueries().catch(console.error);
module.exports = useAllQueries;

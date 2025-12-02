require('dotenv').config();

const { SERP_API_KEY, SERP_API_KEY2, SERP_API_KEY3, SERP_API_KEY4 } =
  process.env;

const apiKeys = [SERP_API_KEY, SERP_API_KEY2, SERP_API_KEY3, SERP_API_KEY4];

let currentKeyIndex = 0;

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

async function fetchSerpApiTrendingNow(
  periodParam,
  siteIdParam,
  dataSourceParam,
  categoryParam,
  langParam = 'en',
  geoParam = 'US',
) {
  const apiKey = apiKeys[currentKeyIndex];

  // rotate key
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;

  const params = new URLSearchParams({
    engine: 'google_trends_trending_now',
    hl: langParam || 'en',
    geo: geoParam || 'US',
    api_key: apiKey,
    only_active: true,
    hours: periodParam,
  });

  if (categoryParam) {
    params.set('category_id', categoryParam);
  }

  try {
    const response = await fetch(`https://serpapi.com/search?${params}`);
    const data = await response.json();

    const trends = data?.trending_searches || [];

    const periodName =
      periodParam === '24'
        ? 'daily'
        : periodParam === '48'
        ? 'two days'
        : periodParam === '168'
        ? 'weekly'
        : '';

    const filteredData = trends
      .map((item) => {
        const title = item.query;
        const value = Number(item.increase_percentage) / 100;

        return {
          title,
          value,
          source: `${periodName}, ${item.categories[0].name}`,
          site_id: siteIdParam,
          data_source: dataSourceParam,
        };
      })
      .filter(
        (item) =>
          !excludeList.some((word) => item.title.toLowerCase().includes(word)),
      );

    console.log(filteredData);
    return filteredData;
  } catch (error) {
    console.error('Error on fetch:', error);
  }
}

// fetchSerpApiTrendingNow('24', 4, 'googleTrendingNow');

module.exports = fetchSerpApiTrendingNow;

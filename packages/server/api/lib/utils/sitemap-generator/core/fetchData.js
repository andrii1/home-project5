// core/fetchData.js
module.exports = async function fetchData(host, apiPaths) {
  const results = {};

  for (const item of apiPaths) {
    const url = `${host}/api/${item.path}`;

    try {
      console.log(`🔍 Fetching: ${url}`);

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Accept: 'application/json',
        },
      });

      const contentType = res.headers.get('content-type') || '';

      console.log(`STATUS: ${res.status}`);
      console.log(`CONTENT-TYPE: ${contentType}`);

      // If server returned HTML → wrong route
      if (!contentType.includes('application/json')) {
        const html = await res.text();
        console.error('❌ ERROR: Expected JSON but received HTML page.');
        console.error('RAW RESPONSE (first 200 bytes):', html.slice(0, 200));
        throw new Error(`Endpoint returned HTML instead of JSON: ${url}`);
      }

      // Parse JSON safely
      const data = await res.json();

      results[item.prefix] = Array.isArray(data) ? data : [data];
    } catch (err) {
      console.error(`❌ Fetch failed for ${url}`);
      console.error(err);
      results[item.prefix] = []; // avoid breaking sitemap
    }
  }

  return results;
};

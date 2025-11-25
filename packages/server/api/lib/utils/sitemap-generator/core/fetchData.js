module.exports = async function fetchData(host, apiPaths) {
  const results = {};

  await Promise.all(
    apiPaths.map(async (item) => {
      try {
        const res = await fetch(`${host}/api/${item.path}`);
        const data = await res.json();
        results[item.prefix] = Array.isArray(data) ? data : [data];
      } catch (err) {
        console.error(`❌ Fetch failed for ${item.path}`, err);
        results[item.prefix] = [];
      }
    }),
  );

  return results;
};

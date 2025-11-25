module.exports = function buildUrls(staticRoutes, apiResults, config) {
  let urls = [];

  // Add static routes
  urls.push(...staticRoutes.map((r) => ({ url: r })));

  // Add dynamic routes
  config.apiPaths.forEach((apiConfig, i) => {
    const items = apiResults[i];
    const prefix = apiConfig.prefix;

    urls.push(
      ...items.map((item) => ({
        url: `/${prefix}/${item.slug || item.id}`,
        changefreq: 'weekly',
      })),
    );
  });

  return urls;
};

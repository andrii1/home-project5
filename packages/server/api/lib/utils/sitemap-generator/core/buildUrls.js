// core/buildUrls.js
module.exports = function buildUrls(staticRoutes, apiData, siteConfig) {
  const urls = [];

  // Add static routes
  urls.push(...staticRoutes.map((r) => ({ url: r })));

  // Build dynamic routes
  for (const [prefix, items] of Object.entries(apiData)) {
    if (!Array.isArray(items)) continue;

    items.forEach((item) => {
      const identifier = item.slug || item.id || item._id || item.code || null;

      if (!identifier) {
        console.warn(`⚠ Missing identifier for prefix: ${prefix}`, item);
        return;
      }

      urls.push({
        url: `/${prefix}/${identifier}`,
        changefreq: 'weekly',
      });
    });
  }

  return urls;
};

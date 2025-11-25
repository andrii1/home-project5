const { SitemapIndexStream, streamToPromise } = require('sitemap');

module.exports = async function generateIndex(items) {
  const indexStream = new SitemapIndexStream();

  items.forEach((item) => indexStream.write(item));
  indexStream.end();

  return streamToPromise(indexStream);
};

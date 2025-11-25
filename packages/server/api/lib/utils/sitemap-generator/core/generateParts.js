const { SitemapStream, streamToPromise } = require('sitemap');

module.exports = async function generateSitemapParts(host, urls, maxUrls) {
  const chunks = [];

  while (urls.length) {
    chunks.push(urls.splice(0, maxUrls));
  }

  const parts = [];

  for (let i = 0; i < chunks.length; i++) {
    const part = i + 1;

    const smStream = new SitemapStream({ hostname: host });
    chunks[i].forEach((url) => smStream.write(url));
    smStream.end();

    const xml = await streamToPromise(smStream);
    parts.push({ part, xml });
  }

  return parts;
};

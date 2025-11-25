/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Absolute path to config folder, based on the location of run.js
const configDir = path.join(__dirname, 'config');

if (!fs.existsSync(configDir)) {
  console.error('Config folder not found:', configDir);
  process.exit(1);
}

const fetchData = require('./core/fetchData');
const buildUrls = require('./core/buildUrls');
const generateParts = require('./core/generateParts');
const uploadToS3 = require('./core/uploadToS3');
const generateIndex = require('./core/generateIndex');

const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;

(async () => {
  const today = new Date();
  if (today.getDay() !== 0) {
    console.log('Not Sunday — skipping weekly sitemap job.');
    return;
  }

  // Load all config files from /config/
  const sites = fs
    .readdirSync(configDir)
    .filter((f) => f.endsWith('.config.js'))
    .map((f) => require(path.join(configDir, f)));

  console.log(
    'Loaded sites:',
    sites.map((s) => s.host),
  );

  for (const site of sites) {
    console.log(`\n🚀 Starting sitemap for: ${site.host}`);

    // Fetch dynamic data
    const apiResults = await fetchData(site.host, site.apiPaths);

    // Build URLs
    const urls = buildUrls(site.staticRoutes, apiResults, site);
    console.log(`Collected ${urls.length} URLs`);

    // Generate chunks (multiple sitemaps if needed)
    const parts = await generateParts(site.host, urls, site.maxUrls);

    const indexItems = [];

    // Upload each sitemap part
    for (let p of parts) {
      const filename = `sitemap-${p.part}.xml`;
      const key = `${site.folder}/${filename}`;

      await uploadToS3(S3_BUCKET, key, p.xml);
      indexItems.push({
        url: `${site.host}/api/sitemaps/${filename}`,
      });

      console.log(`Uploaded ${filename}`);
    }

    // Create & upload index file
    const indexXml = await generateIndex(indexItems);
    const indexKey = `${site.folder}/sitemap-index.xml`;

    await uploadToS3(S3_BUCKET, indexKey, indexXml);
    console.log(`Uploaded sitemap-index.xml`);

    console.log(`✔ Completed sitemap for: ${site.host}`);
  }
})();

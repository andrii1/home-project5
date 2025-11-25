module.exports = {
  host: 'https://www.topappdeals.com',
  folder: 'topappdeals',
  staticRoutes: ['/', '/deals', '/faq', '/login', '/signup'],
  apiPaths: [
    { path: 'deals', prefix: 'deals' },
    { path: 'codes', prefix: 'codes' },
    { path: 'categories', prefix: 'deals/categories' },
    { path: 'topics', prefix: 'deals/topics' },
    { path: 'blogs', prefix: 'blog' },
  ],
  maxUrls: 10000,
};

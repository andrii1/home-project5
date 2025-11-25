module.exports = {
  host: 'https://www.topappdeals.com',
  folder: 'topappdeals',
  staticRoutes: ['/', '/apps', '/faq', '/login', '/signup'],
  apiPaths: [
    { path: 'apps', prefix: 'apps' },
    { path: 'categories', prefix: 'apps/categories' },
    { path: 'tags', prefix: 'apps/tags' },
    { path: 'features', prefix: 'apps/features' },
    { path: 'useCases', prefix: 'apps/useCases' },
    { path: 'userTypes', prefix: 'apps/userTypes' },
    { path: 'industries', prefix: 'apps/industries' },
    { path: 'businessModels', prefix: 'apps/businessModels' },
  ],
  maxUrls: 10000,
};

module.exports = {
  host: 'https://www.catchdailydeals.com',
  folder: 'amazon',
  staticRoutes: ['/', '/products'],
  apiPaths: [
    { path: 'products', prefix: 'products' },
    { path: 'categories', prefix: 'products/categories' },
    { path: 'tags', prefix: 'products/tags' },
    { path: 'features', prefix: 'products/features' },
    { path: 'useCases', prefix: 'products/useCases' },
    { path: 'userTypes', prefix: 'products/userTypes' },
    { path: 'industries', prefix: 'products/industries' },
    { path: 'occasions', prefix: 'products/occasions' },
  ],
  maxUrls: 10000,
};

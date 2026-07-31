module.exports = {
  host: 'https://www.catchtopdeals.com',
  folder: 'catchtopdeals',
  staticRoutes: ['/', '/products'],
  apiPaths: [
    { path: 'products', prefix: 'products' },
    { path: 'categories', prefix: 'products/categories' },
    { path: 'platforms', prefix: 'products/platforms' },
    { path: 'tags', prefix: 'products/tags' },
    { path: 'highlights', prefix: 'products/highlights' },
    { path: 'useCases', prefix: 'products/useCases' },
  ],
  maxUrls: 10000,
};

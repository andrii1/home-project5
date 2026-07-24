module.exports = {
  host: 'https://www.errorcatalog.com',
  folder: 'errors',
  staticRoutes: ['/', '/login', '/signup'],
  apiPaths: [
    { path: 'errors', prefix: 'errors' },
    { path: 'categories', prefix: 'errors/categories' },
    { path: 'products', prefix: 'errors/products' },
    { path: 'tags', prefix: 'errors/tags' },
    { path: 'highlights', prefix: 'errors/highlights' },
    { path: 'userTypes', prefix: 'errors/userTypes' },
    { path: 'keywords', prefix: 'errors/keywords' },
  ],
  maxUrls: 10000,
};

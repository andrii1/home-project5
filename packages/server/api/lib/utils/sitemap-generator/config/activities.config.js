module.exports = {
  host: 'https://www.booktravelactivities.com',
  folder: 'activities',
  staticRoutes: ['/', '/products', '/blog'],
  apiPaths: [
    { path: 'products', prefix: 'products' },
    { path: 'categories', prefix: 'products/categories' },
    { path: 'countries', prefix: 'products/countries' },
    { path: 'areas', prefix: 'products/areas' },
    { path: 'cities', prefix: 'products/cities' },
    { path: 'tags', prefix: 'products/tags' },
    { path: 'highlights', prefix: 'products/highlights' },
    { path: 'useCases', prefix: 'products/useCases' },
    { path: 'userTypes', prefix: 'products/userTypes' },
    { path: 'occasions', prefix: 'products/occasions' },
    { path: 'blogs', prefix: 'blog' },
  ],
  maxUrls: 10000,
};

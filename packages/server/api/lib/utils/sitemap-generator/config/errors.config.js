module.exports = {
  host: 'https://www.errorcatalog.com',
  folder: 'errors',
  staticRoutes: ['/', '/login', '/signup'],
  apiPaths: [{ path: 'errors', prefix: 'errors' }],
  maxUrls: 10000,
};

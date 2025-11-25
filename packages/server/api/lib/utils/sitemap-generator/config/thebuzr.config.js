module.exports = {
  host: 'https://www.thebuzr.com',
  folder: 'blog1',
  staticRoutes: ['/', '/login', '/signup'],
  apiPaths: [{ path: 'blogs', prefix: 'blog' }],
  maxUrls: 10000,
};

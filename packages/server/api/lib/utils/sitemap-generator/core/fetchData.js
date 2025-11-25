module.exports = async function fetchData(host, apiPaths) {
  const api = (path) => fetch(`${host}/api/${path}`).then((r) => r.json());
  return Promise.all(apiPaths.map(api));
};

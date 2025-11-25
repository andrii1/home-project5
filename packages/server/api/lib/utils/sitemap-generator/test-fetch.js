const url = 'https://www.topappdeals.com/api/deals';

(async () => {
  console.log('Fetching:', url);

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/json',
    },
  });

  console.log('STATUS:', res.status);
  console.log('CONTENT-TYPE:', res.headers.get('content-type'));

  const text = await res.text();

  console.log('\n--- RAW RESPONSE START ---');
  console.log(text.slice(0, 500));
  console.log('--- RAW RESPONSE END ---\n');

  try {
    const json = JSON.parse(text);
    console.log(
      'JSON PARSED OK:',
      Array.isArray(json) ? `${json.length} items` : typeof json,
    );
  } catch (err) {
    console.error('❌ JSON parse failed:', err.message);
  }
})();

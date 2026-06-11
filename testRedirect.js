async function run() {
  const url = 'https://www.gamerpower.com/open/moonrise-fall-steam-giveaway';
  console.log("Original:", url);
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    console.log("Resolved HEAD:", res.url);
  } catch (e) {
    console.log("HEAD Error:", e.message);
  }
  try {
    const res2 = await fetch(url, { method: 'GET', redirect: 'follow' });
    console.log("Resolved GET:", res2.url);
  } catch (e) {
    console.log("GET Error:", e.message);
  }
}
run();

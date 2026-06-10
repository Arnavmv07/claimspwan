const db = require('./database.js');
async function run() {
  await db.getGames(); 
  const games = db.getGameById('gamerpower-3664') || (await db.getGames())[0];
  console.log("Game URL:", games.claim_url);
}
run();

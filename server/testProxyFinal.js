const db = require('./database.js');
async function run() {
  const games = await db.getGames(); 
  const apiGame = games.find(g => g.id.startsWith('gamerpower'));
  console.log("API Game:", apiGame);
}
run();

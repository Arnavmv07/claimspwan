const db = require('./server/database.js');
async function run() {
  await db.getGames(); // populate cache
  const games = db.getMemoryCache ? db.getMemoryCache().data : (await db.getGames());
  const game = db.getGameById(games[0].id.toString());
  console.log("Game 0:", game);
}
run();

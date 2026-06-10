const RSS = require('rss');
const db = require('./database');

async function generateRSSFeed() {
  const feed = new RSS({
    title: 'ClaimSpawn Free Games',
    description: 'Live alerts for 100% free PC games on Steam, Epic, Amazon, and GOG.',
    feed_url: 'https://claimspawn.store/api/rss',
    site_url: 'https://claimspawn.store',
    language: 'en',
    pubDate: new Date().toUTCString(),
    ttl: '60', // 1 hour cache
  });

  // Get games via the database export
  let games = [];
  try {
    games = await db.getGames();
  } catch(e) {
    console.error("RSS Feed Error reading cache:", e);
  }

  // Filter for active 100% free games only
  const activeFreeGames = games.filter(g => g.status === 'Active' && g.discount === '100% OFF');

  for (const game of activeFreeGames) {
    // Format a platform hashtag
    const platformTag = game.platform ? `#${game.platform.replace(/[^a-zA-Z0-9]/g, '')}` : '#PCGaming';
    
    // We will pack the tweet text into the description so IFTTT/dlvr.it can easily map it.
    // Injecting the HTML image tag directly into the description forces dlvr.it to use the game's cover art!
    let tweetText = `🚨 FREE GAME ALERT 🚨\n\n${game.title} is currently 100% FREE!\n(Originally ${game.original_price || 'Paid'})\n\n🎮 Platform: ${game.platform}\n🔗 Claim it now: https://claimspawn.store\n\n#FreeGames #PCGaming ${platformTag}`;
    
    if (game.image_url) {
      tweetText = `<img src="${game.image_url}" /><br/><br/>` + tweetText;
    }

    feed.item({
      title: `Free Game: ${game.title}`,
      description: tweetText,
      url: `https://claimspawn.store/#${game.id}`, // Unique URL anchor
      guid: game.id.toString(), // Extremely important so it doesn't double-post
      date: game.published_date || new Date().toUTCString(),
      enclosure: game.image_url ? { url: game.image_url, type: 'image/jpeg' } : undefined
    });
  }

  return feed.xml({ indent: true });
}

module.exports = {
  generateRSSFeed
};

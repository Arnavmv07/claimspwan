const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, 'tweeted_games.json');

// Initialize Twitter client
// It will only authenticate if the API keys are provided in .env
let twitterClient = null;
if (
  process.env.TWITTER_API_KEY &&
  process.env.TWITTER_API_SECRET &&
  process.env.TWITTER_ACCESS_TOKEN &&
  process.env.TWITTER_ACCESS_SECRET
) {
  twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });
}

/**
 * Loads the list of game IDs that have already been tweeted
 */
function getTweetedGames() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading tweeted_games.json:', error);
  }
  return [];
}

/**
 * Saves a new game ID to the tweeted state file
 */
function saveTweetedGame(gameId) {
  try {
    const tweeted = getTweetedGames();
    if (!tweeted.includes(gameId)) {
      tweeted.push(gameId);
      fs.writeFileSync(STATE_FILE, JSON.stringify(tweeted, null, 2));
    }
  } catch (error) {
    console.error('Error saving to tweeted_games.json:', error);
  }
}

/**
 * Sends a tweet to the connected account
 */
async function sendTweet(game) {
  if (!twitterClient) {
    console.log(`[Twitter Bot Skipped] Keys missing. Would have tweeted: ${game.title}`);
    return false;
  }

  // Format platform hashtag (e.g. "Epic Games Store" -> "#EpicGamesStore")
  const platformTag = game.platform ? `#${game.platform.replace(/[^a-zA-Z0-9]/g, '')}` : '#PCGaming';
  
  const tweetText = `🚨 FREE GAME ALERT 🚨

${game.title} is currently 100% FREE!
(Originally ${game.original_price || 'Paid'})

🎮 Platform: ${game.platform}
🔗 Claim it now: https://claimspawn.store

Tag a friend so they don't miss out! 👇

#FreeGames #PCGaming ${platformTag}`;

  try {
    const response = await twitterClient.v2.tweet(tweetText);
    console.log(`[Twitter Bot Success] Tweeted about: ${game.title} (ID: ${response.data.id})`);
    return true;
  } catch (error) {
    console.error(`[Twitter Bot Error] Failed to tweet about ${game.title}:`, error.message);
    return false;
  }
}

/**
 * Scans the live game list and tweets any brand new games
 */
async function checkAndTweetNewGames(liveGames) {
  const tweetedGames = getTweetedGames();
  
  // Only check games that are currently "Active" and 100% OFF
  const activeFreeGames = liveGames.filter(g => g.status === 'Active' && g.discount === '100% OFF');
  
  for (const game of activeFreeGames) {
    if (!tweetedGames.includes(game.id)) {
      console.log(`[Twitter Bot] Detected new game: ${game.title}. Attempting to tweet...`);
      
      // Attempt to tweet
      const success = await sendTweet(game);
      
      // Save state so we don't spam it again, even if the tweet fails (e.g., rate limit)
      // Actually, if it fails due to rate limits, we might want to try again later,
      // but for safety against infinite loops, we mark it as tweeted.
      saveTweetedGame(game.id);
      
      // Delay to avoid triggering anti-spam if multiple games drop at once
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

/**
 * Instantly tweets a custom game when manually injected
 */
async function tweetCustomGame(game) {
  const tweetedGames = getTweetedGames();
  if (!tweetedGames.includes(game.id)) {
    console.log(`[Twitter Bot] Custom game injected: ${game.title}. Attempting to tweet...`);
    await sendTweet(game);
    saveTweetedGame(game.id);
  }
}

/**
 * A test function for the user to verify API keys
 */
async function sendTestTweet() {
  if (!twitterClient) {
    throw new Error('Twitter API Keys are missing from environment variables (.env)');
  }
  const timestamp = new Date().toLocaleTimeString();
  const tweetText = `🛠️ ClaimSpawn Bot Test! Connected successfully at ${timestamp}.`;
  
  const response = await twitterClient.v2.tweet(tweetText);
  return response.data;
}

module.exports = {
  checkAndTweetNewGames,
  tweetCustomGame,
  sendTestTweet
};

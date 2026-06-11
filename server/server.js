const express = require('express');
const cors = require('cors');
const path = require('path');
const geoip = require('geoip-lite');
const db = require('./database');
const rssFeed = require('./rssFeed');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// --- ANALYTICS MEMORY STORE ---
const activeSessions = new Map(); // Key: IP, Value: { timestamp, country }

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// REST API Endpoints

// Get all games
app.get('/api/games', async (req, res) => {
  try {
    const { currency } = req.query;
    const games = await db.getGames(currency);
    res.json(games);
  } catch (error) {
    console.error('API Error /games:', error);
    res.status(500).json({ error: 'Failed to retrieve games database' });
  }
});

// Get all sales (PC, Xbox, PS5)
app.get('/api/sales', async (req, res) => {
  try {
    const { currency } = req.query;
    const sales = await db.getSales(currency);
    res.json(sales);
  } catch (error) {
    console.error('API Error /sales:', error);
    res.status(500).json({ error: 'Failed to retrieve sales database' });
  }
});

// Get a single game detail
app.get('/api/games/:id', async (req, res) => {
  try {
    const game = await db.getGameById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    console.error(`API Error /games/${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve game details' });
  }
});

// Post upvote/downvote
app.post('/api/games/:id/vote', async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'
    if (type !== 'up' && type !== 'down') {
      return res.status(400).json({ error: "Vote type must be 'up' or 'down'" });
    }
    const updatedGame = await db.incrementUpvotes(req.params.id, type);
    if (!updatedGame) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(updatedGame);
  } catch (error) {
    console.error(`API Error /games/${req.params.id}/vote:`, error);
    res.status(500).json({ error: 'Failed to process vote' });
  }
});

// Post community rating
app.post('/api/games/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body; // float 1.0 - 5.0
    const ratingFloat = parseFloat(rating);
    if (isNaN(ratingFloat) || ratingFloat < 1.0 || ratingFloat > 5.0) {
      return res.status(400).json({ error: 'Rating must be a float between 1.0 and 5.0' });
    }
    const updatedGame = await db.addRating(req.params.id, ratingFloat);
    if (!updatedGame) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(updatedGame);
  } catch (error) {
    console.error(`API Error /games/${req.params.id}/rate:`, error);
    res.status(500).json({ error: 'Failed to process rating' });
  }
});

// Resolve claim URL redirect server-side (optional backup)
app.get('/api/claim/:id', async (req, res) => {
  try {
    const game = await db.getGameById(req.params.id);
    if (!game) {
      return res.status(404).send('Game not found');
    }
    let targetUrl = game.claim_url;
    // Append Creator Tag if available
    if (game.epic_creator_tag && game.platform === 'Epic Games Store') {
      const separator = targetUrl.includes('?') ? '&' : '?';
      targetUrl = `${targetUrl}${separator}tag=${game.epic_creator_tag}`;
    }
    console.log(`Redirecting claim to: ${targetUrl}`);
    res.redirect(targetUrl);
  } catch (error) {
    console.error('API Error /claim redirect:', error);
    res.status(500).send('Internal redirect server error');
  }
});

// Post a custom game (Admin Panel)
app.post('/api/games/custom', async (req, res) => {
  try {
    const gameData = req.body;
    if (!gameData.title || !gameData.claim_url) {
      return res.status(400).json({ error: 'Title and Claim URL are required' });
    }
    const newGame = await db.addCustomGame(gameData);
    res.status(201).json(newGame);
  } catch (error) {
    console.error('API Error /games/custom:', error);
    res.status(500).json({ error: 'Failed to add custom game' });
  }
});

// Record a click/claim for FOMO mechanics
app.post('/api/games/:id/click', (req, res) => {
  const { id } = req.params;
  try {
    db.incrementClaimCount(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error tracking click:', err);
    res.status(500).json({ error: 'Failed to track' });
  }
});

// --- ANALYTICS ROUTES ---
app.post('/api/pulse', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const cleanIp = ip.split(',')[0].trim();
  const geo = geoip.lookup(cleanIp);
  const country = geo ? geo.country : 'Unknown';
  activeSessions.set(cleanIp, { timestamp: Date.now(), country });
  res.status(200).send('OK');
});

app.get('/api/admin/summary', (req, res) => {
  const now = Date.now();
  let count = 0;
  const demographics = {};
  
  for (const [ip, session] of activeSessions.entries()) {
    if (now - session.timestamp < 120000) { // Active in last 2 minutes
      count++;
      demographics[session.country] = (demographics[session.country] || 0) + 1;
    } else {
      activeSessions.delete(ip);
    }
  }
  
  res.json({ activeUsers: count, demographics });
});

// Programmatic SEO Sitemap Generator
app.get('/sitemap.xml', async (req, res) => {
  try {
    const games = await db.getGames('USD');
    const activeGames = games.filter(g => g.status === 'Active' || g.status === 'Upcoming');

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://claimspawn.store/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>`;

    activeGames.forEach(game => {
      sitemap += `
  <url>
    <loc>https://claimspawn.store/api/share/${game.id}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemap += `\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (err) {
    console.error('Error generating sitemap:', err);
    res.status(500).send('Server Error');
  }
});

// RSS Feed endpoint for free Twitter automation (IFTTT/dlvr.it)
app.get('/api/rss', async (req, res) => {
  try {
    const xml = await rssFeed.generateRSSFeed();
    res.set('Content-Type', 'text/xml');
    res.send(xml);
  } catch (error) {
    console.error('RSS Feed Error:', error.message);
    res.status(500).send('Internal Server Error generating RSS');
  }
});

// Dynamic OpenGraph Proxy for Social Media Sharing
app.get('/api/share/:id', async (req, res) => {
  const gameId = req.params.id;
  try {
    // We get the game directly from memory cache to be fast
    const game = await db.getGameById(gameId);

    if (!game) {
      return res.redirect(`https://claimspawn.store`);
    }

    const ogImage = game.image_url || game.thumbnail || 'https://claimspawn.store/default-share.jpg';

    // Generate the raw HTML with Meta tags for bots, and JS redirect for humans
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Free Game: ${game.title}</title>
    
    <!-- Open Graph / Facebook / dlvr.it -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Free Game: ${game.title}" />
    <meta property="og:description" content="Platform: ${game.platform} | Originally: ${game.original_price || 'Paid'}. Claim it now for 100% FREE!" />
    <meta property="og:image" content="${ogImage}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Free Game: ${game.title}" />
    <meta name="twitter:description" content="Platform: ${game.platform} | Originally: ${game.original_price || 'Paid'}. Claim it now for 100% FREE!" />
    <meta name="twitter:image" content="${ogImage}" />

    <!-- Fallback instant redirect for browsers that don't support JS -->
    <meta http-equiv="refresh" content="0; url=https://claimspawn.store/#${game.id}" />
</head>
<body>
    <p>Redirecting you to the game...</p>
    <!-- Instant redirect for actual humans clicking the link -->
    <script>
        window.location.replace("https://claimspawn.store/#${game.id}");
    </script>
</body>
</html>
    `;

    res.send(html);
  } catch (err) {
    console.error('Share Proxy Error:', err);
    res.redirect(`https://claimspawn.store`);
  }
});

// Serve frontend client in production
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// Catch-all route to serve Index for SPA (Vite)
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('ClaimSpawn Backend Service Running! (Run Client dev server to test UI)');
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`ClaimSpawn server listening on port ${PORT}`);
  console.log(`API base route: http://localhost:${PORT}/api`);
});

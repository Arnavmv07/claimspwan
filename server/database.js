const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

// High-quality Unsplash gaming images for fallback/seeding
const GAME_IMAGES = {
  gta: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
  bioshock: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
  witcher: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
  starwars: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  gears: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
  horizon: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop',
  celeste: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=800&auto=format&fit=crop',
  indie: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
  starcraft: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
  masseffect: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
  fallout: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a?q=80&w=800&auto=format&fit=crop',
  tombraider: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=800&auto=format&fit=crop',
  civilization: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop',
  controller: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop'
};

// Topic-Matched Fallback Image Engine
function getFallbackImage(title, platform) {
  const t = (title || '').toLowerCase();
  
  if (t.includes('star wars') || t.includes('jedi') || t.includes('skywalker') || t.includes('galaxy')) {
    return GAME_IMAGES.starwars;
  }
  if (t.includes('gta') || t.includes('grand theft') || t.includes('thief') || t.includes('mafia') || t.includes('crime') || t.includes('gang')) {
    return GAME_IMAGES.gta;
  }
  if (t.includes('witcher') || t.includes('scrolls') || t.includes('fantasy') || t.includes('sword') || t.includes('rpg') || t.includes('mage') || t.includes('elder') || t.includes('dragon')) {
    return GAME_IMAGES.witcher;
  }
  if (t.includes('horizon') || t.includes('forza') || t.includes('car') || t.includes('race') || t.includes('rally') || t.includes('speed') || t.includes('dirt') || t.includes('track') || t.includes('auto')) {
    return GAME_IMAGES.horizon;
  }
  if (t.includes('fallout') || t.includes('apocalypse') || t.includes('survival') || t.includes('post') || t.includes('dead') || t.includes('wasteland') || t.includes('zombie')) {
    return GAME_IMAGES.fallout;
  }
  if (t.includes('civilization') || t.includes('strategy') || t.includes('empire') || t.includes('command') || t.includes('conquer') || t.includes('starcraft') || t.includes('warcraft') || t.includes('total war') || t.includes('tactics')) {
    return GAME_IMAGES.starcraft;
  }
  if (t.includes('tomb') || t.includes('raider') || t.includes('lara') || t.includes('adventure') || t.includes('expedition') || t.includes('ruin') || t.includes('quest')) {
    return GAME_IMAGES.tombraider;
  }
  if (t.includes('bioshock') || t.includes('shock') || t.includes('underwater') || t.includes('rapture') || t.includes('infinite')) {
    return GAME_IMAGES.bioshock;
  }
  if (t.includes('celeste') || t.includes('indie') || t.includes('pixel') || t.includes('platformer') || t.includes('jump') || t.includes('retro') || t.includes('arcade')) {
    return GAME_IMAGES.celeste;
  }
  if (t.includes('gears') || t.includes('shooter') || t.includes('halo') || t.includes('doom') || t.includes('cod') || t.includes('warfare') || t.includes('strike') || t.includes('gun')) {
    return GAME_IMAGES.gears;
  }
  if (t.includes('mass effect') || t.includes('sci-fi') || t.includes('alien') || t.includes('star') || t.includes('planet') || t.includes('ship')) {
    return GAME_IMAGES.masseffect;
  }
  
  // Use platform or a fallback
  if ((platform || '').toLowerCase().includes('epic')) {
    return GAME_IMAGES.controller;
  }
  
  // Standard high-quality defaults based on dynamic hash of title
  const fallbacks = [
    GAME_IMAGES.indie,
    GAME_IMAGES.controller,
    GAME_IMAGES.witcher,
    GAME_IMAGES.horizon,
    GAME_IMAGES.starwars
  ];
  
  let hash = 0;
  for (let i = 0; i < t.length; i++) {
    hash = t.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbacks.length;
  return fallbacks[index];
}

// Local cache for Steam prices and images
let steamCache = {};
const STEAM_CACHE_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours

async function fetchSteamDetails(steamAppID) {
  const now = Date.now();
  if (steamCache[steamAppID] && (now - steamCache[steamAppID].timestamp < STEAM_CACHE_EXPIRY)) {
    return steamCache[steamAppID];
  }

  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${steamAppID}&cc=us&l=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data[steamAppID] && data[steamAppID].success) {
        const gameData = data[steamAppID].data;
        let originalPrice = null;
        let salePrice = null;
        let discount = null;

        if (gameData.is_free) {
          originalPrice = "$0.00";
          salePrice = "$0.00";
          discount = "100% OFF";
        } else if (gameData.price_overview) {
          originalPrice = gameData.price_overview.initial_formatted || `$${(gameData.price_overview.initial / 100).toFixed(2)}`;
          salePrice = gameData.price_overview.final_formatted || `$${(gameData.price_overview.final / 100).toFixed(2)}`;
          discount = gameData.price_overview.discount_percent > 0 ? `${gameData.price_overview.discount_percent}% OFF` : null;
        }

        // Use Akamai CDN for Steam header image (reliable and gorgeous resolution)
        const imageUrl = gameData.header_image || `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppID}/header.jpg`;

        const details = {
          original_price: originalPrice,
          sale_price: salePrice,
          discount: discount,
          image_url: imageUrl,
          timestamp: now
        };

        steamCache[steamAppID] = details;
        return details;
      }
    }
  } catch (error) {
    console.error(`[Steam API] Error fetching details for app ${steamAppID}:`, error);
  }

  return null;
}

const SEED_DATA = [
  {
    id: 'steam-civilization-vi',
    title: "Sid Meier's Civilization VI",
    platform: "Steam",
    original_price: "$59.99",
    discount: "100% OFF",
    image_url: GAME_IMAGES.civilization,
    status: "Expired",
    claim_url: "https://store.steampowered.com/app/289070/Sid_Meiers_Civilization_VI/",
    epic_creator_tag: "",
    start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 420,
    community_rating: 4.6,
    description: "Civilization VI offers new ways to interact with your world: cities now physically expand across the map, active research in technology and culture unlocks new potential, and competing leaders will pursue their own agendas based on their historical traits as you race for one of five ways to achieve victory.",
    instructions: "1. Log in to your Steam Account. 2. Navigate to the Civilization VI Store Page. 3. Click 'Add to Library' to claim your game permanently for 100% free.",
    system_requirements: {
      minimum: "OS: Windows 7 64bit / 8.1 64bit / 10 64bit | Processor: Intel Core i3 2.5 Ghz or AMD Phenom II 2.6 Ghz | Memory: 4 GB RAM | Graphics: 1 GB AMD 5570 or nVidia 450",
      recommended: "OS: Windows 7 64bit / 8.1 64bit / 10 64bit | Processor: Fourth Generation Intel Core i5 2.5 Ghz or AMD FX8350 4.0 Ghz | Memory: 8 GB RAM | Graphics: 2 GB AMD 7970 or nVidia 770"
    }
  },
  {
    id: 'epic-mystery-game',
    title: "Epic Games Weekly Mystery Game (Unrevealed)",
    platform: "Epic Games Store",
    original_price: "$59.99",
    discount: "100% OFF",
    image_url: GAME_IMAGES.controller,
    status: "Upcoming",
    claim_url: "https://store.epicgames.com/en-US/free-games",
    epic_creator_tag: "lootquest-20",
    start_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    upvotes: 0,
    community_rating: 0.0,
    description: "Every week, Epic Games Store reveals a massive premium mystery game for users to claim for absolutely 100% free. Keep your eyes on the countdown timer as the lock opens and the title is revealed!",
    instructions: "Come back when the countdown ticks to zero! Log in to Epic Games Store and click Claim Free Key to unlock.",
    system_requirements: {
      minimum: "Mystery Game specs will be revealed when the countdown ends. Check back soon!",
      recommended: "Check back soon when the countdown ends!"
    }
  },
  {
    id: 'ubisoft-ac-valhalla',
    title: "Assassin's Creed Valhalla",
    platform: "Ubisoft Connect",
    original_price: "$59.99",
    discount: "100% OFF",
    image_url: GAME_IMAGES.fallout,
    status: "Upcoming",
    claim_url: "https://store.ubi.com/",
    epic_creator_tag: "",
    start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 0,
    community_rating: 0.0,
    description: "Become Eivor, a legendary Viking warrior raised on tales of battle and glory. Explore a dynamic and beautiful open world set against the brutal backdrop of England’s Dark Ages. Raid your enemies, grow your settlement, and build your political power in your quest to earn a place among the gods in Valhalla.",
    instructions: "Unlocks on the release date. Open Ubisoft Connect, navigate to the Free Deals banner, and claim for $0.00 checkout.",
    system_requirements: {
      minimum: "OS: Windows 10 64-bit | Processor: Intel i5-4460 or AMD Ryzen 3 1200 | Memory: 8 GB RAM | Graphics: NVIDIA GTX 960 or AMD R9 380",
      recommended: "OS: Windows 10 64-bit | Processor: Intel i7-4790 or AMD Ryzen 5 1600 | Memory: 8 GB RAM | Graphics: NVIDIA GTX 1060 or AMD RX 570"
    }
  },
  {
    id: 'epic-gta-v',
    title: "Grand Theft Auto V: Premium Edition",
    platform: "Epic Games Store",
    original_price: "$29.99",
    discount: "100% OFF",
    image_url: GAME_IMAGES.gta,
    status: "Expired",
    claim_url: "https://store.epicgames.com/en-US/p/grand-theft-auto-v",
    epic_creator_tag: "lootquest-20",
    start_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 2450,
    community_rating: 4.8,
    description: "The Grand Theft Auto V: Premium Edition includes the complete Grand Theft Auto V story experience, free access to the ever-evolving Grand Theft Auto Online and all existing gameplay upgrades and content including The Doomsday Heist, Gunrunning, Smuggler’s Run, Bikers and much more.",
    instructions: "This deal has officially closed. Make sure to watch the Active Deals tab to catch the next premium mystery giveaway!",
    system_requirements: {
      minimum: "OS: Windows 8.1 64 Bit / 8 64 Bit / 7 64 Bit Service Pack 1 | Processor: Intel Core 2 Quad CPU Q6600 @ 2.40GHz / AMD Phenom 9850 Quad-Core Processor @ 2.5GHz | Memory: 4 GB RAM | Graphics: NVIDIA 9800 GT 1GB / AMD HD 4870 1GB",
      recommended: "OS: Windows 10 64 Bit | Processor: Intel Core i5 3470 @ 3.2GHz / AMD X8 FX-8350 @ 4GHz | Memory: 8 GB RAM | Graphics: NVIDIA GTX 660 2GB / AMD HD 7870 2GB"
    }
  },
  {
    id: 'humble-dirt-rally',
    title: "DiRT Rally 2.0",
    platform: "Humble Store",
    original_price: "$39.99",
    discount: "100% OFF",
    image_url: GAME_IMAGES.tombraider,
    status: "Expired",
    claim_url: "https://www.humblebundle.com/store/dirt-rally-2",
    epic_creator_tag: "",
    start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 410,
    community_rating: 4.2,
    description: "DiRT Rally 2.0 dares you to carve your way through a selection of iconic rally locations from across the globe, in the most powerful off-road vehicles ever made, knowing that the smallest mistake could end your stage.",
    instructions: "Deal expired on Humble Store. Keep watching the active aggregator calendar.",
    system_requirements: {
      minimum: "OS: 64bit versions of Windows 7, Windows 8, Windows 10 | Processor: AMD FX4300 or Intel Core i3 2130 | Memory: 8 GB RAM | Graphics: AMD HD7750 or NVIDIA GTX650Ti",
      recommended: "OS: 64bit versions of Windows 7, Windows 8, Windows 10 | Processor: AMD Ryzen 5 2600X or Intel Core i5 8600K | Memory: 8 GB RAM | Graphics: AMD RX Vega 56 or NVIDIA GTX 1070"
    }
  }
];

// Memory Cache object
let memoryCache = {
  data: null,
  expiry: 0
};
const CACHE_DURATION = 5 * 60 * 1000;

function mapPlatform(gpPlatform) {
  const plat = (gpPlatform || '').toLowerCase();
  
  if (plat.includes('epic')) return 'Epic Games Store';
  if (plat.includes('steam')) return 'Steam';
  if (plat.includes('gog')) return 'GOG';
  if (plat.includes('itch')) return 'Itch.io';
  if (plat.includes('amazon') || plat.includes('prime')) return 'Amazon Games / Prime Gaming';
  if (plat.includes('humble')) return 'Humble Store';
  if (plat.includes('ubisoft') || plat.includes('uplay')) return 'Ubisoft Connect';
  if (plat.includes('ea ') || plat.includes('origin')) return 'EA App';
  if (plat.includes('battle.net')) return 'Battle.net';
  if (plat.includes('playstation') || plat.includes('ps4') || plat.includes('ps5')) return 'PlayStation Store';
  if (plat.includes('xbox')) return 'Xbox Store';
  if (plat.includes('nintendo') || plat.includes('switch')) return 'Nintendo eShop';
  
  if (plat.includes('pc') || plat.includes('drm-free')) return 'Steam';
  return 'Steam';
}

function saveGames(games) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(games, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

async function getGames() {
  const now = Date.now();
  
  if (memoryCache.data && memoryCache.expiry > now) {
    return memoryCache.data;
  }
  
  let localGames = [];
  try {
    if (fs.existsSync(DB_PATH)) {
      localGames = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('Error parsing local JSON DB:', e);
  }

  try {
    console.log('[API] Fetching real-time giveaways from GamerPower API...');
    const response = await fetch('https://www.gamerpower.com/api/giveaways');
    
    if (response.ok) {
      const liveData = await response.json();
      
      if (Array.isArray(liveData)) {
        const fullGamesOnly = liveData.filter(item => {
          const isGame = item.type.toLowerCase().includes('game') || item.type.toLowerCase().includes('pack') || item.type.toLowerCase().includes('loot');
          return isGame;
        });

        const mappedLiveGames = fullGamesOnly.map(gp => {
          const platformMapped = mapPlatform(gp.platforms);
          
          let worth = gp.worth;
          if (!worth || worth === 'N/A' || worth === '0.00' || worth === 'FREE') {
            const basePrices = ['$19.99', '$29.99', '$39.99', '$14.99', '$49.99'];
            worth = basePrices[gp.id % basePrices.length];
          }
          
          let endDate = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
          if (gp.end_date && gp.end_date !== 'N/A') {
            try {
              const parsed = new Date(gp.end_date);
              if (!isNaN(parsed.getTime())) {
                endDate = parsed.toISOString();
              }
            } catch (e) {}
          }
          
          const existing = localGames.find(g => g.id === `gamerpower-${gp.id}`);
          const upvotes = existing ? existing.upvotes : ((gp.id % 350) + 120);
          const rating = existing ? existing.community_rating : parseFloat((4.1 + ((gp.id % 9) * 0.1)).toFixed(1));

          return {
            id: `gamerpower-${gp.id}`,
            title: gp.title,
            platform: platformMapped,
            original_price: worth,
            discount: "100% OFF",
            image_url: (() => {
              const img = gp.image || gp.thumbnail || '';
              if (!img || img.trim() === '' || img.toLowerCase().includes('placeholder') || img.toLowerCase().includes('no-image') || img === 'N/A') {
                return getFallbackImage(gp.title, platformMapped);
              }
              return img;
            })(),
            status: "Active",
            claim_url: gp.open_giveaway_url,
            epic_creator_tag: platformMapped === 'Epic Games Store' ? 'lootquest-20' : '',
            start_date: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
            end_date: endDate,
            upvotes: upvotes,
            community_rating: rating,
            description: gp.description || "",
            instructions: gp.instructions || "",
            system_requirements: {
              minimum: `OS: Windows 10 64-bit | Core specifications required for standard setup.`,
              recommended: `Instructions: Checkout on storefront.`
            }
          };
        });

        // MERGE: Keep all mapped live games AND all seeded games, deduplicated by ID
        const mergedGames = [...mappedLiveGames];
        SEED_DATA.forEach(seeded => {
          if (!mergedGames.some(g => g.id === seeded.id)) {
            mergedGames.push(seeded);
          }
        });
        
        saveGames(mergedGames);
        
        memoryCache.data = mergedGames;
        memoryCache.expiry = now + CACHE_DURATION;
        console.log(`[API] Success! Loaded and merged ${mergedGames.length} free games!`);
        return mergedGames;
      }
    }
  } catch (error) {
    console.error('[API] Network/Fetch error, falling back to local cached DB:', error);
  }

  if (localGames.length > 0) {
    // If cache mapping was previously done, make sure all seeded items are inside
    const mergedFallback = [...localGames];
    SEED_DATA.forEach(seeded => {
      if (!mergedFallback.some(g => g.id === seeded.id)) {
        mergedFallback.push(seeded);
      }
    });
    memoryCache.data = mergedFallback;
    memoryCache.expiry = now + 15000;
    return mergedFallback;
  }
  
  memoryCache.data = SEED_DATA;
  memoryCache.expiry = now + 15000;
  return SEED_DATA;
}

async function getGameById(id) {
  const games = await getGames();
  return games.find(g => g.id === id) || null;
}

async function incrementUpvotes(id, type) {
  const games = await getGames();
  const game = games.find(g => g.id === id);
  if (game) {
    if (type === 'up') {
      game.upvotes = (game.upvotes || 0) + 1;
    } else if (type === 'down') {
      game.upvotes = Math.max(0, (game.upvotes || 0) - 1);
    }
    saveGames(games);
    return game;
  }
  return null;
}

async function addRating(id, userRating) {
  const games = await getGames();
  const game = games.find(g => g.id === id);
  if (game) {
    const currentRating = game.community_rating || 0.0;
    if (currentRating === 0.0) {
      game.community_rating = parseFloat(userRating.toFixed(1));
    } else {
      const newRating = (currentRating * 9 + userRating) / 10;
      game.community_rating = parseFloat(newRating.toFixed(1));
    }
    saveGames(games);
    return game;
  }
  return null;
}

let salesCache = {
  data: null,
  expiry: 0
};
const SALES_CACHE_DURATION = 15 * 60 * 1000;

const CONSOLE_SALES = [
  {
    id: 'xbox-forza-horizon-5',
    title: "Forza Horizon 5",
    platform: "Xbox",
    original_price: "$59.99",
    sale_price: "$29.99",
    discount: "50% OFF",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg",
    claim_url: "https://www.xbox.com/en-US/games/store/forza-horizon-5/9nkx70bbcdgs",
    upvotes: 684,
    rating: 4.8
  },
  {
    id: 'xbox-halo-infinite',
    title: "Halo Infinite (Campaign)",
    platform: "Xbox",
    original_price: "$59.99",
    sale_price: "$19.99",
    discount: "67% OFF",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1240440/header.jpg",
    claim_url: "https://www.xbox.com/en-US/games/store/halo-infinite-campaign/9np1p1wfs0lb",
    upvotes: 420,
    rating: 4.3
  },
  {
    id: 'xbox-elden-ring',
    title: "Elden Ring",
    platform: "Xbox",
    original_price: "$59.99",
    sale_price: "$39.99",
    discount: "33% OFF",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    claim_url: "https://www.xbox.com/en-US/games/store/elden-ring/9p3j32ctxlrx",
    upvotes: 954,
    rating: 4.9
  },
  {
    id: 'xbox-cyberpunk-2077',
    title: "Cyberpunk 2077",
    platform: "Xbox",
    original_price: "$59.99",
    sale_price: "$29.99",
    discount: "50% OFF",
    image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    claim_url: "https://www.xbox.com/en-US/games/store/cyberpunk-2077/9nkx70bbcdgs",
    upvotes: 512,
    rating: 4.2
  },
  {
    id: 'ps5-spiderman-2',
    title: "Marvel's Spider-Man 2",
    platform: "PS5",
    original_price: "$69.99",
    sale_price: "$49.99",
    discount: "28% OFF",
    image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7b75d8ed9271516546560d219ad0b22ee0a263b4537bd8.png",
    claim_url: "https://store.playstation.com/en-us/concept/10002456",
    upvotes: 892,
    rating: 4.9
  },
  {
    id: 'ps5-god-of-war-ragnarok',
    title: "God of War Ragnarök",
    platform: "PS5",
    original_price: "$69.99",
    sale_price: "$39.99",
    discount: "43% OFF",
    image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202503/2016/b69c06fb108299866057126b0d3a0530bdf96a39d2ce1cb9.png",
    claim_url: "https://store.playstation.com/en-us/concept/10001850",
    upvotes: 754,
    rating: 4.8
  },
  {
    id: 'ps5-last-of-us-part-1',
    title: "The Last of Us Part I",
    platform: "PS5",
    original_price: "$69.99",
    sale_price: "$34.99",
    discount: "50% OFF",
    image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202206/0720/eEczyEMDd2BLa3dtkGJVE9Id.png",
    claim_url: "https://store.playstation.com/en-us/concept/10002694",
    upvotes: 620,
    rating: 4.7
  },
  {
    id: 'ps5-demons-souls',
    title: "Demon's Souls",
    platform: "PS5",
    original_price: "$69.99",
    sale_price: "$29.99",
    discount: "57% OFF",
    image_url: "https://image.api.playstation.com/vulcan/ap/rnd/202210/0315/asGInU6zOf8SvsD4bxbXGdqU.png",
    claim_url: "https://store.playstation.com/en-us/concept/10001224",
    upvotes: 412,
    rating: 4.6
  }
];

async function getSales() {
  const now = Date.now();
  if (salesCache.data && salesCache.expiry > now) {
    return salesCache.data;
  }

  let pcSales = [];
  try {
    console.log('[API] Fetching real-time Steam PC sales from CheapShark...');
    const response = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1&upperLimit=30');
    if (response.ok) {
      const deals = await response.json();
      if (Array.isArray(deals)) {
        const detailedSalesPromises = deals.map(async (deal) => {
          let originalPrice = `$${deal.normalPrice}`;
          let salePrice = `$${deal.salePrice}`;
          let discount = `${Math.round(parseFloat(deal.savings))}% OFF`;
          // Akamai CDN is highly reliable and provides high-res Steam header pictures
          let imageUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${deal.steamAppID}/header.jpg`;

          if (deal.steamAppID) {
            const steamDetails = await fetchSteamDetails(deal.steamAppID);
            if (steamDetails) {
              if (steamDetails.original_price) originalPrice = steamDetails.original_price;
              if (steamDetails.sale_price) salePrice = steamDetails.sale_price;
              if (steamDetails.discount) discount = steamDetails.discount;
              if (steamDetails.image_url) imageUrl = steamDetails.image_url;
            }
          }

          return {
            id: `pc-${deal.dealID}`,
            title: deal.title,
            platform: 'PC',
            original_price: originalPrice,
            sale_price: salePrice,
            discount: discount || `${Math.round(parseFloat(deal.savings))}% OFF`,
            image_url: imageUrl,
            claim_url: `https://store.steampowered.com/app/${deal.steamAppID}`,
            upvotes: Math.round(parseFloat(deal.dealRating) * 50) + 120,
            rating: parseFloat((parseFloat(deal.steamRatingPercent) / 20).toFixed(1)) || 4.2
          };
        });

        pcSales = await Promise.all(detailedSalesPromises);
      }
    }
  } catch (error) {
    console.error('Error fetching CheapShark PC deals:', error);
  }

  const mergedSales = [...pcSales, ...CONSOLE_SALES];
  salesCache.data = mergedSales;
  salesCache.expiry = now + SALES_CACHE_DURATION;
  return mergedSales;
}

module.exports = {
  getGames,
  getGameById,
  incrementUpvotes,
  addRating,
  getSales
};

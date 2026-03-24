# ☠ The Grand Line — One Piece MMORPG

A complete One Piece browser MMORPG rebuilt from the original OPLegend/Anime Pirates game, featuring real extracted artwork, full game systems, and multiplayer support.

## Features

- **35+ Heroes** — Luffy, Zoro, Sanji, Shanks, Kaido, Big Mom, Blackbeard, Whitebeard, Roger, all Admirals, all Warlords, and more
- **Real Artwork** — Original character portraits, battle backgrounds, and equipment icons from the source game
- **Full Campaign** — 8 arcs: East Blue, Alabasta, Skypiea, Water 7, Thriller Bark, Marineford, New World, Elbaf
- **Turn-Based Battle Engine** — Skills, rage abilities, debuffs, multi-hit combos
- **Gacha/Summon System** — 3 banners with pity counter (guaranteed legendary at 50 pulls)
- **Crew Management** — Level up, star up, view skills and lore
- **Formation System** — 5-slot battle formation
- **Shipyard** — Upgrade sail, cannon, and hull
- **Daily Tasks** — Complete for Gold, Gems, Tickets
- **Mail System** — Claim attachment rewards
- **Leaderboard** — Compete with other players
- **Multiplayer** — Multiple accounts, real-time via Socket.IO

## Quick Start (Mac)

### Prerequisites
- [Node.js 18+](https://nodejs.org)
- [PostgreSQL 14+](https://www.postgresql.org/download/macosx/)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/grandline.git
cd grandline

# 2. Download and extract the assets package (provided separately)
# Place the extracted 'assets' folder at: server/public/assets/

# 3. Set up the database
createdb grandline
psql -d grandline -f server/schema.sql

# 4. Install server dependencies
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials

# 5. Seed the database
node seed.js

# 6. Start the server
node index.js &

# 7. Install and start the client
cd ../client
npm install
npm run dev

# 8. Open your browser
open http://localhost:5173
```

### Environment Variables (server/.env)

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/grandline
JWT_SECRET=your-secret-key-here
PORT=3001
```

## Multiplayer Setup

To let your friend play:

**Option A — Same network (LAN):**
1. Find your Mac's local IP: `ipconfig getifaddr en0`
2. Start the server and client
3. Your friend opens `http://YOUR_IP:5173` in their browser

**Option B — Internet access (ngrok):**
1. Install ngrok: `brew install ngrok`
2. Run: `ngrok http 3001`
3. Update `client/vite.config.ts` proxy target to the ngrok URL
4. Share the ngrok URL with your friend

## Project Structure

```
grandline/
├── server/           # Node.js/Express backend
│   ├── routes/       # API routes (auth, heroes, campaign, battle, etc.)
│   ├── public/       # Static assets (game artwork goes here)
│   ├── schema.sql    # Database schema
│   ├── seed.js       # Database seeder
│   └── index.js      # Main server
└── client/           # React/Vite frontend
    └── src/
        ├── pages/    # All game screens
        ├── components/
        └── store/    # Zustand state management
```

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express + Socket.IO
- **Database:** PostgreSQL
- **Auth:** JWT tokens
- **State:** Zustand

---

*Built with ❤️ for the love of One Piece*

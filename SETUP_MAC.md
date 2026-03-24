# The Grand Line — Mac Setup Guide

This guide gets you and your friend playing in under 10 minutes.

## What You Need

- A Mac (any recent macOS)
- [Homebrew](https://brew.sh) (Mac package manager)
- The `grandline-assets.zip` file (provided separately)

---

## Step 1 — Install Prerequisites

Open **Terminal** (press `Cmd+Space`, type "Terminal") and run:

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and PostgreSQL
brew install node postgresql@16

# Start PostgreSQL
brew services start postgresql@16

# Add PostgreSQL to your PATH (add this to ~/.zshrc too)
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
```

---

## Step 2 — Clone the Game

```bash
# Clone the repo
git clone https://github.com/AmirDmore/Grandline.git
cd Grandline
```

---

## Step 3 — Add the Game Assets

```bash
# Copy the assets zip into the project
cp ~/Downloads/grandline-assets.zip server/public/

# Extract it
cd server/public
unzip grandline-assets.zip
cd ../..
```

You should now have a folder at `server/public/assets/` with all the game artwork.

---

## Step 4 — Set Up the Database

```bash
# Create the database
createdb grandline

# Create the tables
psql -d grandline -f server/schema.sql
```

---

## Step 5 — Configure the Server

```bash
cd server

# Copy the example env file
cp .env.example .env

# Edit it (open in TextEdit or any editor)
open -e .env
```

Change the `.env` file to:
```
DATABASE_URL=postgresql://YOUR_MAC_USERNAME@localhost:5432/grandline
JWT_SECRET=grandline-secret-key-2024
PORT=3001
NODE_ENV=development
```

> **Tip:** Your Mac username is what appears before `$` in Terminal (e.g., `john`). Use `whoami` to check.

---

## Step 6 — Install Dependencies and Seed Data

```bash
# Install server dependencies
cd server
npm install

# Seed the database with all heroes, islands, ships, etc.
node seed.js

# Install client dependencies
cd ../client
npm install
```

---

## Step 7 — Start the Game

Open **two Terminal windows**:

**Terminal 1 — Start the backend server:**
```bash
cd ~/Grandline/server
node index.js
```
You should see: `🏴‍☠️ Grand Line server running on port 3001`

**Terminal 2 — Start the frontend:**
```bash
cd ~/Grandline/client
npm run dev
```
You should see: `VITE ready in ... ms → Local: http://localhost:5173`

---

## Step 8 — Play!

Open your browser and go to: **http://localhost:5173**

1. Click **"Join the crew"** to create your account
2. Choose your pirate class
3. Begin your adventure!

---

## Letting Your Friend Play

### Option A — Same WiFi Network (easiest)

1. Find your Mac's local IP address:
   ```bash
   ipconfig getifaddr en0
   ```
   You'll get something like `192.168.1.42`

2. Your friend opens: `http://192.168.1.42:5173` in their browser
3. They create their own account and play!

### Option B — Internet (anywhere in the world)

1. Install ngrok:
   ```bash
   brew install ngrok
   ```

2. Start the tunnel (in a new Terminal):
   ```bash
   ngrok http 3001
   ```
   You'll get a URL like `https://abc123.ngrok.io`

3. Edit `client/vite.config.ts` and change the proxy target:
   ```ts
   '/api': { target: 'https://abc123.ngrok.io', changeOrigin: true },
   '/assets': { target: 'https://abc123.ngrok.io', changeOrigin: true },
   ```

4. Restart the client (`npm run dev`)

5. Share the Vite URL with your friend (shown in Terminal)

---

## Troubleshooting

**"Database connection failed"**
- Make sure PostgreSQL is running: `brew services start postgresql@16`
- Check your username in `.env` matches your Mac username

**"Port 3001 already in use"**
- Kill the old process: `lsof -ti:3001 | xargs kill`

**"Assets not loading / broken images"**
- Make sure `server/public/assets/` folder exists with content
- Check the zip was extracted correctly: `ls server/public/assets/bitmaps/`

**"npm: command not found"**
- Node.js not installed: `brew install node`

---

## Quick Start Script

Save this as `start-game.sh` in the Grandline folder and run it with `bash start-game.sh`:

```bash
#!/bin/bash
echo "🏴‍☠️ Starting The Grand Line..."

# Start PostgreSQL
brew services start postgresql@16 2>/dev/null

# Start backend
cd server && node index.js &
SERVER_PID=$!
echo "✅ Server started (PID: $SERVER_PID)"

# Wait for server to be ready
sleep 2

# Start frontend
cd ../client && npm run dev &
echo "✅ Client started"

echo ""
echo "🎮 Open your browser: http://localhost:5173"
echo "Press Ctrl+C to stop"
wait
```

---

*Enjoy your childhood dream! 🏴‍☠️*

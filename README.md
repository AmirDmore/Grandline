# The Grand Line — Production Pack v1

This package is the first serious milestone for **The Grand Line**: an English, browser-first, 2D idle/MMORPG inspired by pirate-anime private server progression but rebuilt as its own structured project.

It is **not the finished game**. It is the **foundation** for making the game real:
- monorepo layout
- browser client scaffold
- API server scaffold
- shared game types
- seeded game data
- database schema
- milestone docs
- balance/economy/live-ops planning

## Structure

- `apps/client` — browser game client scaffold
- `apps/server` — API/game service scaffold
- `packages/shared` — shared types and balance constants
- `database` — schema and seeds
- `docs` — production and design documents

## Intended stack

- Client: TypeScript + Phaser
- Server: Node.js + Fastify or Express-style API
- Database: PostgreSQL
- Cache/leaderboards: Redis
- Realtime: Colyseus (later milestone)

## Milestones

1. Production Pack and scaffold
2. First playable slice
3. Core progression systems
4. PvP + guilds + raids
5. Live-ops and late-game expansion

## Important

This package is meant to be pushed into your own repo and expanded milestone by milestone.

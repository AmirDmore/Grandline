-- Grand Line MMORPG Database Schema

-- Users table (authentication)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Player profiles
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  class VARCHAR(30) NOT NULL DEFAULT 'Fighter',
  level INTEGER DEFAULT 1,
  exp BIGINT DEFAULT 0,
  exp_to_next BIGINT DEFAULT 1000,
  gold BIGINT DEFAULT 5000,
  gems INTEGER DEFAULT 100,
  tickets INTEGER DEFAULT 10,
  vitality INTEGER DEFAULT 100,
  max_vitality INTEGER DEFAULT 100,
  vitality_regen_at TIMESTAMP DEFAULT NOW(),
  power INTEGER DEFAULT 0,
  str INTEGER DEFAULT 10,
  agi INTEGER DEFAULT 10,
  intel INTEGER DEFAULT 10,
  total_battles INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Hero templates (all One Piece characters)
CREATE TABLE IF NOT EXISTS hero_templates (
  id SERIAL PRIMARY KEY,
  hero_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(150),
  faction VARCHAR(50),
  rarity VARCHAR(20) NOT NULL DEFAULT 'common',
  class VARCHAR(30) NOT NULL,
  arc VARCHAR(50),
  portrait_big VARCHAR(200),
  portrait_small VARCHAR(200),
  base_hp INTEGER DEFAULT 1000,
  base_patk INTEGER DEFAULT 100,
  base_catk INTEGER DEFAULT 80,
  base_matk INTEGER DEFAULT 60,
  base_pdef INTEGER DEFAULT 80,
  base_cdef INTEGER DEFAULT 60,
  base_mdef INTEGER DEFAULT 70,
  base_speed INTEGER DEFAULT 100,
  skill_name VARCHAR(100),
  skill_desc TEXT,
  skill_icon VARCHAR(200),
  rage_name VARCHAR(100),
  rage_desc TEXT,
  lore TEXT,
  summon_pool VARCHAR(30) DEFAULT 'standard'
);

-- Player's collected heroes (crew)
CREATE TABLE IF NOT EXISTS player_heroes (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  hero_template_id INTEGER REFERENCES hero_templates(id),
  level INTEGER DEFAULT 1,
  star_level INTEGER DEFAULT 1,
  shards INTEGER DEFAULT 0,
  is_in_formation BOOLEAN DEFAULT FALSE,
  formation_slot INTEGER,
  exp INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Islands (campaign locations)
CREATE TABLE IF NOT EXISTS islands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  arc VARCHAR(50) NOT NULL,
  arc_order INTEGER NOT NULL,
  island_order INTEGER NOT NULL,
  description TEXT,
  boss_name VARCHAR(100),
  boss_hero_id VARCHAR(20),
  required_power INTEGER DEFAULT 0,
  background_img VARCHAR(200),
  icon_img VARCHAR(200),
  unlock_condition TEXT
);

-- Stages within islands
CREATE TABLE IF NOT EXISTS stages (
  id SERIAL PRIMARY KEY,
  island_id INTEGER REFERENCES islands(id),
  stage_number INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  enemy_data JSONB NOT NULL DEFAULT '[]',
  rewards JSONB NOT NULL DEFAULT '{}',
  stamina_cost INTEGER DEFAULT 6,
  required_power INTEGER DEFAULT 0,
  background_img VARCHAR(200)
);

-- Player campaign progress
CREATE TABLE IF NOT EXISTS player_progress (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  island_id INTEGER REFERENCES islands(id),
  stage_id INTEGER REFERENCES stages(id),
  completed BOOLEAN DEFAULT FALSE,
  stars INTEGER DEFAULT 0,
  best_time INTEGER,
  completed_at TIMESTAMP,
  UNIQUE(player_id, stage_id)
);

-- Ships
CREATE TABLE IF NOT EXISTS ship_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(200),
  arc VARCHAR(50),
  base_hp INTEGER DEFAULT 5000,
  base_speed INTEGER DEFAULT 100,
  base_cannon INTEGER DEFAULT 50,
  unlock_condition TEXT
);

CREATE TABLE IF NOT EXISTS player_ships (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  ship_template_id INTEGER REFERENCES ship_templates(id),
  is_active BOOLEAN DEFAULT FALSE,
  level INTEGER DEFAULT 1,
  sail_level INTEGER DEFAULT 1,
  cannon_level INTEGER DEFAULT 1,
  hull_level INTEGER DEFAULT 1,
  obtained_at TIMESTAMP DEFAULT NOW()
);

-- Gacha/Summon banners
CREATE TABLE IF NOT EXISTS summon_banners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  banner_type VARCHAR(30) DEFAULT 'standard',
  cost_tickets INTEGER DEFAULT 1,
  cost_gems INTEGER DEFAULT 0,
  pity_count INTEGER DEFAULT 50,
  featured_heroes JSONB DEFAULT '[]',
  rates JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  ends_at TIMESTAMP
);

-- Player summon pity tracking
CREATE TABLE IF NOT EXISTS player_pity (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  banner_id INTEGER REFERENCES summon_banners(id),
  pull_count INTEGER DEFAULT 0,
  last_legendary INTEGER DEFAULT 0,
  UNIQUE(player_id, banner_id)
);

-- Daily/weekly tasks
CREATE TABLE IF NOT EXISTS task_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  task_type VARCHAR(30) NOT NULL,
  target_count INTEGER DEFAULT 1,
  reward_gold INTEGER DEFAULT 0,
  reward_gems INTEGER DEFAULT 0,
  reward_tickets INTEGER DEFAULT 0,
  reward_exp INTEGER DEFAULT 0,
  reset_type VARCHAR(20) DEFAULT 'daily',
  icon VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS player_tasks (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  task_template_id INTEGER REFERENCES task_templates(id),
  current_count INTEGER DEFAULT 0,
  claimed BOOLEAN DEFAULT FALSE,
  reset_at TIMESTAMP DEFAULT NOW() + INTERVAL '1 day',
  UNIQUE(player_id, task_template_id)
);

-- Mail system
CREATE TABLE IF NOT EXISTS player_mail (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  sender VARCHAR(100) DEFAULT 'System',
  subject VARCHAR(200) NOT NULL,
  body TEXT,
  attachments JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Battle records
CREATE TABLE IF NOT EXISTS battle_records (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  battle_type VARCHAR(30) NOT NULL,
  stage_id INTEGER,
  opponent_id INTEGER REFERENCES players(id),
  result VARCHAR(10) NOT NULL,
  turns INTEGER,
  rewards JSONB DEFAULT '{}',
  battle_log JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Friends/social
CREATE TABLE IF NOT EXISTS friendships (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  friend_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, friend_id)
);

-- Leaderboard cache
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE UNIQUE,
  player_name VARCHAR(50),
  player_class VARCHAR(30),
  level INTEGER,
  power INTEGER,
  wins INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inventory items
CREATE TABLE IF NOT EXISTS player_inventory (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL,
  item_id VARCHAR(50) NOT NULL,
  quantity INTEGER DEFAULT 1,
  data JSONB DEFAULT '{}'
);

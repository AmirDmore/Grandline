const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  database: 'grandline',
  user: 'grandline_user',
  password: 'grandline123',
  port: 5432
})

async function seed() {
  const client = await pool.connect()
  try {
    console.log('🌊 Seeding The Grand Line database...')

    // ===================== HERO TEMPLATES =====================
    const heroes = [
      // ---- STRAW HAT PIRATES ----
      { hero_id: '10001', name: 'Usopp', title: 'King of Snipers', faction: 'Straw Hat Pirates', rarity: 'rare', class: 'Archer', arc: 'East Blue',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10001.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10001.png',
        base_hp: 2800, base_patk: 320, base_catk: 180, base_matk: 120, base_pdef: 200, base_cdef: 280, base_mdef: 180, base_speed: 115,
        skill_name: 'Impact Wolf', skill_desc: 'Fires a compressed air bullet that deals 280% ATK damage to one enemy and reduces their DEF by 20% for 2 turns.',
        rage_name: 'Kabuto: Five-Ton Hammer', rage_desc: 'Unleashes a devastating slingshot barrage hitting all enemies for 350% ATK damage. Has a 40% chance to stun each target.',
        lore: 'The brave warrior of the sea from Syrup Village. Though he claims to be a great warrior, his courage always shines when it matters most.',
        summon_pool: 'standard' },

      { hero_id: '10002', name: 'Nami', title: 'Cat Burglar', faction: 'Straw Hat Pirates', rarity: 'rare', class: 'Magician', arc: 'East Blue',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10002.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10002.png',
        base_hp: 2600, base_patk: 200, base_catk: 160, base_matk: 420, base_pdef: 160, base_cdef: 200, base_mdef: 320, base_speed: 120,
        skill_name: 'Thunderbolt Tempo', skill_desc: 'Summons a lightning strike on one enemy dealing 300% MATK damage and paralyzing them for 1 turn.',
        rage_name: 'Clima-Tact: Perfect Cyclone', rage_desc: 'Creates a massive storm hitting all enemies for 380% MATK damage and reducing their speed by 30% for 3 turns.',
        lore: 'The Straw Hats\' navigator with the ability to read weather. She dreams of drawing a complete map of the world.',
        summon_pool: 'standard' },

      { hero_id: '10003', name: 'Tony Tony Chopper', title: 'Cotton Candy Lover', faction: 'Straw Hat Pirates', rarity: 'rare', class: 'Summoner', arc: 'Grand Line',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10003.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10003.png',
        base_hp: 3200, base_patk: 280, base_catk: 200, base_matk: 360, base_pdef: 280, base_cdef: 240, base_mdef: 260, base_speed: 105,
        skill_name: 'Rumble Ball: Arm Point', skill_desc: 'Transforms arm into a powerful weapon, dealing 260% ATK damage and healing self for 15% max HP.',
        rage_name: 'Monster Point', rage_desc: 'Transforms into a giant monster form, dealing 450% ATK damage to all enemies and gaining a 20% damage reduction shield for 2 turns.',
        lore: 'The Straw Hats\' doctor who ate the Human-Human Fruit. He dreams of curing all diseases in the world.',
        summon_pool: 'standard' },

      { hero_id: '10004', name: 'Sanji', title: 'Black Leg', faction: 'Straw Hat Pirates', rarity: 'epic', class: 'Fighter', arc: 'East Blue',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10004.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10004.png',
        base_hp: 4200, base_patk: 520, base_catk: 380, base_matk: 200, base_pdef: 360, base_cdef: 300, base_mdef: 240, base_speed: 130,
        skill_name: 'Diable Jambe: Flambage Shot', skill_desc: 'Ignites his leg and delivers a blazing kick dealing 320% ATK damage. Burns the target for 80 damage per turn for 3 turns.',
        rage_name: 'Ifrit Jambe', rage_desc: 'Combines Haki and fire in a devastating kick dealing 500% ATK damage to one enemy. Ignores 30% of target\'s defense.',
        lore: 'The Straw Hats\' cook who only fights with his legs. He is the third son of the Vinsmoke Family and a member of the Germa 66.',
        summon_pool: 'standard' },

      { hero_id: '10005', name: 'Nico Robin', title: 'Devil Child', faction: 'Straw Hat Pirates', rarity: 'epic', class: 'Magician', arc: 'Grand Line',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10005.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10005.png',
        base_hp: 3600, base_patk: 300, base_catk: 260, base_matk: 480, base_pdef: 280, base_cdef: 320, base_mdef: 360, base_speed: 110,
        skill_name: 'Cien Fleur: Clutch', skill_desc: 'Sprouts a hundred arms to grab and crush one enemy, dealing 300% MATK damage and reducing their ATK by 25% for 2 turns.',
        rage_name: 'Mil Fleur: Gigantesco Mano', rage_desc: 'Creates giant hands that crush all enemies for 420% MATK damage. Enemies hit have a 35% chance to be immobilized for 1 turn.',
        lore: 'The Straw Hats\' archaeologist who ate the Flower-Flower Fruit. She is the only person alive who can read the Poneglyphs.',
        summon_pool: 'standard' },

      { hero_id: '10006', name: 'Roronoa Zoro', title: 'Pirate Hunter', faction: 'Straw Hat Pirates', rarity: 'epic', class: 'Swordsman', arc: 'East Blue',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10006.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10006.png',
        base_hp: 5000, base_patk: 580, base_catk: 420, base_matk: 150, base_pdef: 480, base_cdef: 380, base_mdef: 280, base_speed: 108,
        skill_name: 'Three Sword Style: Tiger Hunt', skill_desc: 'Slashes with all three swords dealing 340% ATK damage to one enemy. Has a 25% chance to cause bleeding (50 dmg/turn for 3 turns).',
        rage_name: 'Asura: Nine Sword Style', rage_desc: 'Manifests nine phantom swords in a devastating combo dealing 550% ATK damage to one enemy. Ignores all shields and barriers.',
        lore: 'The Straw Hats\' swordsman who aims to be the world\'s greatest swordsman. He wields three swords using his unique Santoryu style.',
        summon_pool: 'standard' },

      { hero_id: '10007', name: 'Monkey D. Luffy', title: 'Straw Hat', faction: 'Straw Hat Pirates', rarity: 'legendary', class: 'Fighter', arc: 'East Blue',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10007.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10007.png',
        base_hp: 6500, base_patk: 680, base_catk: 500, base_matk: 300, base_pdef: 520, base_cdef: 440, base_mdef: 360, base_speed: 118,
        skill_name: 'Gum-Gum Gatling', skill_desc: 'Stretches both arms and delivers a rapid barrage of punches dealing 380% ATK damage to one enemy. Hits 6 times.',
        rage_name: 'Gear 5 — Sun God Nika', rage_desc: 'Awakens the true power of the Gum-Gum Fruit. Deals 650% ATK damage to all enemies and grants the team +30% ATK for 3 turns. Cannot be blocked.',
        lore: 'The captain of the Straw Hat Pirates who ate the Gum-Gum Fruit. His dream is to find the One Piece and become King of the Pirates.',
        summon_pool: 'featured' },

      { hero_id: '10008', name: 'Franky', title: 'Cyborg', faction: 'Straw Hat Pirates', rarity: 'epic', class: 'Fighter', arc: 'Water 7',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10008.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10008.png',
        base_hp: 5500, base_patk: 540, base_catk: 300, base_matk: 380, base_pdef: 500, base_cdef: 360, base_mdef: 300, base_speed: 95,
        skill_name: 'Franky Radical Beam', skill_desc: 'Fires a laser beam from his chest dealing 310% ATK damage to one enemy and reducing their DEF by 30% for 2 turns.',
        rage_name: 'General Franky: Cannon Barrage', rage_desc: 'Transforms into General Franky and unleashes a full cannon barrage dealing 480% ATK damage to all enemies.',
        lore: 'The Straw Hats\' shipwright who rebuilt himself into a cyborg. He built the Thousand Sunny, the crew\'s second ship.',
        summon_pool: 'standard' },

      { hero_id: '10009', name: 'Brook', title: 'Soul King', faction: 'Straw Hat Pirates', rarity: 'epic', class: 'Swordsman', arc: 'Grand Line',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10009.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10009.png',
        base_hp: 3800, base_patk: 460, base_catk: 340, base_matk: 400, base_pdef: 300, base_cdef: 360, base_mdef: 420, base_speed: 125,
        skill_name: 'Aubade Coup Droit', skill_desc: 'Draws his sword at lightning speed dealing 290% ATK damage. Attack is so fast it hits twice.',
        rage_name: 'Soul Solid: Blizzard Slash', rage_desc: 'Channels the cold of the underworld into his blade, dealing 460% ATK damage to all enemies and freezing them for 1 turn.',
        lore: 'The Straw Hats\' musician who ate the Revive-Revive Fruit. He is a living skeleton who was separated from his crew for 50 years.',
        summon_pool: 'standard' },

      { hero_id: '10010', name: 'Jinbe', title: 'Knight of the Sea', faction: 'Straw Hat Pirates', rarity: 'legendary', class: 'Fighter', arc: 'Fish-Man Island',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10010.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10010.png',
        base_hp: 7000, base_patk: 620, base_catk: 480, base_matk: 280, base_pdef: 600, base_cdef: 520, base_mdef: 400, base_speed: 100,
        skill_name: 'Fish-Man Karate: Shark Brick Fist', skill_desc: 'Delivers a powerful water-infused punch dealing 360% ATK damage. Reduces target\'s ATK by 20% for 2 turns.',
        rage_name: 'Fish-Man Judo: Vagabond Drill', rage_desc: 'Spins the target and slams them into all other enemies, dealing 520% ATK damage split among all enemies.',
        lore: 'The helmsman of the Straw Hat Pirates and former Warlord of the Sea. He is a master of Fish-Man Karate and Judo.',
        summon_pool: 'featured' },

      // ---- YONKO & LEGENDS ----
      { hero_id: '10011', name: 'Shanks', title: 'Red-Haired', faction: 'Red Hair Pirates', rarity: 'mythic', class: 'Swordsman', arc: 'East Blue',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_Shanks.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/shanks_small.png',
        base_hp: 9500, base_patk: 900, base_catk: 750, base_matk: 500, base_pdef: 800, base_cdef: 700, base_mdef: 650, base_speed: 140,
        skill_name: 'Divine Departure', skill_desc: 'Strikes with a Haki-infused slash dealing 450% ATK damage. Breaks through all shields and barriers. Reduces target\'s Haki resistance by 40%.',
        rage_name: 'Conqueror\'s Haki: World Shaking', rage_desc: 'Releases an overwhelming burst of Conqueror\'s Haki that deals 700% ATK damage to all enemies and stuns them for 2 turns. Cannot be resisted.',
        lore: 'One of the Four Emperors of the Sea and captain of the Red Hair Pirates. He inspired Luffy to become a pirate and gave him his iconic straw hat.',
        summon_pool: 'legend' },

      { hero_id: '10012', name: 'Kaido', title: 'Strongest Creature', faction: 'Beasts Pirates', rarity: 'mythic', class: 'Fighter', arc: 'Wano',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_kaido.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_kaido.png',
        base_hp: 12000, base_patk: 980, base_catk: 800, base_matk: 600, base_pdef: 950, base_cdef: 800, base_mdef: 750, base_speed: 95,
        skill_name: 'Thunder Bagua', skill_desc: 'Swings his kanabo club with devastating force dealing 500% ATK damage to one enemy. Has a 50% chance to instantly KO enemies below 20% HP.',
        rage_name: 'Tatsumaki: Dragon Twister', rage_desc: 'Transforms into his dragon form and breathes a massive fire tornado dealing 800% ATK damage to all enemies. Reduces all enemy DEF by 35% for 3 turns.',
        lore: 'The Governor-General of the Beasts Pirates and one of the Four Emperors. Known as the "Strongest Creature in the World," he is nearly impossible to kill.',
        summon_pool: 'legend' },

      { hero_id: '10013', name: 'Big Mom', title: 'Charlotte Linlin', faction: 'Big Mom Pirates', rarity: 'mythic', class: 'Magician', arc: 'Whole Cake Island',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10013.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10013.png',
        base_hp: 11000, base_patk: 850, base_catk: 700, base_matk: 900, base_pdef: 800, base_cdef: 750, base_mdef: 850, base_speed: 88,
        skill_name: 'Prometheus: Heavenly Fire', skill_desc: 'Commands her sun homie to rain fire on all enemies dealing 420% MATK damage. Burns all targets for 100 damage per turn for 3 turns.',
        rage_name: 'Soul Pocus: Life or Treat', rage_desc: 'Steals the lifespan of all enemies, dealing 650% MATK damage and healing Big Mom for 30% of damage dealt.',
        lore: 'One of the Four Emperors and captain of the Big Mom Pirates. She rules Totto Land and has the power of the Soul-Soul Fruit.',
        summon_pool: 'legend' },

      { hero_id: '10014', name: 'Blackbeard', title: 'Marshall D. Teach', faction: 'Blackbeard Pirates', rarity: 'mythic', class: 'Fighter', arc: 'Marineford',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10014.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10014.png',
        base_hp: 10000, base_patk: 920, base_catk: 780, base_matk: 700, base_pdef: 850, base_cdef: 720, base_mdef: 680, base_speed: 92,
        skill_name: 'Black Vortex', skill_desc: 'Creates a gravitational vortex that pulls all enemies together dealing 480% ATK damage and nullifying their Devil Fruit powers for 2 turns.',
        rage_name: 'Gura Gura no Mi: World Shaker', rage_desc: 'Combines the Dark-Dark and Tremor-Tremor Fruits to unleash a cataclysmic attack dealing 750% ATK damage to all enemies. Ignores all resistances.',
        lore: 'The captain of the Blackbeard Pirates and one of the Four Emperors. The only person known to have two Devil Fruit powers.',
        summon_pool: 'legend' },

      { hero_id: '10015', name: 'Whitebeard', title: 'Strongest Man in the World', faction: 'Whitebeard Pirates', rarity: 'mythic', class: 'Fighter', arc: 'Marineford',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10015.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10015.png',
        base_hp: 13000, base_patk: 950, base_catk: 820, base_matk: 550, base_pdef: 900, base_cdef: 780, base_mdef: 700, base_speed: 85,
        skill_name: 'Gura Gura: Earthquake Fist', skill_desc: 'Punches the air to create a massive shockwave dealing 520% ATK damage to all enemies and knocking them back.',
        rage_name: 'Gura Gura: World Collapse', rage_desc: 'Splits the very fabric of the world, dealing 820% ATK damage to all enemies. This attack cannot be dodged or blocked.',
        lore: 'The former captain of the Whitebeard Pirates and the "Strongest Man in the World." He was the only pirate Gol D. Roger acknowledged as an equal.',
        summon_pool: 'legend' },

      { hero_id: '10016', name: 'Gol D. Roger', title: 'King of the Pirates', faction: 'Roger Pirates', rarity: 'mythic', class: 'Swordsman', arc: 'Lodestar',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10016.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10016.png',
        base_hp: 14000, base_patk: 1000, base_catk: 900, base_matk: 700, base_pdef: 950, base_cdef: 850, base_mdef: 800, base_speed: 145,
        skill_name: 'Conqueror\'s Slash', skill_desc: 'Channels the full power of Conqueror\'s Haki into his blade dealing 600% ATK damage. Instantly defeats enemies below 15% HP.',
        rage_name: 'Will of the King', rage_desc: 'Unleashes the absolute pinnacle of Conqueror\'s Haki, dealing 900% ATK damage to all enemies. Grants the entire team immunity to debuffs for 2 turns.',
        lore: 'The legendary Pirate King who conquered the Grand Line and found the One Piece. His execution sparked the Great Pirate Era.',
        summon_pool: 'legend' },

      // ---- MARINES / ADMIRALS ----
      { hero_id: '10017', name: 'Akainu', title: 'Fleet Admiral', faction: 'Marines', rarity: 'legendary', class: 'Magician', arc: 'Marineford',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10017.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/akainus2_small.png',
        base_hp: 8500, base_patk: 750, base_catk: 600, base_matk: 850, base_pdef: 700, base_cdef: 650, base_mdef: 750, base_speed: 105,
        skill_name: 'Meteor Volcano', skill_desc: 'Rains magma fists from the sky dealing 400% MATK damage to all enemies. Burns all targets for 120 damage per turn for 3 turns.',
        rage_name: 'Absolute Justice: Magma Fist', rage_desc: 'Punches through the target with a magma fist dealing 620% MATK damage. Ignores all DEF and cannot be healed from.',
        lore: 'The Fleet Admiral of the Marines and the most powerful Marine. He follows the doctrine of Absolute Justice without mercy.',
        summon_pool: 'featured' },

      { hero_id: '10018', name: 'Aokiji', title: 'Lazy Justice', faction: 'Marines', rarity: 'legendary', class: 'Magician', arc: 'Marineford',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10018.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/aokijis2_small.png',
        base_hp: 7800, base_patk: 680, base_catk: 580, base_matk: 820, base_pdef: 650, base_cdef: 600, base_mdef: 700, base_speed: 112,
        skill_name: 'Ice Age', skill_desc: 'Freezes a large area dealing 380% MATK damage to all enemies and freezing them for 2 turns.',
        rage_name: 'Pheasant Beak', rage_desc: 'Launches a massive ice bird that deals 580% MATK damage to one enemy and reduces their speed to 0 for 2 turns.',
        lore: 'A former Admiral of the Marines who ate the Ice-Ice Fruit. He follows the doctrine of Lazy Justice and now works independently.',
        summon_pool: 'featured' },

      { hero_id: '10019', name: 'Kizaru', title: 'Borsalino', faction: 'Marines', rarity: 'legendary', class: 'Magician', arc: 'Sabaody',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10019.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10019.png',
        base_hp: 7500, base_patk: 700, base_catk: 620, base_matk: 880, base_pdef: 600, base_cdef: 580, base_mdef: 720, base_speed: 160,
        skill_name: 'Yasakani no Magatama', skill_desc: 'Fires a barrage of light beams dealing 420% MATK damage to all enemies. Attacks at the speed of light — always goes first.',
        rage_name: 'Ama no Murakumo', rage_desc: 'Concentrates all light into a single devastating laser dealing 640% MATK damage to one enemy. Pierces all defenses.',
        lore: 'An Admiral of the Marines who ate the Glint-Glint Fruit. He can transform into and move at the speed of light.',
        summon_pool: 'featured' },

      // ---- WARLORDS ----
      { hero_id: '10020', name: 'Dracule Mihawk', title: 'Greatest Swordsman', faction: 'Cross Guild', rarity: 'legendary', class: 'Swordsman', arc: 'East Blue',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10020.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/mihawk_small.png',
        base_hp: 8000, base_patk: 860, base_catk: 720, base_matk: 300, base_pdef: 720, base_cdef: 680, base_mdef: 500, base_speed: 135,
        skill_name: 'Kogatana Slash', skill_desc: 'Slashes with his small knife dealing 400% ATK damage. Despite using a tiny blade, the cut is deeper than any sword.',
        rage_name: 'Yoru: Black Blade Cross', rage_desc: 'Swings Yoru to send a black cross-shaped slash dealing 660% ATK damage to all enemies. Reduces all enemy HP to 1 if they are below 10% HP.',
        lore: 'The greatest swordsman in the world and wielder of the black blade Yoru. He is Zoro\'s ultimate goal and rival.',
        summon_pool: 'featured' },

      { hero_id: '10021', name: 'Boa Hancock', title: 'Pirate Empress', faction: 'Kuja Pirates', rarity: 'legendary', class: 'Magician', arc: 'Amazon Lily',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10021.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10021.png',
        base_hp: 7200, base_patk: 640, base_catk: 560, base_matk: 800, base_pdef: 580, base_cdef: 620, base_mdef: 680, base_speed: 128,
        skill_name: 'Slave Arrow', skill_desc: 'Fires arrows imbued with the Love-Love Fruit dealing 360% MATK damage and petrifying male enemies for 2 turns.',
        rage_name: 'Perfume Femur: Pistol Kiss', rage_desc: 'Delivers a devastating kick that turns the target to stone dealing 580% MATK damage. Petrified enemies take 50% more damage.',
        lore: 'The Pirate Empress and captain of the Kuja Pirates. She ate the Love-Love Fruit and can turn anyone who feels lust into stone.',
        summon_pool: 'featured' },

      { hero_id: '10022', name: 'Trafalgar Law', title: 'Surgeon of Death', faction: 'Heart Pirates', rarity: 'legendary', class: 'Swordsman', arc: 'Punk Hazard',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10022.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10022.png',
        base_hp: 7600, base_patk: 780, base_catk: 660, base_matk: 720, base_pdef: 640, base_cdef: 620, base_mdef: 660, base_speed: 122,
        skill_name: 'Room: Shambles', skill_desc: 'Creates a Room and swaps the positions of enemies, dealing 340% ATK damage and confusing all enemies in the Room.',
        rage_name: 'Gamma Knife', rage_desc: 'Stabs the target with gamma energy that destroys internal organs dealing 600% ATK damage. This damage cannot be healed.',
        lore: 'The captain of the Heart Pirates and a former Warlord of the Sea. He ate the Op-Op Fruit, making him the "Surgeon of Death."',
        summon_pool: 'featured' },

      { hero_id: '10023', name: 'Donquixote Doflamingo', title: 'Heavenly Yaksha', faction: 'Donquixote Pirates', rarity: 'legendary', class: 'Magician', arc: 'Dressrosa',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10023.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10023.png',
        base_hp: 8200, base_patk: 720, base_catk: 640, base_matk: 840, base_pdef: 680, base_cdef: 640, base_mdef: 720, base_speed: 118,
        skill_name: 'Parasite: Marionette', skill_desc: 'Takes control of one enemy for 2 turns, forcing them to attack their own allies for 300% ATK damage.',
        rage_name: 'God Thread: Birdcage', rage_desc: 'Creates a massive birdcage of strings that deals 580% MATK damage to all enemies and reduces their movement for 2 turns.',
        lore: 'The former king of Dressrosa and a former Warlord of the Sea. He ate the String-String Fruit and was a former World Noble.',
        summon_pool: 'featured' },

      // ---- SUPERNOVAS ----
      { hero_id: '10024', name: 'Portgas D. Ace', title: 'Fire Fist', faction: 'Whitebeard Pirates', rarity: 'legendary', class: 'Magician', arc: 'Marineford',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10024.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10024.png',
        base_hp: 7800, base_patk: 700, base_catk: 580, base_matk: 860, base_pdef: 620, base_cdef: 580, base_mdef: 680, base_speed: 125,
        skill_name: 'Fire Fist', skill_desc: 'Launches a massive fist of fire dealing 380% MATK damage to one enemy. Burns the target for 100 damage per turn for 3 turns.',
        rage_name: 'Flame Emperor: Entei', rage_desc: 'Creates a giant pillar of fire that engulfs all enemies dealing 620% MATK damage. All enemies are burned for 150 damage per turn for 3 turns.',
        lore: 'The second division commander of the Whitebeard Pirates and Luffy\'s older brother. He ate the Flame-Flame Fruit and was the son of Gol D. Roger.',
        summon_pool: 'featured' },

      { hero_id: '10025', name: 'Sabo', title: 'Chief of Staff', faction: 'Revolutionary Army', rarity: 'legendary', class: 'Fighter', arc: 'Dressrosa',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10025.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10025.png',
        base_hp: 8000, base_patk: 760, base_catk: 640, base_matk: 720, base_pdef: 680, base_cdef: 620, base_mdef: 640, base_speed: 130,
        skill_name: 'Dragon Claw: Hiken', skill_desc: 'Combines his Dragon Claw technique with the Flame-Flame Fruit dealing 400% ATK damage to one enemy.',
        rage_name: 'Ryu no Ibuki: Dragon\'s Breath', rage_desc: 'Unleashes a devastating fire dragon attack dealing 640% ATK damage to all enemies. Grants the team +20% ATK for 3 turns.',
        lore: 'The Chief of Staff of the Revolutionary Army and Luffy\'s sworn brother. He inherited Ace\'s Flame-Flame Fruit after the Marineford War.',
        summon_pool: 'featured' },

      { hero_id: '10026', name: 'Eustass Kid', title: 'Captain Kid', faction: 'Kid Pirates', rarity: 'epic', class: 'Fighter', arc: 'Sabaody',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10026.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10026.png',
        base_hp: 6500, base_patk: 720, base_catk: 560, base_matk: 400, base_pdef: 620, base_cdef: 540, base_mdef: 480, base_speed: 110,
        skill_name: 'Punk Pistols', skill_desc: 'Fires magnetized metal bullets dealing 320% ATK damage to one enemy. Pulls nearby enemies into the target.',
        rage_name: 'Damned Punk', rage_desc: 'Creates two massive electromagnetic cannons and fires them simultaneously dealing 560% ATK damage to all enemies.',
        lore: 'The captain of the Kid Pirates and one of the Worst Generation. He ate the Magnet-Magnet Fruit and aims to become King of the Pirates.',
        summon_pool: 'standard' },

      { hero_id: '10027', name: 'Killer', title: 'Massacre Soldier', faction: 'Kid Pirates', rarity: 'epic', class: 'Swordsman', arc: 'Sabaody',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10027.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/killer_small.png',
        base_hp: 5800, base_patk: 660, base_catk: 520, base_matk: 280, base_pdef: 560, base_cdef: 500, base_mdef: 420, base_speed: 132,
        skill_name: 'Punish Blade', skill_desc: 'Slashes with his scythe blades dealing 300% ATK damage. Hits twice and has a 30% chance to cause bleeding.',
        rage_name: 'Sonic Scythe', rage_desc: 'Spins his scythe blades at supersonic speed dealing 500% ATK damage to all enemies and reducing their speed by 25%.',
        lore: 'The combatant of the Kid Pirates and Kid\'s childhood friend. He uses rotating scythe blades attached to his wrists.',
        summon_pool: 'standard' },

      { hero_id: '10028', name: 'Yamato', title: 'Oni Princess', faction: 'Straw Hat Pirates', rarity: 'legendary', class: 'Fighter', arc: 'Wano',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10028.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10028.png',
        base_hp: 8500, base_patk: 820, base_catk: 680, base_matk: 480, base_pdef: 740, base_cdef: 660, base_mdef: 580, base_speed: 120,
        skill_name: 'Narikabura Arrow', skill_desc: 'Fires a Haki-infused arrow dealing 380% ATK damage to one enemy. Pierces through shields.',
        rage_name: 'Raimei Hakke: Thunder Bagua', rage_desc: 'Transforms into the divine dog form and delivers a thunderous strike dealing 620% ATK damage. Stuns all enemies for 1 turn.',
        lore: 'The daughter of Kaido who idolizes Kozuki Oden. She ate the Dog-Dog Fruit, Model: Okuchi no Makami.',
        summon_pool: 'featured' },

      { hero_id: '10029', name: 'Marco', title: 'Phoenix', faction: 'Whitebeard Pirates', rarity: 'legendary', class: 'Fighter', arc: 'Marineford',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10029.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/marco_small.png',
        base_hp: 8200, base_patk: 740, base_catk: 620, base_matk: 680, base_pdef: 720, base_cdef: 660, base_mdef: 640, base_speed: 138,
        skill_name: 'Blue Flames of Resurrection', skill_desc: 'Attacks with blue phoenix flames dealing 360% ATK damage and healing self for 20% max HP.',
        rage_name: 'Phoenix: Eternal Flame', rage_desc: 'Transforms into the full phoenix form and sweeps all enemies dealing 580% ATK damage. Heals the entire team for 15% max HP.',
        lore: 'The former first division commander of the Whitebeard Pirates. He ate the Bird-Bird Fruit, Model: Phoenix, giving him regenerative blue flames.',
        summon_pool: 'featured' },

      { hero_id: '10030', name: 'Rob Lucci', title: 'CP0 Agent', faction: 'CP0', rarity: 'epic', class: 'Fighter', arc: 'Water 7',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10030.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/lucci_small.png',
        base_hp: 6800, base_patk: 700, base_catk: 580, base_matk: 360, base_pdef: 640, base_cdef: 580, base_mdef: 520, base_speed: 128,
        skill_name: 'Shigan: Finger Pistol', skill_desc: 'Fires his finger like a pistol dealing 340% ATK damage. Hits a vital point reducing the target\'s ATK by 20%.',
        rage_name: 'Leopard Form: Rokuougan', rage_desc: 'Transforms into his leopard form and delivers the Six King Gun dealing 560% ATK damage. Bypasses all armor.',
        lore: 'The strongest agent of CP0 and former CP9. He ate the Cat-Cat Fruit, Model: Leopard.',
        summon_pool: 'standard' },

      { hero_id: '10031', name: 'Crocodile', title: 'Mr. 0', faction: 'Cross Guild', rarity: 'epic', class: 'Magician', arc: 'Alabasta',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10031.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10031.png',
        base_hp: 6200, base_patk: 580, base_catk: 480, base_matk: 760, base_pdef: 560, base_cdef: 520, base_mdef: 640, base_speed: 115,
        skill_name: 'Desert Spada', skill_desc: 'Slices through the ground with a sand blade dealing 320% MATK damage to all enemies in a line. Drains moisture from targets.',
        rage_name: 'Desert Girasole', rage_desc: 'Creates a massive sand vortex that swallows all enemies dealing 520% MATK damage and reducing their HP recovery by 50% for 3 turns.',
        lore: 'The former Warlord of the Sea and leader of Baroque Works. He ate the Sand-Sand Fruit and co-founded Cross Guild with Mihawk.',
        summon_pool: 'standard' },

      { hero_id: '10032', name: 'Bartholomew Kuma', title: 'Tyrant', faction: 'Revolutionary Army', rarity: 'epic', class: 'Fighter', arc: 'Sabaody',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10032.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10032.png',
        base_hp: 7000, base_patk: 680, base_catk: 560, base_matk: 500, base_pdef: 680, base_cdef: 600, base_mdef: 560, base_speed: 100,
        skill_name: 'Pad Ho: Paw Cannon', skill_desc: 'Compresses air into a paw-shaped projectile dealing 300% ATK damage. The projectile travels at the speed of light.',
        rage_name: 'Ursus Shock', rage_desc: 'Compresses the air in a massive area and releases it in a devastating explosion dealing 520% ATK damage to all enemies.',
        lore: 'A former Warlord of the Sea who was converted into a Pacifista cyborg. He secretly served as a member of the Revolutionary Army.',
        summon_pool: 'standard' },

      // ---- EAST BLUE VILLAINS ----
      { hero_id: '10033', name: 'Buggy', title: 'The Clown', faction: 'Cross Guild', rarity: 'rare', class: 'Fighter', arc: 'East Blue',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10033.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10033.png',
        base_hp: 3500, base_patk: 380, base_catk: 300, base_matk: 280, base_pdef: 320, base_cdef: 280, base_mdef: 260, base_speed: 108,
        skill_name: 'Chop-Chop Cannon', skill_desc: 'Fires his detached fist like a cannonball dealing 240% ATK damage. The fist can change direction mid-flight.',
        rage_name: 'Muggy Ball: Chop-Chop Festival', rage_desc: 'Splits his body into hundreds of pieces and attacks all enemies simultaneously dealing 400% ATK damage.',
        lore: 'The captain of the Buggy Pirates and co-founder of Cross Guild. He ate the Chop-Chop Fruit and was a former member of the Roger Pirates.',
        summon_pool: 'standard' },

      { hero_id: '10034', name: 'Arlong', title: 'Saw-Tooth', faction: 'Arlong Pirates', rarity: 'rare', class: 'Fighter', arc: 'East Blue',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10034.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/samll_10034.png',
        base_hp: 4500, base_patk: 460, base_catk: 360, base_matk: 200, base_pdef: 420, base_cdef: 340, base_mdef: 280, base_speed: 105,
        skill_name: 'Shark on Tooth', skill_desc: 'Bites down with his powerful shark teeth dealing 280% ATK damage. Reduces target\'s DEF by 15%.',
        rage_name: 'Shark on Darts', rage_desc: 'Spins like a drill and charges through all enemies dealing 440% ATK damage. Ignores physical defense.',
        lore: 'The captain of the Arlong Pirates and a Fish-Man who ruled over Nami\'s village for years. He is a master of Fish-Man Karate.',
        summon_pool: 'standard' },

      // ---- GARP & DRAGON ----
      { hero_id: '10035', name: 'Monkey D. Garp', title: 'Hero of the Marines', faction: 'Marines', rarity: 'legendary', class: 'Fighter', arc: 'Marineford',
        portrait_big: '/assets/bitmaps/heroHeads/headbig/big_10035.png', portrait_small: '/assets/bitmaps/heroHeads/headsmall/garps2_small.png',
        base_hp: 9000, base_patk: 880, base_catk: 720, base_matk: 400, base_pdef: 820, base_cdef: 720, base_mdef: 640, base_speed: 115,
        skill_name: 'Fist of Love', skill_desc: 'Delivers a devastating punch with Haki dealing 420% ATK damage. The punch is so powerful it creates a shockwave.',
        rage_name: 'Galaxy Impact', rage_desc: 'Jumps to incredible height and delivers a meteor-like punch dealing 680% ATK damage to all enemies. Creates a massive crater on impact.',
        lore: 'The legendary "Hero of the Marines" and grandfather of Luffy and father of Dragon. He is one of the strongest characters in history.',
        summon_pool: 'featured' },
    ]

    console.log(`Inserting ${heroes.length} heroes...`)
    for (const h of heroes) {
      await client.query(`
        INSERT INTO hero_templates (hero_id, name, title, faction, rarity, class, arc,
          portrait_big, portrait_small, base_hp, base_patk, base_catk, base_matk,
          base_pdef, base_cdef, base_mdef, base_speed, skill_name, skill_desc,
          rage_name, rage_desc, lore, summon_pool)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
        ON CONFLICT (hero_id) DO UPDATE SET
          name=EXCLUDED.name, title=EXCLUDED.title, skill_name=EXCLUDED.skill_name,
          skill_desc=EXCLUDED.skill_desc, rage_name=EXCLUDED.rage_name, rage_desc=EXCLUDED.rage_desc
      `, [h.hero_id, h.name, h.title, h.faction, h.rarity, h.class, h.arc,
          h.portrait_big, h.portrait_small, h.base_hp, h.base_patk, h.base_catk, h.base_matk,
          h.base_pdef, h.base_cdef, h.base_mdef, h.base_speed, h.skill_name, h.skill_desc,
          h.rage_name, h.rage_desc, h.lore, h.summon_pool])
    }

    // ===================== ISLANDS =====================
    const islands = [
      // East Blue Arc
      { name: 'Shells Town', arc: 'East Blue', arc_order: 1, island_order: 1, description: 'A Marine base town where Zoro was imprisoned. The beginning of the Straw Hat adventure.', boss_name: 'Captain Morgan', boss_hero_id: null, required_power: 0, background_img: '/assets/bitmaps/battleBackground/bg_Z001.i.txt' },
      { name: 'Orange Town', arc: 'East Blue', arc_order: 1, island_order: 2, description: 'A town terrorized by the Buggy Pirates. Home to the Chop-Chop Cannon.', boss_name: 'Buggy the Clown', boss_hero_id: '10033', required_power: 500, background_img: '/assets/bitmaps/battleBackground/bg_Z002.i.txt' },
      { name: 'Syrup Village', arc: 'East Blue', arc_order: 1, island_order: 3, description: 'Usopp\'s hometown, threatened by the Black Cat Pirates.', boss_name: 'Captain Kuro', boss_hero_id: null, required_power: 1200, background_img: '/assets/bitmaps/battleBackground/bg_Z003.i.txt' },
      { name: 'Baratie', arc: 'East Blue', arc_order: 1, island_order: 4, description: 'The floating restaurant on the sea. Where Sanji joined the crew.', boss_name: 'Don Krieg', boss_hero_id: null, required_power: 2500, background_img: '/assets/bitmaps/battleBackground/bg_Z004.i.txt' },
      { name: 'Arlong Park', arc: 'East Blue', arc_order: 1, island_order: 5, description: 'The stronghold of the Arlong Pirates. Nami\'s village was under their control.', boss_name: 'Arlong', boss_hero_id: '10034', required_power: 4000, background_img: '/assets/bitmaps/battleBackground/bg_Z005.i.txt' },
      { name: 'Loguetown', arc: 'East Blue', arc_order: 1, island_order: 6, description: 'The town where the Pirate King was born and executed. Gateway to the Grand Line.', boss_name: 'Captain Smoker', boss_hero_id: null, required_power: 6000, background_img: '/assets/bitmaps/battleBackground/bg_Z006.i.txt' },

      // Grand Line - Alabasta Arc
      { name: 'Whisky Peak', arc: 'Alabasta', arc_order: 2, island_order: 1, description: 'A town that welcomes pirates — but secretly captures them for the government.', boss_name: 'Mr. 9 & Miss Wednesday', boss_hero_id: null, required_power: 8000, background_img: '/assets/bitmaps/battleBackground/bg_Z007.i.txt' },
      { name: 'Little Garden', arc: 'Alabasta', arc_order: 2, island_order: 2, description: 'A prehistoric island where two giants have been dueling for 100 years.', boss_name: 'Mr. 3', boss_hero_id: null, required_power: 10000, background_img: '/assets/bitmaps/battleBackground/bg_Z008.i.txt' },
      { name: 'Drum Island', arc: 'Alabasta', arc_order: 2, island_order: 3, description: 'A snowy island with a castle in the sky. Where Chopper joined the crew.', boss_name: 'Wapol', boss_hero_id: null, required_power: 13000, background_img: '/assets/bitmaps/battleBackground/bg_Z009.i.txt' },
      { name: 'Alabasta', arc: 'Alabasta', arc_order: 2, island_order: 4, description: 'A desert kingdom threatened by the Baroque Works organization.', boss_name: 'Crocodile', boss_hero_id: '10031', required_power: 18000, background_img: '/assets/bitmaps/battleBackground/bg_Z010.i.txt' },

      // Skypiea Arc
      { name: 'Jaya', arc: 'Skypiea', arc_order: 3, island_order: 1, description: 'A lawless island where pirates gather. Home to the legendary Montblanc Cricket.', boss_name: 'Bellamy', boss_hero_id: null, required_power: 22000, background_img: '/assets/bitmaps/battleBackground/bg_Z011.i.txt' },
      { name: 'Skypiea', arc: 'Skypiea', arc_order: 3, island_order: 2, description: 'An island in the sky ruled by the god Enel. The Straw Hats ring the golden bell.', boss_name: 'Enel', boss_hero_id: null, required_power: 28000, background_img: '/assets/bitmaps/battleBackground/bg_Z012.i.txt' },

      // Water 7 Arc
      { name: 'Long Ring Long Land', arc: 'Water 7', arc_order: 4, island_order: 1, description: 'A strange island with elongated animals. Site of the Davy Back Fight.', boss_name: 'Foxy', boss_hero_id: null, required_power: 35000, background_img: '/assets/bitmaps/battleBackground/bg_Z013.i.txt' },
      { name: 'Water 7', arc: 'Water 7', arc_order: 4, island_order: 2, description: 'The city of water and shipbuilding. Where Robin was taken by CP9.', boss_name: 'Rob Lucci', boss_hero_id: '10030', required_power: 45000, background_img: '/assets/bitmaps/battleBackground/bg_Z014.i.txt' },
      { name: 'Enies Lobby', arc: 'Water 7', arc_order: 4, island_order: 3, description: 'The judicial island of the World Government. The Straw Hats declare war to save Robin.', boss_name: 'Spandam', boss_hero_id: null, required_power: 55000, background_img: '/assets/bitmaps/battleBackground/bg_Z015.i.txt' },

      // Thriller Bark Arc
      { name: 'Thriller Bark', arc: 'Thriller Bark', arc_order: 5, island_order: 1, description: 'A massive ghost ship island ruled by the Warlord Gecko Moria.', boss_name: 'Gecko Moria', boss_hero_id: null, required_power: 65000, background_img: '/assets/bitmaps/battleBackground/bg_Z016.i.txt' },

      // Sabaody / Marineford Arc
      { name: 'Sabaody Archipelago', arc: 'Sabaody', arc_order: 6, island_order: 1, description: 'The gateway to the New World. The Straw Hats are scattered by Kuma.', boss_name: 'Kizaru', boss_hero_id: '10019', required_power: 80000, background_img: '/assets/bitmaps/battleBackground/bg_Z017.i.txt' },
      { name: 'Amazon Lily', arc: 'Sabaody', arc_order: 6, island_order: 2, description: 'The island of women ruled by the Pirate Empress Boa Hancock.', boss_name: 'Boa Hancock', boss_hero_id: '10021', required_power: 95000, background_img: '/assets/bitmaps/battleBackground/bg_Z018.i.txt' },
      { name: 'Impel Down', arc: 'Sabaody', arc_order: 6, island_order: 3, description: 'The world\'s most inescapable prison. Luffy breaks in to save Ace.', boss_name: 'Magellan', boss_hero_id: null, required_power: 110000, background_img: '/assets/bitmaps/battleBackground/bg_Z019.i.txt' },
      { name: 'Marineford', arc: 'Sabaody', arc_order: 6, island_order: 4, description: 'The Marine headquarters. Site of the War of the Best — the greatest battle in history.', boss_name: 'Akainu', boss_hero_id: '10017', required_power: 130000, background_img: '/assets/bitmaps/battleBackground/bg_Z020.i.txt' },

      // New World
      { name: 'Fish-Man Island', arc: 'New World', arc_order: 7, island_order: 1, description: 'An underwater island 10,000 meters below sea level. Home of the Fish-Men.', boss_name: 'Hody Jones', boss_hero_id: null, required_power: 150000, background_img: '/assets/bitmaps/battleBackground/bg_Z021.i.txt' },
      { name: 'Punk Hazard', arc: 'New World', arc_order: 7, island_order: 2, description: 'A dangerous island split between fire and ice. Caeser Clown\'s laboratory.', boss_name: 'Caesar Clown', boss_hero_id: null, required_power: 180000, background_img: '/assets/bitmaps/battleBackground/bg_Z022.i.txt' },
      { name: 'Dressrosa', arc: 'New World', arc_order: 7, island_order: 3, description: 'A kingdom ruled by Doflamingo. The Straw Hats fight to liberate it.', boss_name: 'Doflamingo', boss_hero_id: '10023', required_power: 220000, background_img: '/assets/bitmaps/battleBackground/bg_Z023.i.txt' },
      { name: 'Whole Cake Island', arc: 'New World', arc_order: 7, island_order: 4, description: 'Big Mom\'s territory. Sanji\'s wedding and the Straw Hats\' desperate escape.', boss_name: 'Big Mom', boss_hero_id: '10013', required_power: 280000, background_img: '/assets/bitmaps/battleBackground/bg_Z024.i.txt' },
      { name: 'Wano Country', arc: 'New World', arc_order: 7, island_order: 5, description: 'A samurai nation isolated from the world, ruled by Kaido and Orochi.', boss_name: 'Kaido', boss_hero_id: '10012', required_power: 380000, background_img: '/assets/bitmaps/battleBackground/bg_Z025.i.txt' },
      { name: 'Egghead Island', arc: 'New World', arc_order: 7, island_order: 6, description: 'The futuristic island of Dr. Vegapunk. The world\'s most advanced technology.', boss_name: 'Seraphim', boss_hero_id: null, required_power: 500000, background_img: '/assets/bitmaps/battleBackground/bg_Z026.i.txt' },
      { name: 'Elbaf', arc: 'New World', arc_order: 7, island_order: 7, description: 'The legendary island of giants. The strongest warriors in the world live here.', boss_name: 'Prince Loki', boss_hero_id: null, required_power: 650000, background_img: '/assets/bitmaps/battleBackground/bg_Z027.i.txt' },
    ]

    console.log(`Inserting ${islands.length} islands...`)
    for (const isl of islands) {
      await client.query(`
        INSERT INTO islands (name, arc, arc_order, island_order, description, boss_name, boss_hero_id, required_power, background_img)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT DO NOTHING
      `, [isl.name, isl.arc, isl.arc_order, isl.island_order, isl.description, isl.boss_name, isl.boss_hero_id, isl.required_power, isl.background_img])
    }

    // ===================== STAGES =====================
    const islandRows = await client.query('SELECT id, name FROM islands ORDER BY arc_order, island_order')
    for (const island of islandRows.rows) {
      for (let s = 1; s <= 5; s++) {
        const powerBase = (await client.query('SELECT required_power FROM islands WHERE id=$1', [island.id])).rows[0].required_power
        const stagePower = Math.floor(powerBase * (0.6 + s * 0.1))
        const enemies = generateEnemies(island.name, s)
        const rewards = {
          gold: 200 + s * 100,
          exp: 150 + s * 80,
          gems: s === 5 ? 10 : 0,
          tickets: s === 5 ? 1 : 0
        }
        await client.query(`
          INSERT INTO stages (island_id, stage_number, name, enemy_data, rewards, stamina_cost, required_power, background_img)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
          ON CONFLICT DO NOTHING
        `, [island.id, s, `${island.name} - Stage ${s}`, JSON.stringify(enemies), JSON.stringify(rewards), 6, stagePower,
            `/assets/bitmaps/battleBackground/bg_Z00${Math.min(s, 9)}.i.txt`])
      }
    }

    // ===================== SHIPS =====================
    const ships = [
      { name: 'Going Merry', description: 'The first ship of the Straw Hat Pirates. A caravel with a sheep figurehead. Though small, it carried the crew through East Blue and the Grand Line.', image_url: '/assets/bitmaps/boat1/1.png', arc: 'East Blue', base_hp: 5000, base_speed: 100, base_cannon: 50, unlock_condition: 'Default ship' },
      { name: 'Thousand Sunny', description: 'The second ship of the Straw Hat Pirates, built by Franky using Adam Wood. Equipped with the Gaon Cannon and Coup de Burst.', image_url: '/assets/bitmaps/boat2/1.png', arc: 'Water 7', base_hp: 12000, base_speed: 140, base_cannon: 120, unlock_condition: 'Complete Water 7 arc' },
      { name: 'Moby Dick', description: 'The legendary flagship of the Whitebeard Pirates. One of the most powerful ships to ever sail the seas.', image_url: '/assets/bitmaps/boat3/1.png', arc: 'Marineford', base_hp: 20000, base_speed: 120, base_cannon: 200, unlock_condition: 'Complete Marineford arc' },
    ]
    for (const ship of ships) {
      await client.query(`
        INSERT INTO ship_templates (name, description, image_url, arc, base_hp, base_speed, base_cannon, unlock_condition)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING
      `, [ship.name, ship.description, ship.image_url, ship.arc, ship.base_hp, ship.base_speed, ship.base_cannon, ship.unlock_condition])
    }

    // ===================== SUMMON BANNERS =====================
    const banners = [
      { name: 'Standard Summon', description: 'Summon from a pool of all available heroes. Guaranteed Rare or higher.', banner_type: 'standard', cost_tickets: 1, cost_gems: 0, pity_count: 50,
        featured_heroes: [], rates: { mythic: 0.5, legendary: 3, epic: 15, rare: 35, common: 46.5 }, is_active: true },
      { name: 'Straw Hat Crew', description: 'Featured banner with increased rates for Luffy, Zoro, Sanji and the Straw Hat crew!', banner_type: 'featured', cost_tickets: 1, cost_gems: 0, pity_count: 50,
        featured_heroes: ['10007', '10006', '10004'], rates: { mythic: 1, legendary: 6, epic: 20, rare: 40, common: 33 }, is_active: true },
      { name: 'Yonko\'s Domain', description: 'Summon the most powerful pirates in the world! Shanks, Kaido, Big Mom and Blackbeard await.', banner_type: 'legend', cost_tickets: 0, cost_gems: 300, pity_count: 30,
        featured_heroes: ['10011', '10012', '10013', '10014'], rates: { mythic: 5, legendary: 15, epic: 30, rare: 35, common: 15 }, is_active: true },
    ]
    for (const b of banners) {
      await client.query(`
        INSERT INTO summon_banners (name, description, banner_type, cost_tickets, cost_gems, pity_count, featured_heroes, rates, is_active)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING
      `, [b.name, b.description, b.banner_type, b.cost_tickets, b.cost_gems, b.pity_count,
          JSON.stringify(b.featured_heroes), JSON.stringify(b.rates), b.is_active])
    }

    // ===================== TASKS =====================
    const tasks = [
      { name: 'First Steps', description: 'Complete 1 campaign stage', task_type: 'campaign_clear', target_count: 1, reward_gold: 500, reward_gems: 5, reward_tickets: 0, reward_exp: 200, reset_type: 'daily' },
      { name: 'Pirate Training', description: 'Complete 3 campaign stages', task_type: 'campaign_clear', target_count: 3, reward_gold: 1000, reward_gems: 10, reward_tickets: 1, reward_exp: 500, reset_type: 'daily' },
      { name: 'Grand Line Explorer', description: 'Complete 5 campaign stages', task_type: 'campaign_clear', target_count: 5, reward_gold: 2000, reward_gems: 20, reward_tickets: 2, reward_exp: 1000, reset_type: 'daily' },
      { name: 'Summon Beginner', description: 'Perform 1 summon', task_type: 'summon', target_count: 1, reward_gold: 500, reward_gems: 10, reward_tickets: 0, reward_exp: 300, reset_type: 'daily' },
      { name: 'Crew Builder', description: 'Collect 5 different heroes', task_type: 'collect_heroes', target_count: 5, reward_gold: 3000, reward_gems: 30, reward_tickets: 3, reward_exp: 2000, reset_type: 'weekly' },
      { name: 'Battle Veteran', description: 'Win 10 battles total', task_type: 'win_battles', target_count: 10, reward_gold: 5000, reward_gems: 50, reward_tickets: 5, reward_exp: 3000, reset_type: 'weekly' },
      { name: 'Daily Login', description: 'Log in today', task_type: 'login', target_count: 1, reward_gold: 1000, reward_gems: 15, reward_tickets: 1, reward_exp: 500, reset_type: 'daily' },
      { name: 'Upgrade Your Crew', description: 'Level up any hero', task_type: 'level_hero', target_count: 1, reward_gold: 800, reward_gems: 8, reward_tickets: 0, reward_exp: 400, reset_type: 'daily' },
    ]
    for (const t of tasks) {
      await client.query(`
        INSERT INTO task_templates (name, description, task_type, target_count, reward_gold, reward_gems, reward_tickets, reward_exp, reset_type)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING
      `, [t.name, t.description, t.task_type, t.target_count, t.reward_gold, t.reward_gems, t.reward_tickets, t.reward_exp, t.reset_type])
    }

    console.log('✅ Database seeded successfully!')
    console.log(`   - ${heroes.length} heroes`)
    console.log(`   - ${islands.length} islands`)
    console.log(`   - ${ships.length} ships`)
    console.log(`   - ${banners.length} summon banners`)
    console.log(`   - ${tasks.length} task templates`)

  } catch (err) {
    console.error('Seed error:', err)
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

function generateEnemies(islandName, stageNum) {
  const enemyPools = {
    'Shells Town': [
      { name: 'Marine Grunt', hp: 800, atk: 80, def: 60, speed: 90, portrait: '/assets/bitmaps/heroHeads/headsmall/samll_10033.png' },
      { name: 'Marine Sergeant', hp: 1200, atk: 120, def: 90, speed: 95, portrait: '/assets/bitmaps/heroHeads/headsmall/samll_10034.png' },
    ],
    'Orange Town': [
      { name: 'Buggy Pirate', hp: 1000, atk: 100, def: 70, speed: 88, portrait: '/assets/bitmaps/heroHeads/headsmall/samll_10033.png' },
      { name: 'Buggy Bomber', hp: 1400, atk: 140, def: 80, speed: 92, portrait: '/assets/bitmaps/heroHeads/headsmall/samll_10033.png' },
    ],
  }
  const defaultPool = [
    { name: 'Pirate Grunt', hp: 500 + stageNum * 300, atk: 60 + stageNum * 20, def: 40 + stageNum * 15, speed: 85 + stageNum * 3, portrait: '/assets/bitmaps/heroHeads/headsmall/samll_10033.png' },
    { name: 'Pirate Captain', hp: 800 + stageNum * 500, atk: 90 + stageNum * 30, def: 60 + stageNum * 20, speed: 90 + stageNum * 3, portrait: '/assets/bitmaps/heroHeads/headsmall/samll_10034.png' },
  ]
  const pool = enemyPools[islandName] || defaultPool
  const count = Math.min(2 + Math.floor(stageNum / 2), 4)
  return Array.from({ length: count }, (_, i) => ({
    ...pool[i % pool.length],
    hp: Math.floor((pool[i % pool.length].hp || 1000) * (1 + stageNum * 0.2)),
    atk: Math.floor((pool[i % pool.length].atk || 100) * (1 + stageNum * 0.15)),
    id: `enemy_${i + 1}`
  }))
}

seed().catch(console.error)

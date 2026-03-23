const HERO_POOL = [
  { id: 'captain-blaze', name: 'Captain Blaze', rarity: 'Rare', role: 'Warrior', faction: 'Seafarers', power: 110 },
  { id: 'navigator-zephyr', name: 'Navigator Zephyr', rarity: 'Epic', role: 'Support', faction: 'Seafarers', power: 135 },
  { id: 'warden-marro', name: 'Warden Marro', rarity: 'Epic', role: 'Tank', faction: 'Fleet', power: 140 },
  { id: 'grave-singer-nyx', name: 'Grave Singer Nyx', rarity: 'Legendary', role: 'Mage', faction: 'Undying', power: 190 },
  { id: 'storm-giant-grom', name: 'Storm Giant Grom', rarity: 'Legendary', role: 'Tank', faction: 'Colossi', power: 205 },
  { id: 'oracle-sera', name: 'Oracle Sera', rarity: 'Mythic', role: 'Support', faction: 'Mystics', power: 250 }
];
const ISLANDS = [
  { id: 1, name: 'Windward Isles', stages: [120, 150, 190] },
  { id: 2, name: 'Sandstorm Dominion', stages: [220, 260, 310] },
  { id: 3, name: 'Skyreach Atoll', stages: [350, 390, 450] },
  { id: 4, name: 'Tidal Metropolis', stages: [500, 560, 630] },
  { id: 5, name: 'Nightfall Harbor', stages: [700, 780, 860] },
  { id: 6, name: 'Stormhold Citadel', stages: [950, 1040, 1140] },
  { id: 7, name: 'Sugarspire Realm', stages: [1260, 1390, 1530] },
  { id: 8, name: 'Titan Realm', stages: [1680, 1850, 2050] }
];
const EVENTS = [
  { title: 'Festival of Lights', text: 'Earn extra summon tickets from stage clears.', reward: '+1 ticket on first win per island' },
  { title: 'Giants\' Muster', text: 'Colossi heroes gain bonus formation power.', reward: '+20% Colossi power' }
];
const TASKS = [
  { id: 'clear-stage', title: 'Clear 1 Stage', reward: { gold: 150, gems: 10 }, target: 1 },
  { id: 'summon-once', title: 'Summon 1 Hero', reward: { gold: 100, tickets: 1 }, target: 1 },
  { id: 'win-three', title: 'Win 3 Battles', reward: { gems: 40 }, target: 3 }
];
const SAVE_KEY = 'grandline-playable-demo-v1';
let state = loadState();
let selectedIsland = state.progress.island;

function defaultState() {
  return {
    currencies: { gold: 500, gems: 250, tickets: 12 },
    pity: 0,
    progress: { island: 1, stage: 1, wins: 0 },
    owned: {
      'captain-blaze': { copies: 1, shards: 0 },
      'navigator-zephyr': { copies: 1, shards: 0 },
      'warden-marro': { copies: 1, shards: 0 }
    },
    formation: ['captain-blaze', 'warden-marro', 'navigator-zephyr', null, null, null],
    taskProgress: { 'clear-stage': 0, 'summon-once': 0, 'win-three': 0 },
    claimed: {}
  };
}
function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : defaultState();
  } catch {
    return defaultState();
  }
}
function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
function rarityWeight(hero) {
  return ({ Rare: 70, Epic: 22, Legendary: 7, Mythic: 1 })[hero.rarity] || 1;
}
function pickHero() {
  if (state.pity >= 29) {
    state.pity = 0;
    return HERO_POOL.find(h => h.rarity === 'Legendary') || HERO_POOL[0];
  }
  let roll = Math.random() * HERO_POOL.reduce((a, h) => a + rarityWeight(h), 0);
  for (const hero of HERO_POOL) {
    roll -= rarityWeight(hero);
    if (roll <= 0) {
      if (hero.rarity === 'Legendary' || hero.rarity === 'Mythic') state.pity = 0; else state.pity += 1;
      return hero;
    }
  }
  return HERO_POOL[0];
}
function ownedHeroes() {
  return HERO_POOL.filter(h => state.owned[h.id]).map(h => ({ ...h, ...state.owned[h.id] }));
}
function teamPower() {
  return state.formation.filter(Boolean).reduce((sum, id) => {
    const hero = HERO_POOL.find(h => h.id === id);
    if (!hero) return sum;
    let power = hero.power;
    if (hero.faction === 'Colossi') power *= 1.2;
    const owned = state.owned[id];
    power += (owned?.copies || 1) * 10 + Math.floor((owned?.shards || 0) / 10) * 4;
    return sum + power;
  }, 0);
}
function updateCurrencies() {
  byId('goldValue').textContent = state.currencies.gold;
  byId('gemsValue').textContent = state.currencies.gems;
  byId('ticketsValue').textContent = state.currencies.tickets;
  byId('pityText').textContent = 'Legendary pity: ' + state.pity + '/30';
}
function renderIslands() {
  const grid = byId('islandGrid');
  grid.innerHTML = '';
  ISLANDS.forEach(island => {
    const unlocked = island.id <= state.progress.island;
    const div = document.createElement('div');
    div.className = 'island-card ' + (selectedIsland === island.id ? 'active ' : '') + (unlocked ? '' : 'locked');
    div.innerHTML = '<strong>' + island.name + '</strong><div class="small">Stages: ' + island.stages.length + '</div>';
    if (unlocked) div.onclick = () => { selectedIsland = island.id; renderIslands(); renderStages(); };
    grid.appendChild(div);
  });
}
function renderStages() {
  const wrap = byId('stagePanel');
  wrap.innerHTML = '';
  const island = ISLANDS.find(i => i.id === selectedIsland);
  island.stages.forEach((enemyPower, index) => {
    const stageNo = index + 1;
    const cleared = selectedIsland < state.progress.island || (selectedIsland === state.progress.island && stageNo < state.progress.stage);
    const current = selectedIsland === state.progress.island && stageNo === state.progress.stage;
    const card = document.createElement('div');
    card.className = 'stage-card';
    card.innerHTML = '<strong>Stage ' + stageNo + '</strong><div class="small">Enemy power: ' + enemyPower + '</div><div class="small">Team power: ' + teamPower() + '</div>';
    const btn = document.createElement('button');
    btn.textContent = cleared ? 'Cleared' : (current ? 'Battle' : 'Locked');
    btn.disabled = !current;
    btn.onclick = () => battleStage(selectedIsland, stageNo, enemyPower);
    card.appendChild(document.createElement('div')).style.height = '10px';
    card.appendChild(btn);
    wrap.appendChild(card);
  });
}
function battleStage(islandId, stageNo, enemyPower) {
  const power = teamPower();
  const randomSwing = Math.floor(Math.random() * 41) - 20;
  const finalPower = power + randomSwing;
  if (finalPower >= enemyPower) {
    state.currencies.gold += 120 + islandId * 35;
    state.currencies.gems += 10;
    state.progress.wins += 1;
    state.taskProgress['clear-stage'] = Math.min(TASKS[0].target, state.taskProgress['clear-stage'] + 1);
    state.taskProgress['win-three'] = Math.min(TASKS[2].target, state.taskProgress['win-three'] + 1);
    if (stageNo === ISLANDS.find(i => i.id === islandId).stages.length) {
      state.progress.island = Math.max(state.progress.island, islandId + 1);
      state.progress.stage = 1;
      showToast('Island cleared: ' + ISLANDS.find(i => i.id === islandId).name);
    } else {
      state.progress.stage = stageNo + 1;
      showToast('Victory. Stage ' + stageNo + ' cleared.');
    }
  } else {
    showToast('Defeat. Strengthen your formation.');
  }
  saveState();
  rerender();
}
function doSummon(times) {
  const results = [];
  for (let i = 0; i < times; i++) {
    if (state.currencies.tickets <= 0) {
      if (state.currencies.gems < 50) break;
      state.currencies.gems -= 50;
    } else {
      state.currencies.tickets -= 1;
    }
    const hero = pickHero();
    if (!state.owned[hero.id]) state.owned[hero.id] = { copies: 1, shards: 0 };
    else {
      state.owned[hero.id].copies += 1;
      state.owned[hero.id].shards += hero.rarity === 'Rare' ? 10 : hero.rarity === 'Epic' ? 20 : 40;
    }
    state.taskProgress['summon-once'] = Math.min(TASKS[1].target, state.taskProgress['summon-once'] + 1);
    results.push(hero.name + ' (' + hero.rarity + ')');
  }
  byId('summonLog').innerHTML = results.map(x => '<div class="log-entry">' + x + '</div>').join('') || '<div class="log-entry">Not enough tickets or gems.</div>';
  saveState();
  rerender();
}
function renderEvents() {
  byId('eventsPanel').innerHTML = EVENTS.map(e => '<div class="event-card"><strong>' + e.title + '</strong><div class="small">' + e.text + '</div><div class="small">Reward: ' + e.reward + '</div></div>').join('');
}
function renderTasks() {
  const panel = byId('tasksPanel');
  panel.innerHTML = '';
  TASKS.forEach(task => {
    const prog = state.taskProgress[task.id] || 0;
    const done = prog >= task.target;
    const claimed = state.claimed[task.id];
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = '<strong>' + task.title + '</strong><div class="small">Progress: ' + prog + '/' + task.target + '</div>';
    const btn = document.createElement('button');
    btn.textContent = claimed ? 'Claimed' : done ? 'Claim Reward' : 'In Progress';
    btn.disabled = claimed || !done;
    btn.onclick = () => claimTask(task.id);
    card.appendChild(document.createElement('div')).style.height = '10px';
    card.appendChild(btn);
    panel.appendChild(card);
  });
}
function claimTask(taskId) {
  const task = TASKS.find(t => t.id === taskId);
  if (!task || state.claimed[taskId]) return;
  state.claimed[taskId] = true;
  state.currencies.gold += task.reward.gold || 0;
  state.currencies.gems += task.reward.gems || 0;
  state.currencies.tickets += task.reward.tickets || 0;
  saveState();
  showToast('Claimed task reward: ' + task.title);
  rerender();
}
function renderFormation() {
  const wrap = byId('formationSlots');
  wrap.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const id = state.formation[i];
    const slot = document.createElement('div');
    slot.className = 'slot';
    if (!id) slot.innerHTML = '<div class="small">Empty slot ' + (i + 1) + '</div>';
    else {
      const hero = HERO_POOL.find(h => h.id === id);
      slot.innerHTML = '<strong>' + hero.name + '</strong><div class="small">' + hero.role + ' · ' + hero.rarity + '</div>';
      const btn = document.createElement('button');
      btn.textContent = 'Remove';
      btn.onclick = () => { state.formation[i] = null; saveState(); rerender(); };
      slot.appendChild(document.createElement('div')).style.height = '10px';
      slot.appendChild(btn);
    }
    wrap.appendChild(slot);
  }
}
function renderRoster() {
  const wrap = byId('heroRoster');
  wrap.innerHTML = '';
  ownedHeroes().forEach(hero => {
    const card = document.createElement('div');
    card.className = 'hero-card';
    card.innerHTML = '<strong class="rarity-' + hero.rarity.toLowerCase() + '">' + hero.name + '</strong><div class="small">' + hero.faction + ' · ' + hero.role + '</div><div class="small">Copies: ' + hero.copies + ' · Shards: ' + hero.shards + '</div>';
    const btn = document.createElement('button');
    btn.textContent = state.formation.includes(hero.id) ? 'In Formation' : 'Add to Formation';
    btn.disabled = state.formation.includes(hero.id) || state.formation.filter(Boolean).length >= 6;
    btn.onclick = () => {
      const idx = state.formation.findIndex(x => !x);
      if (idx >= 0) {
        state.formation[idx] = hero.id;
        saveState();
        rerender();
      }
    };
    card.appendChild(document.createElement('div')).style.height = '10px';
    card.appendChild(btn);
    wrap.appendChild(card);
  });
}
function rerender() {
  updateCurrencies();
  renderIslands();
  renderStages();
  renderEvents();
  renderTasks();
  renderFormation();
  renderRoster();
}
function byId(id) { return document.getElementById(id); }
let toastTimer;
function showToast(text) {
  const toast = byId('toast');
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}
byId('singleSummonBtn').onclick = () => doSummon(1);
byId('tenSummonBtn').onclick = () => doSummon(10);
byId('resetSaveBtn').onclick = () => { localStorage.removeItem(SAVE_KEY); state = defaultState(); selectedIsland = 1; rerender(); showToast('Save reset.'); };
rerender();

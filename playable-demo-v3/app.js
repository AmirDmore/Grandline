(function(){
  const D = window.GRANDLINE_DATA;
  const U = window.GRANDLINE_UI;
  const SAVE_KEY = 'grandline-demo-v3';
  const state = load();

  function defaults(){
    return {
      screen:'create',
      starter:null,
      playerName:'AmirDmor',
      level:1,
      power:723649,
      gold:8346,
      gems:3530,
      tickets:12,
      vitality:12548,
      crew:[0,1,2],
      selectedCrew:0,
      battleLog:['Welcome to The Grand Line.'],
      teamHp:[100,100,100],
      enemyHp:[100,100,100]
    };
  }
  function load(){
    try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')); }
    catch { return defaults(); }
  }
  function save(){ localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
  function starterCrew(){
    const s = D.starters.find(x=>x.id===state.starter) || D.starters[0];
    return { name:s.name, rarity:'Epic', role:s.role, power:900, hp:1200, atk:210, def:180, icon:s.icon };
  }
  function crewList(){
    const base = D.crew.map((x,i)=>Object.assign({idx:i}, x));
    base[0] = Object.assign(base[0], starterCrew(), {name: starterCrew().name});
    return base;
  }
  function mount(){
    const app = document.getElementById('app');
    app.innerHTML = '';
    if(state.screen==='create') app.appendChild(renderCreate());
    if(state.screen==='town') app.appendChild(renderTown());
    app.appendChild(renderCrewModal());
    app.appendChild(renderBattleModal());
  }
  function renderCreate(){
    const wrap = U.el('div','screen active center-wrap');
    const card = U.el('div','card');
    const head = U.el('div','hero-select-header','<h1>Create Your Hero</h1><div class="small">Choose your starting class, then begin your journey.</div>');
    const grid = U.el('div','hero-select-grid');
    D.starters.forEach(h=>{
      const c = U.el('div','hero-option'+(state.starter===h.id?' selected':''));
      c.innerHTML = `<div class="hero-avatar">${h.icon}</div><div><strong>${h.name}</strong></div><div class="hero-role">${h.role}</div><div class="small">${h.desc}</div>`;
      c.onclick = ()=>{ state.starter=h.id; save(); mount(); };
      grid.appendChild(c);
    });
    const foot = U.el('div','create-footer');
    foot.appendChild(U.el('div','small', state.starter ? `Selected: ${D.starters.find(x=>x.id===state.starter).name}` : 'Choose a starter to continue'));
    const startBtn = U.btn('Start Game','alt',()=>{ if(!state.starter) return; state.screen='town'; save(); mount(); });
    startBtn.disabled = !state.starter;
    foot.appendChild(startBtn);
    card.appendChild(head); card.appendChild(grid); card.appendChild(foot); wrap.appendChild(card);
    return wrap;
  }
  function renderTown(){
    const wrap = U.el('div','screen active');
    const top = U.el('div','topbar');
    top.innerHTML = `<div class="top-left"><div class="portrait">${starterCrew().icon||'⚔️'}</div><div class="name-block"><strong>${state.playerName}</strong><div class="small">Lv.${state.level} · Power ${state.power.toLocaleString()}</div><div class="small">Vitality ${state.vitality}/50000</div></div></div>`;
    const resources = U.el('div','resource-bar');
    [['Gold',state.gold],['Gems',state.gems],['Tickets',state.tickets]].forEach(([n,v])=>{
      const r = U.el('div','resource',`<span>${n}</span><strong>${v}</strong>`); resources.appendChild(r);
    });
    top.appendChild(resources);
    const layout = U.el('div','town-layout');
    const left = U.el('div','side-panel');
    left.appendChild(U.el('h3','', 'Town Status'));
    const menu = U.el('div','menu-list');
    ['Battle Available','Train Available','Study Available','Sail Available','Enhance Available','Mine Available','Event List'].forEach(x=>menu.appendChild(U.el('div','menu-item',x)));
    left.appendChild(menu);

    const main = U.el('div','main-panel');
    main.appendChild(U.el('h3','', 'Fishman Island'));
    const actions = U.el('div','action-grid');
    D.townActions.forEach(name=>{
      const btn = U.el('div','town-action',`<strong>${name}</strong>`);
      if(name==='Battle Arena') btn.onclick = openBattle;
      if(name==='Crew') btn.onclick = openCrew;
      actions.appendChild(btn);
    });
    const scene = U.el('div','town-scene');
    const stage = U.el('div','character-stage');
    stage.appendChild(U.el('div','npc','NPC'));
    stage.appendChild(U.el('div','player-stand', starterCrew().icon || '⚔️'));
    stage.appendChild(U.el('div','npc','PET'));
    scene.appendChild(actions);
    scene.appendChild(stage);
    main.appendChild(scene);
    const bottom = U.el('div','bottom-menu');
    D.systems.forEach(name=>{
      const b = U.el('div','bottom-btn',name);
      if(name==='Crew') b.onclick=openCrew;
      if(name==='Arena') b.onclick=openBattle;
      bottom.appendChild(b);
    });
    main.appendChild(bottom);

    const right = U.el('div','quest-panel');
    right.appendChild(U.el('h3','', 'Quest Tracker'));
    const q = U.el('div','quest-list');
    D.quests.forEach(x=>q.appendChild(U.el('div','quest-item',x)));
    right.appendChild(q);

    layout.appendChild(left); layout.appendChild(main); layout.appendChild(right);
    wrap.appendChild(top); wrap.appendChild(layout);
    return wrap;
  }
  function renderCrewModal(){
    const ov = U.el('div','overlay'+(state.showCrew?' active':''));
    ov.id='crewOverlay';
    const modal = U.el('div','modal');
    const head = U.el('div','modal-header', '<h2 style="margin:0">Crew</h2>');
    head.appendChild(U.btn('Close','ghost',()=>{ state.showCrew=false; save(); mount(); }));
    const body = U.el('div','crew-layout');
    const list = U.el('div','hero-list');
    crewList().forEach((h,i)=>{
      const e = U.el('div','hero-entry'+(state.selectedCrew===i?' selected':''), `<strong>${h.name}</strong><div class="small">${h.rarity} · ${h.role}</div><div class="small">Power ${h.power}</div>`);
      e.onclick=()=>{ state.selectedCrew=i; save(); mount(); };
      list.appendChild(e);
    });
    const selected = crewList()[state.selectedCrew] || crewList()[0];
    const center = U.el('div','character-sheet');
    center.appendChild(U.el('div','sheet-avatar', selected.icon || '🧭'));
    const stats = U.el('div','');
    stats.appendChild(U.el('div','hero-entry', `<strong>${selected.name}</strong><div class="small">${selected.rarity} · ${selected.role}</div><div class="small">P.Atk ${selected.atk} · P.Def ${selected.def}</div><div class="small">HP ${selected.hp} · Power ${selected.power}</div>`));
    const equips = U.el('div','equip-grid');
    ['Weapon','Helmet','Armor','Accessory','Fruit','Talent'].forEach(x=>equips.appendChild(U.el('div','equip-slot', `<strong>${x}</strong><div class="small">Locked/Basic</div>`)));
    stats.appendChild(equips);
    const dev = U.el('div','dev-row');
    dev.appendChild(U.btn('Advance'));
    dev.appendChild(U.btn('Skills','ghost'));
    dev.appendChild(U.btn('Develop','ghost'));
    stats.appendChild(dev);
    center.appendChild(stats);
    const right = U.el('div','hero-list');
    ['Bag Page 1/7','Devil Fruit','Talent Tree','Equipment Items'].forEach(x=>right.appendChild(U.el('div','equip-slot', x)));
    body.appendChild(list); body.appendChild(center); body.appendChild(right);
    modal.appendChild(head); modal.appendChild(body); ov.appendChild(modal);
    return ov;
  }
  function renderBattleModal(){
    const ov = U.el('div','overlay'+(state.showBattle?' active':''));
    ov.id='battleOverlay';
    const modal = U.el('div','modal');
    const head = U.el('div','modal-header', '<h2 style="margin:0">Battle Arena</h2>');
    head.appendChild(U.btn('Close','ghost',()=>{ state.showBattle=false; save(); mount(); }));
    const body = U.el('div','battle-layout');
    body.innerHTML = `<div class="battle-top"><div><strong>${state.playerName}</strong><div class="small">Rounds 01</div></div><div><strong>Enemy Squad</strong><div class="small">System Battle</div></div></div>`;
    const grid = U.el('div','battle-grid');
    const left = U.el('div','team-column');
    const right = U.el('div','team-column');
    crewList().slice(0,4).forEach((h,i)=>left.appendChild(unitCard(h.name, h.role, state.teamHp[i%state.teamHp.length])));
    D.enemies.slice(0,4).forEach((h,i)=>right.appendChild(unitCard(h.name, 'Enemy', state.enemyHp[i%state.enemyHp.length])));
    grid.appendChild(left); grid.appendChild(right);
    body.appendChild(grid);
    const actions = U.el('div','dev-row');
    actions.appendChild(U.btn('Fight', '', runBattle));
    actions.appendChild(U.btn('Auto', 'ghost'));
    actions.appendChild(U.btn('Skip', 'ghost'));
    body.appendChild(actions);
    const log = U.el('div','log-box');
    state.battleLog.forEach(x=>log.appendChild(U.el('div','battle-unit', x)));
    body.appendChild(log);
    modal.appendChild(head); modal.appendChild(body); ov.appendChild(modal);
    return ov;
  }
  function unitCard(name, role, hp){
    const c = U.el('div','battle-unit', `<strong>${name}</strong><div class="small">${role}</div>`);
    const bar = U.el('div','hp');
    bar.appendChild(U.el('div','', ''));
    bar.firstChild.style.width = hp + '%';
    c.appendChild(bar);
    return c;
  }
  function runBattle(){
    state.teamHp = state.teamHp.map(x=>Math.max(15, x - Math.floor(Math.random()*18)));
    state.enemyHp = state.enemyHp.map(x=>Math.max(0, x - (18 + Math.floor(Math.random()*26))));
    state.battleLog = [
      starterCrew().name + ' unleashes a combo attack.',
      'Navigator support raises team morale.',
      'Enemy squad takes heavy damage.',
      state.enemyHp.every(x=>x===0) ? 'Victory! Rewards claimed.' : 'Battle continues...'
    ];
    if(state.enemyHp.every(x=>x===0)) {
      state.gold += 500; state.gems += 30; state.enemyHp = [100,100,100]; state.teamHp = [100,100,100];
    }
    save(); mount();
  }
  function openCrew(){ state.showCrew=true; save(); mount(); }
  function openBattle(){ state.showBattle=true; save(); mount(); }
  mount();
})();
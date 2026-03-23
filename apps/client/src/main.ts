import { heroes, liveEvents } from './data/mockData';
import { renderHeroPanel } from './ui/renderHeroPanel';
import { renderEventPanel } from './ui/renderEventPanel';
import { BootScene } from './scenes/BootScene';

const heroListEl = document.getElementById('heroList')!;
const eventListEl = document.getElementById('eventList')!;
const resultEl = document.getElementById('summonResult')!;
const summonBtn = document.getElementById('summonBtn')!;

renderHeroPanel(heroListEl, heroes);
renderEventPanel(eventListEl, liveEvents);
BootScene.mount(document.getElementById('game')!);

summonBtn.addEventListener('click', () => {
  const picked = heroes[Math.floor(Math.random() * heroes.length)];
  resultEl.textContent = `You pulled ${picked.name} (${picked.rarity})`;
});

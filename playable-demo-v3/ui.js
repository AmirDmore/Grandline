window.GRANDLINE_UI = {
  el(tag, cls, html) {
    const x = document.createElement(tag);
    if (cls) x.className = cls;
    if (html !== undefined) x.innerHTML = html;
    return x;
  },
  btn(label, cls, onClick) {
    const b = document.createElement('button');
    b.className = cls || '';
    b.textContent = label;
    if (onClick) b.onclick = onClick;
    return b;
  },
  rarityClass(r) {
    return 'rarity-' + String(r || '').toLowerCase();
  }
};

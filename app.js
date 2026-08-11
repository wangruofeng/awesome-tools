const KEYS = { language: 'awesome-tools-language', theme: 'awesome-tools-theme', favorites: 'awesome-tools-favorites', recent: 'awesome-tools-recent' };
const FAV_TAB = '__favorites';
const RECENT_TAB = '__recent';

const copy = {
  'zh-CN': { all:'全部', recent:'最近使用', favs:'★ 收藏', subtitle:'开源作品与在线工具集合', search:'搜索作品或工具（支持名称、关键词）…', clearSearch:'清空搜索', source:'源码', demo:'在线体验', count:(total, matched) => `共 ${total} 个 · 匹配 ${matched} 个`, times:n => `${n} 次`, emptyT:'未找到匹配的作品或工具', emptyD:'换个关键词或分类试试。', emptyFavT:'还没有收藏的作品或工具', emptyFavD:'悬停卡片，点击右上角星标即可收藏。', emptyRecentT:'暂无最近使用记录', emptyRecentD:'打开任意作品或工具的在线体验或源码后，会出现在这里。', favorite:'收藏', unfavorite:'取消收藏', favOn:name => `已收藏 ${name}`, favOff:name => `已取消收藏 ${name}`, githubTitle:'查看 GitHub 源码', themeLight:'切换到浅色', themeDark:'切换到深色', langTitle:'切换语言' },
  'zh-TW': { all:'全部', recent:'最近使用', favs:'★ 收藏', subtitle:'開源作品與線上工具集合', search:'搜尋作品或工具（支援名稱、關鍵詞）…', clearSearch:'清空搜尋', source:'原始碼', demo:'線上體驗', count:(total, matched) => `共 ${total} 個 · 符合 ${matched} 個`, times:n => `${n} 次`, emptyT:'未找到符合的作品或工具', emptyD:'換個關鍵詞或分類試試。', emptyFavT:'還沒有收藏的作品或工具', emptyFavD:'懸停卡片，點擊右上角星標即可收藏。', emptyRecentT:'暫無最近使用記錄', emptyRecentD:'開啟任意作品或工具的線上體驗或原始碼後，會出現在這裡。', favorite:'收藏', unfavorite:'取消收藏', favOn:name => `已收藏 ${name}`, favOff:name => `已取消收藏 ${name}`, githubTitle:'查看 GitHub 原始碼', themeLight:'切換到淺色', themeDark:'切換到深色', langTitle:'切換語言' },
  en: { all:'All', recent:'Recent', favs:'★ Favorites', subtitle:'Open-source projects and online tools collection', search:'Search projects or tools by name or keyword…', clearSearch:'Clear search', source:'Source', demo:'Live demo', count:(total, matched) => `${total} total · ${matched} matched`, times:n => `${n}×`, emptyT:'No matching projects or tools', emptyD:'Try another keyword or category.', emptyFavT:'No favorite projects or tools yet', emptyFavD:'Hover a card and click the star in the corner to favorite it.', emptyRecentT:'No recent items yet', emptyRecentD:'Open an item’s live demo or source and it will show up here.', favorite:'Favorite', unfavorite:'Remove favorite', favOn:name => `Favorited ${name}`, favOff:name => `Unfavorited ${name}`, githubTitle:'View source on GitHub', themeLight:'Switch to light', themeDark:'Switch to dark', langTitle:'Language' }
};
const languageNames = { 'zh-CN':'简体中文', 'zh-TW':'繁體中文', en:'English' };

const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const STAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

const state = { data:null, language:localStorage.getItem(KEYS.language) || 'zh-CN', category:'all', query:'', favorites:new Set(JSON.parse(localStorage.getItem(KEYS.favorites) || '[]')), recent:JSON.parse(localStorage.getItem(KEYS.recent) || '{}') };
const $ = selector => document.querySelector(selector);

function text() { return copy[state.language] || copy['zh-CN']; }
function matches(tool) {
  const term = state.query.trim().toLocaleLowerCase();
  const localized = `${tool.name[state.language]} ${tool.description[state.language]}`.toLocaleLowerCase();
  return !term || localized.includes(term);
}
function visibleTools() {
  const tools = state.data.tools.filter(tool =>
    (state.category === 'all' || (state.category === FAV_TAB ? state.favorites.has(tool.id) : state.category === RECENT_TAB ? state.recent[tool.id] : tool.category === state.category)) && matches(tool));
  if (state.category === RECENT_TAB) tools.sort((a, b) => (state.recent[b.id]?.last || 0) - (state.recent[a.id]?.last || 0));
  return tools;
}
function saveFavorites() { localStorage.setItem(KEYS.favorites, JSON.stringify([...state.favorites])); }
function saveRecent() { localStorage.setItem(KEYS.recent, JSON.stringify(state.recent)); }
function recordUse(id) {
  const entry = state.recent[id] || { count: 0 };
  entry.count++;
  entry.last = Date.now();
  state.recent[id] = entry;
  saveRecent();
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1600);
}

/* ---------- Tabs ---------- */
function renderTabs() {
  const tabs = $('#tabs'); tabs.replaceChildren();
  [['all', text().all], [RECENT_TAB, text().recent], [FAV_TAB, text().favs], ...Object.entries(state.data.categories).map(([id, value]) => [id, value[state.language]])].forEach(([id, label]) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = `tab-btn${state.category === id ? ' active' : ''}`; button.textContent = label;
    button.addEventListener('click', () => { state.category = id; render(); });
    tabs.append(button);
  });
}

/* ---------- Tool cards ---------- */
function createTool(tool) {
  const node = $('#toolTemplate').content.cloneNode(true);
  const card = node.querySelector('.tool-card');
  const name = tool.name[state.language];
  const icon = node.querySelector('.tool-icon');
  const favicon = state.data.favicons?.[tool.id];
  if (favicon) {
    const img = document.createElement('img');
    img.src = favicon;
    img.alt = ''; img.loading = 'lazy';
    img.addEventListener('error', () => icon.remove());
    icon.append(img);
  } else icon.remove();
  node.querySelector('.tool-name').textContent = name;
  const useCount = node.querySelector('.use-count');
  if (state.category === RECENT_TAB && state.recent[tool.id]) {
    useCount.textContent = text().times(state.recent[tool.id].count);
    useCount.classList.add('show');
  }
  node.querySelector('p').textContent = tool.description[state.language];
  const star = node.querySelector('.fav-star');
  const favored = state.favorites.has(tool.id);
  star.innerHTML = STAR; // 静态图标常量，非用户输入
  star.classList.toggle('on', favored);
  star.title = favored ? text().unfavorite : text().favorite;
  star.setAttribute('aria-label', star.title);
  star.addEventListener('click', () => {
    const favored = state.favorites.has(tool.id);
    favored ? state.favorites.delete(tool.id) : state.favorites.add(tool.id);
    saveFavorites();
    toast(favored ? text().favOff(name) : text().favOn(name));
    render();
  });
  const source = node.querySelector('.source'); source.href = tool.source; source.textContent = text().source;
  const demo = node.querySelector('.demo');
  if (tool.demo) {
    demo.href = tool.demo; demo.textContent = text().demo;
    demo.addEventListener('click', () => recordUse(tool.id));
  } else {
    demo.remove();
    source.parentElement.classList.add('source-only');
  }
  source.addEventListener('click', () => recordUse(tool.id));
  return card;
}

function renderResults() {
  const results = $('#results'); results.replaceChildren();
  const tools = visibleTools();
  $('#count').textContent = text().count(state.data.tools.length, tools.length);
  const groups = state.category === 'all' ? Object.keys(state.data.categories) : [state.category];
  let rendered = 0;
  groups.forEach(category => {
    const special = category === FAV_TAB || category === RECENT_TAB;
    const groupTools = special ? tools : tools.filter(tool => tool.category === category);
    if (!groupTools.length) return;
    rendered += groupTools.length;
    const section = document.createElement('section'); section.className = 'cat-section';
    const heading = document.createElement('h2'); heading.className = 'cat-title';
    heading.textContent = category === FAV_TAB ? text().favs : category === RECENT_TAB ? text().recent : state.data.categories[category][state.language];
    const count = document.createElement('span'); count.className = 'count'; count.textContent = groupTools.length;
    heading.append(count);
    const grid = document.createElement('div'); grid.className = 'tool-grid';
    groupTools.forEach(tool => grid.append(createTool(tool)));
    section.append(heading, grid);
    results.append(section);
  });
  if (!rendered) {
    const empty = document.createElement('div'); empty.className = 'empty-state';
    const isFav = state.category === FAV_TAB && !state.query.trim();
    const isRecent = state.category === RECENT_TAB && !state.query.trim();
    empty.innerHTML = `<div class="big">${isFav ? '⭐' : isRecent ? '⏱️' : '🔍'}</div><h3></h3><p></p>`;
    empty.querySelector('h3').textContent = isFav ? text().emptyFavT : isRecent ? text().emptyRecentT : text().emptyT;
    empty.querySelector('p').textContent = isFav ? text().emptyFavD : isRecent ? text().emptyRecentD : text().emptyD;
    results.append(empty);
  }
}

/* ---------- 语言切换 ---------- */
function renderLangMenu() {
  const menu = $('#langMenu'); menu.replaceChildren();
  Object.entries(languageNames).forEach(([code, label]) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'lang-item' + (state.language === code ? ' active' : '');
    item.setAttribute('role', 'menuitem');
    item.textContent = label;
    const check = document.createElement('span'); check.className = 'check'; check.textContent = '✓';
    item.append(check);
    item.addEventListener('click', () => {
      state.language = code;
      localStorage.setItem(KEYS.language, code);
      $('#langMenu').classList.remove('show');
      render();
    });
    menu.append(item);
  });
}

/* ---------- 主题切换 ---------- */
function setTheme(dark) {
  document.documentElement.classList.toggle('dark', dark);
  const btn = $('#themeBtn');
  btn.innerHTML = dark ? SUN : MOON; // 静态图标常量，非用户输入
  btn.title = dark ? text().themeLight : text().themeDark;
  localStorage.setItem(KEYS.theme, dark ? 'dark' : 'light');
}

/* ---------- 静态文案 ---------- */
const PAGE_TITLES = {
  'zh-CN': 'Awesome Tools · 在线工具合集 — 开源实用工具导航',
  'zh-TW': 'Awesome Tools · 線上工具合集 — 開源實用工具導航',
  en: 'Awesome Tools · Open-source Online Tools Collection'
};

function renderControls() {
  document.documentElement.lang = state.language;
  document.title = PAGE_TITLES[state.language] || PAGE_TITLES['zh-CN'];
  $('#appSub').textContent = text().subtitle;
  $('#search').placeholder = text().search;
  $('#clearSearch').title = text().clearSearch;
  $('#githubLink').title = text().githubTitle;
  $('#githubLink').setAttribute('aria-label', text().githubTitle);
  $('#langBtn').title = text().langTitle;
  $('#langBtn').setAttribute('aria-label', text().langTitle);
  const dark = document.documentElement.classList.contains('dark');
  $('#themeBtn').title = dark ? text().themeLight : text().themeDark;
  renderLangMenu();
}

function render() { renderControls(); renderTabs(); renderResults(); }

/* 清除筛选项：搜索词与分类均复位 */
function clearFilters() {
  const search = $('#search');
  const changed = state.query || state.category !== 'all';
  state.query = ''; state.category = 'all';
  search.value = '';
  $('#clearSearch').classList.remove('show');
  if (changed) render();
}

async function start() {
  state.data = await fetch('./data/tools.json').then(response => { if (!response.ok) throw new Error('Unable to load tools'); return response.json(); });
  const storedTheme = localStorage.getItem(KEYS.theme);
  setTheme(storedTheme ? storedTheme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);

  const search = $('#search');
  search.addEventListener('input', () => {
    state.query = search.value;
    $('#clearSearch').classList.toggle('show', !!search.value);
    renderResults();
  });
  $('#clearSearch').addEventListener('click', () => {
    search.value = ''; state.query = '';
    $('#clearSearch').classList.remove('show');
    search.focus();
    renderResults();
  });
  $('#themeBtn').addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
  $('#langBtn').addEventListener('click', event => { event.stopPropagation(); $('#langMenu').classList.toggle('show'); });
  document.addEventListener('click', event => { if (!event.target.closest('.lang-wrap')) $('#langMenu').classList.remove('show'); });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && document.activeElement !== search) { event.preventDefault(); search.focus(); }
    if (event.key === 'Escape') {
      // 优先关闭语言菜单；其次清除筛选项
      if ($('#langMenu').classList.contains('show')) $('#langMenu').classList.remove('show');
      else clearFilters();
    }
  });
  render();
}
start().catch(error => { $('#results').textContent = error.message; });

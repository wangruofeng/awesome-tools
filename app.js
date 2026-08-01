const KEYS = { language: 'awesome-tools-language', theme: 'awesome-tools-theme', favorites: 'awesome-tools-favorites' };
const copy = {
  'zh-CN': { all:'全部', title:'按分类浏览所有工具', search:'搜索工具（支持名称、关键词）', category:'所有分类', favorites:'仅看收藏', source:'源码', demo:'在线体验', count:(total, matched) => `${total} 个工具 · ${matched} 个匹配`, empty:'没有符合条件的工具', favorite:'收藏', unfavorite:'取消收藏', language:'简体中文' },
  'zh-TW': { all:'全部', title:'依分類瀏覽所有工具', search:'搜尋工具（支援名稱、關鍵詞）', category:'所有分類', favorites:'只看收藏', source:'原始碼', demo:'線上體驗', count:(total, matched) => `${total} 個工具 · ${matched} 個符合`, empty:'沒有符合條件的工具', favorite:'收藏', unfavorite:'取消收藏', language:'繁體中文' },
  en: { all:'All', title:'Browse all tools by category', search:'Search tools by name or keyword', category:'All categories', favorites:'Favorites only', source:'Source', demo:'Live demo', count:(total, matched) => `${total} tools · ${matched} matched`, empty:'No tools match your filters', favorite:'Favorite', unfavorite:'Remove favorite', language:'English' }
};
const languageNames = { 'zh-CN':'简体中文', 'zh-TW':'繁體中文', en:'English' };
const state = { data:null, language:localStorage.getItem(KEYS.language) || 'zh-CN', category:'all', query:'', favoritesOnly:false, favorites:new Set(JSON.parse(localStorage.getItem(KEYS.favorites) || '[]')) };
const $ = selector => document.querySelector(selector);

function text() { return copy[state.language]; }
function matches(tool) { const term = state.query.trim().toLocaleLowerCase(); const localized = `${tool.name[state.language]} ${tool.description[state.language]}`.toLocaleLowerCase(); return (!state.favoritesOnly || state.favorites.has(tool.id)) && (!term || localized.includes(term)); }
function visibleTools() { return state.data.tools.filter(tool => (state.category === 'all' || tool.category === state.category) && matches(tool)); }
function saveFavorites() { localStorage.setItem(KEYS.favorites, JSON.stringify([...state.favorites])); }

function renderTabs() {
  const tabs = $('#tabs'); tabs.replaceChildren();
  [['all', text().all], ...Object.entries(state.data.categories).map(([id, value]) => [id, value[state.language]])].forEach(([id, label]) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = `tab${state.category === id ? ' active' : ''}`; button.textContent = label;
    button.addEventListener('click', () => { state.category = id; $('#category').value = id; render(); }); tabs.append(button);
  });
}
function renderCategorySelect() {
  const select = $('#category'); select.replaceChildren();
  [['all', text().category], ...Object.entries(state.data.categories).map(([id, value]) => [id, value[state.language]])].forEach(([id, label]) => {
    const option = document.createElement('option'); option.value = id; option.textContent = label; option.selected = state.category === id; select.append(option);
  });
}
function createTool(tool) {
  const node = $('#toolTemplate').content.cloneNode(true); const card = node.querySelector('.tool-card');
  node.querySelector('.tool-icon').textContent = tool.icon; node.querySelector('h3').textContent = tool.name[state.language]; node.querySelector('p').textContent = tool.description[state.language];
  const favorite = node.querySelector('.favorite'); const favored = state.favorites.has(tool.id); favorite.textContent = favored ? '★' : '☆'; favorite.classList.toggle('active', favored); favorite.setAttribute('aria-label', favored ? text().unfavorite : text().favorite);
  favorite.addEventListener('click', () => { state.favorites.has(tool.id) ? state.favorites.delete(tool.id) : state.favorites.add(tool.id); saveFavorites(); render(); });
  const source = node.querySelector('.source'); source.href = tool.source; source.textContent = text().source;
  const demo = node.querySelector('.demo'); demo.href = tool.demo; demo.textContent = text().demo;
  return card;
}
function renderResults() {
  const results = $('#results'); results.replaceChildren(); const tools = visibleTools(); $('#count').textContent = text().count(state.data.tools.length, tools.length);
  const groups = state.category === 'all' ? Object.keys(state.data.categories) : [state.category]; let rendered = 0;
  groups.forEach(category => { const groupTools = tools.filter(tool => tool.category === category); if (!groupTools.length) return; rendered += groupTools.length; const section = document.createElement('section'); section.className = 'category-section'; const heading = document.createElement('h2'); heading.textContent = state.data.categories[category][state.language]; const grid = document.createElement('div'); grid.className = 'tool-grid'; groupTools.forEach(tool => grid.append(createTool(tool))); section.append(heading, grid); results.append(section); });
  if (!rendered) { const empty = document.createElement('p'); empty.className = 'empty'; empty.textContent = text().empty; results.append(empty); }
}
function renderControls() {
  document.documentElement.lang = state.language; document.title = `Awesome Tools · ${text().title}`; $('#pageTitle').textContent = text().title; $('#search').placeholder = text().search; $('#searchLabel').textContent = text().search; $('#categoryLabel').textContent = text().category;
  const favorites = $('#favorites'); favorites.classList.toggle('active', state.favoritesOnly); favorites.setAttribute('aria-pressed', state.favoritesOnly); favorites.querySelector('span').textContent = text().favorites;
  const select = $('#language'); select.replaceChildren(); Object.entries(languageNames).forEach(([code, label]) => { const option = document.createElement('option'); option.value = code; option.textContent = label; option.selected = state.language === code; select.append(option); });
}
function render() { renderControls(); renderTabs(); renderCategorySelect(); renderResults(); }
async function start() {
  state.data = await fetch('./data/tools.json').then(response => { if (!response.ok) throw new Error('Unable to load tools'); return response.json(); });
  const storedTheme = localStorage.getItem(KEYS.theme); document.documentElement.classList.toggle('dark', storedTheme ? storedTheme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
  $('#search').addEventListener('input', event => { state.query = event.target.value; renderResults(); });
  $('#category').addEventListener('change', event => { state.category = event.target.value; render(); });
  $('#favorites').addEventListener('click', () => { state.favoritesOnly = !state.favoritesOnly; render(); });
  $('#language').addEventListener('change', event => { state.language = event.target.value; localStorage.setItem(KEYS.language, state.language); render(); });
  $('#theme').addEventListener('click', () => { const dark = !document.documentElement.classList.contains('dark'); document.documentElement.classList.toggle('dark', dark); localStorage.setItem(KEYS.theme, dark ? 'dark' : 'light'); });
  document.addEventListener('keydown', event => { if (event.key === '/' && document.activeElement !== $('#search')) { event.preventDefault(); $('#search').focus(); } }); render();
}
start().catch(error => { $('#results').textContent = error.message; });

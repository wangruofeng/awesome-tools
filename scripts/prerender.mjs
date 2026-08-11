import { readFile, writeFile } from 'node:fs/promises';

// 把 data/tools.json 中的默认语言（zh-CN）内容预渲染进 index.html，
// 让搜索引擎与不支持 JS 的爬虫也能直接抓取到完整文本内容。
// 仅替换标记注释之间的内容，<head> 其余部分仍可手工维护。

const BASE_URL = 'https://blog.wangruofeng007.com/awesome-tools/';
const LANG = 'zh-CN';
const DESCRIPTION = 'Awesome Tools 是一个开源在线工具合集，涵盖二维码、URL 编码解码、文件哈希、字符查询、税务与房贷计算等实用工具，免费、无需登录、全部开放源码。';

const dataUrl = new URL('../data/tools.json', import.meta.url);
const indexUrl = new URL('../index.html', import.meta.url);

const data = JSON.parse(await readFile(dataUrl, 'utf8'));
let html = await readFile(indexUrl, 'utf8');

const escapeHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/* ---------- 预渲染卡片（h2 分类 → h3 工具） ---------- */
function renderCards() {
  const labels = { source: '源码', demo: '在线体验' };
  const sections = Object.entries(data.categories).map(([id, category]) => {
    const tools = data.tools.filter(tool => tool.category === id);
    if (!tools.length) return '';
    const cards = tools.map(tool => {
      const demo = tool.demo
        ? `<a class="demo" href="${escapeAttr(tool.demo)}" target="_blank" rel="noopener">${labels.demo}</a>`
        : '';
      const sourceOnly = tool.demo ? '' : ' source-only';
      return [
        '      <article class="tool-card">',
        '        <div class="tool-main">',
        '          <span class="tool-icon"></span>',
        '          <div class="tool-text">',
        `            <h3><span class="tool-name">${escapeHtml(tool.name[LANG])}</span></h3>`,
        `            <p>${escapeHtml(tool.description[LANG])}</p>`,
        '          </div>',
        '        </div>',
        `        <div class="tool-links${sourceOnly}">${demo}<a class="source" href="${escapeAttr(tool.source)}" target="_blank" rel="noopener">${labels.source}</a></div>`,
        '      </article>'
      ].join('\n');
    });
    return [
      `    <section class="cat-section">`,
      `      <h2 class="cat-title">${escapeHtml(category[LANG])}<span class="count">${tools.length}</span></h2>`,
      `      <div class="tool-grid">`,
      cards.join('\n'),
      `      </div>`,
      `    </section>`
    ].join('\n');
  }).filter(Boolean).join('\n');
  return `\n${sections}\n  `;
}

/* ---------- JSON-LD（WebSite + ItemList） ---------- */
function renderJsonLd() {
  const itemListElement = data.tools.map((tool, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: tool.name[LANG],
      description: tool.description[LANG],
      applicationCategory: 'WebApplication',
      operatingSystem: 'Any',
      ...(tool.demo ? { url: tool.demo } : {}),
      codeRepository: tool.source,
      inLanguage: LANG,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'CNY' }
    }
  }));
  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Awesome Tools',
      alternateName: '在线工具合集',
      url: BASE_URL,
      description: DESCRIPTION,
      inLanguage: LANG
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Awesome Tools · 在线工具合集',
      description: DESCRIPTION,
      numberOfItems: data.tools.length,
      itemListElement
    }
  ];
  return `\n  <script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n  </script>\n`;
}

function replaceBetween(source, startMarker, endMarker, content) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);
  if (start === -1 || end === -1) throw new Error(`预渲染标记缺失：${startMarker} / ${endMarker}`);
  return source.slice(0, start + startMarker.length) + content + source.slice(end);
}

html = replaceBetween(html, '<!--SEO:JSONLD-START-->', '<!--SEO:JSONLD-END-->', renderJsonLd());
html = replaceBetween(html, '<!--SEO:PRERENDER-START-->', '<!--SEO:PRERENDER-END-->', renderCards());

await writeFile(indexUrl, html, 'utf8');
console.log(`✓ 已预渲染 ${data.tools.length} 个工具到 index.html`);

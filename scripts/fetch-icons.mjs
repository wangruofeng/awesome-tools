// 从各工具的 demo 站点拉取 favicon，保存到 icons/ 并回写 tools.json 的 icon 字段。
// 用法：node scripts/fetch-icons.mjs
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const TOOLS_JSON = new URL('../data/tools.json', import.meta.url);
const ICONS_DIR = new URL('../icons/', import.meta.url);

const EXT_BY_MIME = { 'image/svg+xml': '.svg', 'image/png': '.png', 'image/x-icon': '.ico', 'image/vnd.microsoft.icon': '.ico', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif' };

async function fetchText(url) {
  const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (icon fetcher)' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

// 从 HTML 中找 favicon 地址：优先 rel="icon"，其次 apple-touch-icon，最后退到 /favicon.ico
function findIconHref(html) {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => match[0]);
  const pick = pattern => {
    for (const link of links) {
      if (!pattern.test(link)) continue;
      const href = link.match(/href\s*=\s*["']([^"']+)["']/i);
      if (href) return href[1];
    }
    return null;
  };
  return pick(/rel\s*=\s*["'][^"']*(?:shortcut\s+)?icon["']/i) || pick(/rel\s*=\s*["']apple-touch-icon["']/i);
}

async function fetchIcon(tool) {
  const html = await fetchText(tool.demo);
  const href = findIconHref(html);
  const iconUrl = href ? new URL(href, tool.demo) : new URL('/favicon.ico', tool.demo);
  const response = await fetch(iconUrl, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (icon fetcher)' } });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${iconUrl}`);
  const mime = (response.headers.get('content-type') || '').split(';')[0].trim();
  let ext = EXT_BY_MIME[mime] || extname(iconUrl.pathname) || '.ico';
  if (ext === '.xml') throw new Error(`unexpected content: ${iconUrl}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.length) throw new Error(`empty icon: ${iconUrl}`);
  const file = `icons/${tool.id}${ext}`;
  await writeFile(new URL(`../${file}`, import.meta.url), buffer);
  return file;
}

const data = JSON.parse(await readFile(TOOLS_JSON, 'utf8'));
await mkdir(ICONS_DIR, { recursive: true });

let ok = 0, failed = 0;
for (const tool of data.tools) {
  try {
    const file = await fetchIcon(tool);
    tool.icon = file;
    ok++;
    console.log(`✓ ${tool.id} -> ${file}`);
  } catch (error) {
    failed++;
    console.warn(`✗ ${tool.id}: ${error.message}（保留原 icon "${tool.icon}"）`);
  }
}
await writeFile(TOOLS_JSON, JSON.stringify(data, null, 2) + '\n');
console.log(`\n完成：${ok} 成功，${failed} 失败`);

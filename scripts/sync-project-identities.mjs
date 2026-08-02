import { readFile, writeFile } from 'node:fs/promises';

const identities = JSON.parse(await readFile(new URL('../vendor/portfolio-data/data/projects.json', import.meta.url)));
const toolsUrl = new URL('../data/tools.json', import.meta.url);
const catalog = JSON.parse(await readFile(toolsUrl));

for (const tool of catalog.tools) {
  const identity = identities.projects[tool.id];
  if (!identity) continue;
  const [icon, zhCN, en] = identity;
  tool.icon = icon;
  tool.name['zh-CN'] = zhCN;
  tool.name.en = en;
}

await writeFile(toolsUrl, `${JSON.stringify(catalog, null, 2)}\n`);

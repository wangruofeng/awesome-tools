import { readFile, writeFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../data/tools.json', import.meta.url)));
const languages = [
  { code: 'zh-CN', file: 'README.md', title: 'Awesome Tools', intro: '我开发的开源作品与在线工具合集，按类别整理并提供源码与在线体验。', usage: '新增或修改工具时，只需更新 `data/tools.json`，然后执行 `npm run generate:readme`。', labels: ['项目名称', '项目简介', '项目源码', '在线体验'], source: '源码', demo: '在线体验' },
  { code: 'zh-TW', file: 'README.zh-TW.md', title: 'Awesome Tools', intro: '我開發的開源作品與線上工具合集，依類別整理並提供原始碼與線上體驗。', usage: '新增或修改工具時，只需更新 `data/tools.json`，然後執行 `npm run generate:readme`。', labels: ['專案名稱', '專案簡介', '專案原始碼', '線上體驗'], source: '原始碼', demo: '線上體驗' },
  { code: 'en', file: 'README.en.md', title: 'Awesome Tools', intro: 'A categorized collection of open-source projects and online tools I build, with source code and live demos.', usage: 'To add or update a tool, edit `data/tools.json`, then run `npm run generate:readme`.', labels: ['Project', 'Description', 'Source', 'Live demo'], source: 'Source', demo: 'Live demo' }
];

function makeReadme(lang) {
  const nav = `[简体中文](README.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md)`;
  const sections = Object.entries(data.categories).map(([id, category]) => {
    const rows = data.tools.filter(tool => tool.category === id).map(tool =>
      `| ${tool.icon} ${tool.name[lang.code]} | ${tool.description[lang.code]} | ${tool.source ? `[${lang.source}](${tool.source})` : '—'} | ${tool.demo ? `[${lang.demo}](${tool.demo})` : '—'} |`
    );
    return `## ${category[lang.code]}\n\n| ${lang.labels.join(' | ')} |\n| --- | --- | --- | --- |\n${rows.join('\n')}`;
  });
  return `# ${lang.title}\n\n${nav}\n\n${lang.intro}\n\n${sections.join('\n\n')}\n\n## ${lang.code === 'en' ? 'Maintenance' : '维护方式'}\n\n${lang.usage}\n\n\`\`\`bash\nnpm run generate:readme\n\`\`\`\n\nThe GitHub Pages catalog uses the same JSON data and supports category filtering, keyword search, language switching, and local favorites.\n`;
}

await Promise.all(languages.map(lang => writeFile(new URL(`../${lang.file}`, import.meta.url), makeReadme(lang))));

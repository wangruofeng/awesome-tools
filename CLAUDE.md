# awesome-tools

个人开源作品与在线工具合集的导航站：GitHub Pages 静态目录页 + 三语 README 目录。

## 关键约定（改错会破坏生成管线）

- `data/tools.json` 是唯一数据源；`README.md`、`README.zh-TW.md`、`README.en.md`、`index.html` 全部是生成物，**禁止手改**。
- 修改工具条目：只编辑 `data/tools.json` → `npm run build`（重新生成 index.html 与三份 README）→ 提交。
- `npm run check` 是同步门禁：语法检查 + 重新生成 + `git diff --exit-code`，提交前必须通过。
- 图标与中英文名称由 `scripts/sync-project-identities.mjs` 从 submodule `vendor/portfolio-data/data/projects.json` 回写进 tools.json；更新身份后先 `git submodule update --remote` 再跑 build。

## 怎么跑

- 纯静态站，无 dev server、无 npm 依赖（package.json 无 dependencies）。本地预览：直接开 `index.html` 或任意静态服务器。
- 运行时 `app.js` fetch `./data/tools.json`，实现分类过滤、关键词搜索、中英切换与本地收藏（localStorage）。

## 目录

- `data/tools.json` — 工具目录数据源（47 个工具）
- `scripts/` — 生成管线：`sync-project-identities.mjs` / `prerender.mjs`（index.html）/ `generate-readmes.mjs`（README×3）/ `fetch-icons.mjs`
- `icons/` — 工具图标缓存
- `vendor/portfolio-data/` — git submodule（身份数据上游）
- `.github/workflows/deploy-pages.yml` — push main 自动部署 GitHub Pages

## 当前状态

- 三语 README 与 index.html 均与 tools.json 同步（check 门禁通过，2026-09-17）。
- 下一步：新增工具时更新 tools.json 即可，README 与页面自动跟进。

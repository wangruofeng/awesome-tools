# Awesome Tools

[简体中文](README.md) | [繁體中文](README.zh-TW.md) | [English](README.en.md)

我开发的开源在线工具合集，按类别整理并提供源码与在线体验。

## 日常实用

| 项目名称 | 项目简介 | 项目源码 | 在线体验 |
| --- | --- | --- | --- |
| ▦ 二维码工具 | 二维码生成、识别与导出 | [源码](https://github.com/wangruofeng/qr-tool) | [在线体验](https://blog.wangruofeng007.com/qr-tool/) |
| # 文件哈希校验 | 本地计算与比对文件哈希值 | [源码](https://github.com/wangruofeng/file-hash) | [在线体验](https://blog.wangruofeng007.com/file-hash/) |
| ⌘ Unicode 速查 | Unicode 字符查询与编码转换 | [源码](https://github.com/wangruofeng/unicode-lookup) | [在线体验](https://blog.wangruofeng007.com/unicode-lookup/) |
| ▤ 身份证解析校验 | 身份证号码本地解析与校验 | [源码](https://github.com/wangruofeng/id-card) | [在线体验](https://blog.wangruofeng007.com/id-card/) |
| ¥ 个税计算器 | 中国个人所得税与年终奖测算 | [源码](https://github.com/wangruofeng/tax-calc) | [在线体验](https://blog.wangruofeng007.com/tax-calc/) |
| ⌂ 房贷计算器 | 房贷还款与提前还款测算 | [源码](https://github.com/wangruofeng/mortgage-calc) | [在线体验](https://blog.wangruofeng007.com/mortgage-calc/) |
| ￥ 金额大写转换 | 人民币数字与大写金额双向转换 | [源码](https://github.com/wangruofeng/rmb-words) | [在线体验](https://blog.wangruofeng007.com/rmb-words/) |
| ☺ Emoji Picker | 多语言 Emoji 搜索、详情查看与复制 | [源码](https://github.com/wangruofeng/emoji-picker) | [在线体验](https://blog.wangruofeng007.com/emoji-picker/) |
| ◎ Country Info | 多语言国家与地区信息速查 | [源码](https://github.com/wangruofeng/country-info) | [在线体验](https://blog.wangruofeng007.com/country-info/) |

## 开发辅助

| 项目名称 | 项目简介 | 项目源码 | 在线体验 |
| --- | --- | --- | --- |
| ⌁ 常用端口速查 | 常用网络端口查询与分类浏览 | [源码](https://github.com/wangruofeng/port-list) | [在线体验](https://blog.wangruofeng007.com/port-list/) |
| ⌗ CSS Unit Converter | CSS 单位实时换算 | [源码](https://github.com/wangruofeng/css-unit-converter) | [在线体验](https://blog.wangruofeng007.com/css-unit-converter/) |
| ⌘ .gitignore Generator | 按技术栈模板生成 .gitignore 文件 | [源码](https://github.com/wangruofeng/git-ignore-generator) | [在线体验](https://blog.wangruofeng007.com/git-ignore-generator/) |
| ◈ JWT Decoder | JWT 解码与过期检查 | [源码](https://github.com/wangruofeng/jwt-decoder) | [在线体验](https://blog.wangruofeng007.com/jwt-decoder/) |
| .* Regex Tester | 正则匹配与替换测试 | [源码](https://github.com/wangruofeng/regex-tester) | [在线体验](https://blog.wangruofeng007.com/regex-tester/) |
| ◷ Cron Viewer | Cron 解析与触发时间查看 | [源码](https://github.com/wangruofeng/cron-viewer) | [在线体验](https://blog.wangruofeng007.com/cron-viewer/) |

## 数据处理

| 项目名称 | 项目简介 | 项目源码 | 在线体验 |
| --- | --- | --- | --- |
| <>  XML Viewer | XML 格式化与查看 | [源码](https://github.com/wangruofeng/xml-viewer) | [在线体验](https://blog.wangruofeng007.com/xml-viewer/) |
| ▦ CSV Viewer | CSV 预览、过滤与导出 | [源码](https://github.com/wangruofeng/csv-viewer) | [在线体验](https://blog.wangruofeng007.com/csv-viewer/) |
| ≡ YAML Viewer | YAML 格式化与查看 | [源码](https://github.com/wangruofeng/yaml-viewer) | [在线体验](https://blog.wangruofeng007.com/yaml-viewer/) |
| </> HTML Viewer | HTML 结构预览与编辑 | [源码](https://github.com/wangruofeng/html-viewer) | [在线体验](https://blog.wangruofeng007.com/html-viewer/) |
| {} JSON to Code | JSON 生成 TypeScript、Go、Python 代码 | [源码](https://github.com/wangruofeng/json-to-code) | [在线体验](https://blog.wangruofeng007.com/json-to-code/) |
| ⇄ Data Converter | JSON、YAML、XML、CSV 互转 | [源码](https://github.com/wangruofeng/data-converter) | [在线体验](https://blog.wangruofeng007.com/data-converter/) |

## 文本与格式

| 项目名称 | 项目简介 | 项目源码 | 在线体验 |
| --- | --- | --- | --- |
| ± Diff Viewer | 文本差异对比 | [源码](https://github.com/wangruofeng/diff-viewer) | [在线体验](https://blog.wangruofeng007.com/diff-viewer/) |
| ◷ Timestamp Converter | 时间戳与日期转换 | [源码](https://github.com/wangruofeng/timestamp-converter) | [在线体验](https://blog.wangruofeng007.com/timestamp-converter/) |

## 维护方式

新增或修改工具时，只需更新 `data/tools.json`，然后执行：

```bash
node scripts/generate-readmes.mjs
```

The GitHub Pages catalog uses the same JSON data and supports category filtering, keyword search, language switching, and local favorites.

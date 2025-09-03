# Emoji Family (Next.js)

一个基于 Next.js App Router 与 TypeScript 的多语言 Emoji 合集网站。

特性:
- 多语言路由：/en、/zh-hans、/zh-hant
- 分类浏览（A-J 主分类），Emoji 详情，搜索
- 数据来源：/src/data 目录 JSON 文件（primary 分类、各分类 Emoji 列表）
- SEO：动态 Metadata、sitemap、robots
- 交互：支持复制 Emoji/Unicode/Short Code/十进制

开发命令:
- 本地开发：npm run dev
- 类型检查：npm run type-check
- 构建：npm run build
- 运行：npm start
- Lint：npm run lint
- 测试：npm test

目录结构（关键部分）:
- src/app/[lang]/... 多语言页面
- src/app/lib/... 数据访问与工具
- src/app/ui/... 复用组件
- src/data/... JSON 数据
- .kiro/specs/... 需求/设计/任务文档

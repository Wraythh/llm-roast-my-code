<div align="center">

# 🔥 Roast My Code

**让 AI 用各种花式人格狠狠吐槽你的代码**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

*粘贴代码 → 选择人格 → 享受被吐槽的快乐*

</div>

---

## 这是什么？

一个纯粹为了好玩的 AI 代码吐槽网站。粘贴你（或同事）的代码，选择一个吐槽人格，AI 会用最毒/最搞笑的方式点评你的代码。

**内置人格：**

| 人格 | 风格 |
|------|------|
| 🗡️ 毒舌同事 | 技术精准但嘴巴毒辣的资深程序员 |
| 🌈 彩虹屁 PM | 满口"赋能""闭环""抓手"的项目经理 |
| 🎭 自定义 | 任意你能想到的人格（鲁迅、甄嬛、中二少年...） |

**亮点功能：**

- 🔥 **流式吐槽** — 逐字输出，沉浸式被骂体验
- 🎭 **自定义人格** — 创造你自己的吐槽风格，保存复用
- 📸 **分享图片** — 一键生成精美吐槽报告卡片
- 🏆 **排行榜** — "禁止编程指数"排名，看看谁的代码最烂
- 💻 **Monaco 编辑器** — VS Code 同款编辑器，支持语法高亮

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Wraythh/llm-roast-my-code.git
cd llm-roast-my-code
npm install
```

### 2. 配置 API Key

到 [智谱AI开放平台](https://open.bigmodel.cn/) 注册获取免费 API Key（GLM-4-Flash 免费无限量），然后：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 API Key：

```
ZHIPU_API_KEY=your_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开 http://localhost:3000 开始享受被吐槽的快乐！

## 技术栈

| 技术 | 用途 |
|------|------|
| [Next.js 15](https://nextjs.org/) | 全栈框架 (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [Tailwind CSS 4](https://tailwindcss.com/) | 样式 |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | 代码编辑器 |
| [智谱AI](https://open.bigmodel.cn/) | LLM API (GLM-4-Flash) |
| [html2canvas](https://html2canvas.hertzen.com/) | 分享图片生成 |

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── roast/route.ts          # 吐槽 API (SSE 流式)
│   │   └── leaderboard/route.ts    # 排行榜 API
│   ├── globals.css                 # 全局样式 (暗色主题)
│   ├── layout.tsx                  # 根布局
│   └── page.tsx                    # 主页面
├── components/
│   ├── PersonaSelector.tsx         # 人格选择器 (预设+自定义)
│   ├── RoastDisplay.tsx            # 吐槽结果展示
│   ├── ShareCard.tsx               # 分享图片弹窗
│   └── Leaderboard.tsx             # 排行榜抽屉
├── data/
│   └── personas.ts                 # 预设人格数据
├── lib/
│   └── db.ts                       # 内存排行榜存储
└── types/
    └── index.ts                    # TypeScript 类型
```

## License

MIT

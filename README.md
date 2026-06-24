# 硅谷崔哥和他的朋友们 · Silicon Valley AI Studio

> 扎根硅谷的 AI Agent 工作流团队。把想法，跑成产品。

一个为「硅谷崔哥和他的朋友们」打造的品牌官网——突出 **AI Agent 工作流**，
科技感与艺术感并存，让客户记得住、有好感。

## ✨ 亮点

- **沉浸式 Hero** — Canvas 实现的神经网络粒子场，随光标流动连线。
- **AI Agent 工作流可视化** — 交互式多智能体编排图（感知 → 规划 → 执行 → 协作 → 反馈），
  自动轮播、可点亮、悬停联动。
- **科技 + 艺术视觉** — 极光流动背景、玻璃拟态、网格、胶片颗粒、双向渐变。
- **完整内容板块** — 能力矩阵、合作流程时间线、「崔哥和他的朋友们」团队介绍、合作 CTA。
- **响应式 & 无障碍** — 移动端菜单、滚动揭示动画、`prefers-reduced-motion` 支持。
- **零构建** — 纯 HTML / CSS / 原生 JS，打开即用，部署即上线。

## 🗂 结构

```
.
├── index.html            # 单页站点
└── assets/
    ├── css/style.css     # 全部样式（主题、布局、动效）
    └── js/
        ├── hero.js       # Hero 神经网络粒子动画
        └── main.js       # 导航、滚动揭示、计数器、工作流交互图
```

## 🚀 本地预览

无需依赖，直接用任意静态服务器打开即可：

```bash
# 方式一：Python
python3 -m http.server 8080

# 方式二：Node
npx serve .
```

然后访问 http://localhost:8080 。

## 🌐 部署

任意静态托管均可一键上线：GitHub Pages、Vercel、Netlify、Cloudflare Pages 等。
将仓库根目录作为站点根目录发布即可。

## 🎨 设计语言

- 主色：电光青 `#00e5ff` → 紫罗兰 `#a855f7` → 品红 `#ec4899`
- 字体：Space Grotesk（展示）/ Noto Sans SC（正文）/ JetBrains Mono（点缀）
- 基调：深空黑底 + 极光辉光 + 玻璃质感

---

Made with AI Agents in Silicon Valley · © 硅谷崔哥和他的朋友们

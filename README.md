# Miniversal 迷你宇宙 · 太空主题儿童乐园咖啡馆

> 小小宇航员，出发！🚀 悉尼 Marrickville 的太空主题室内儿童乐园与咖啡馆。

一个为 **Miniversal Kids Cafe** 打造的斩杀级、强视觉冲击力的品牌官网——
深空主题、极致沉浸，让家长和孩子第一眼就记住这座「迷你宇宙」。
主题与内容参照原网站 [miniversal.com.au](https://www.miniversal.com.au/)。

## ✨ 视觉亮点

- **中英双语** — 导航栏一键切换 EN / 中文（默认英文），选择自动记忆（localStorage）。
- **动态星空 Hero** — Canvas 实现的多层视差星场，随光标流动，定时划过流星。
- **火箭发射场景** — SVG 火箭 + 喷焰、环带行星、卫星与闪烁星光，全程漂浮动效。
- **星尘球池氛围** — 漂浮的「球池」彩色光球、极光星云辉光、胶片颗粒质感。
- **完整内容板块** — 八大主题游乐区、咖啡馆补给舱、工作日/周末票价切换表、
  生日派对套餐、到访信息（地址 / 电话 / 适龄 / 营业时间）。
- **响应式 & 无障碍** — 移动端抽屉菜单、滚动揭示、数字滚动计数、`prefers-reduced-motion` 支持。
- **零构建** — 纯 HTML / CSS / 原生 JS，打开即用，部署即上线。

## 🗂 结构

```
.
├── index.html               # 单页站点
└── assets/
    ├── css/style.css        # 全部样式（深空主题、布局、动效）
    └── js/
        ├── starfield.js     # Canvas 星空 + 流星 + 视差
        ├── i18n.js          # EN/中文 双语切换（默认英文，记忆选择）
        └── main.js          # 导航、滚动揭示、计数器、票价切换、光球
```

## 🚀 本地预览

无需依赖，任意静态服务器即可：

```bash
python3 -m http.server 8080   # 或： npx serve .
```

然后访问 http://localhost:8080 。

## 📍 门店信息

- 地址：24–28 Murray St, Marrickville NSW 2204
- 电话：02 9390 3017
- 适龄：0–10 岁
- 6 个月以下宝宝免费；小朋友需穿防滑袜，家长入场需穿袜子（现场可购买）。

## 🎨 设计语言

- 主色：电光青 `#22d3ee` → 紫罗兰 `#a855f7` → 星尘粉 `#ff5da2`，点缀星光黄 `#ffd166`、橙 `#fb923c`、青柠 `#a3e635`
- 字体：Fredoka（圆润展示）/ Noto Sans SC（正文）/ Space Grotesk（英文点缀）
- 基调：深空黑底 + 星云辉光 + 玻璃质感 + 球池彩光

---

Made with ✦ for little astronauts · Miniversal Kids Cafe

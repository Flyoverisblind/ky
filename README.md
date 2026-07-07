<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/SQLite-3-blue?logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License">
</p>

# Kyai — 考研个人空间站

一个以古朴典雅水墨风格打造的考研个人网站，支持 Markdown 博客、学习进度追踪、任务看板与考试倒计时。

## 技术栈

| 类别 | 技术 |
|------|------|
| 后端 | Node.js + Express |
| 数据库 | SQLite (better-sqlite3) |
| 模板引擎 | EJS |
| Markdown | marked |
| 动画 | anime.js + 非线性贝塞尔曲线 |
| 字体 | Noto Serif SC + JetBrains Mono |

## 快速开始

```bash
git clone https://github.com/Flyoverisblind/ky.git
cd ky
npm install
npm start
```

浏览器打开 http://localhost:3000

## 项目结构

```
ky/
├── server.js                # Express 入口，路由 + API
├── db.js                    # SQLite 初始化 + 种子数据
├── package.json
├── routes/
│   ├── posts.js             # 博客 CRUD
│   ├── todos.js             # 任务看板
│   └── milestones.js        # 进度管理
├── views/
│   ├── home.ejs             # 首页
│   ├── blog.ejs             # 博客列表 + 标签云
│   ├── post.ejs             # 文章详情
│   ├── admin.ejs            # 后台
│   ├── 404.ejs
│   └── partials/
│       ├── head.ejs
│       ├── nav.ejs
│       └── footer.ejs
└── public/
    ├── css/
    │   └── style.css        # 全局样式 + 深色模式
    └── js/
        ├── app.js           # 主逻辑（背景/倒计时/快捷键/回到顶部）
        └── admin.js         # 后台 CRUD
```

## 功能

- **Markdown 博客** — 后台编写/编辑/删除，支持完整 GFM 语法
- **标签云** — 博客列表页按标签筛选，自动统计标签频次
- **阅读时长** — 文章详情自动计算预估阅读时间
- **学习进度** — 进度条可视化，支持增删进度项，滑块调节
- **任务看板** — 按科目分组，勾选完成、设置截止日期
- **考试倒计时** — 实时更新，数字弹性缩放动画
- **深色/浅色模式** — 一键切换，自动记忆偏好
- **回到顶部** — 带圆环进度条的滚动返回按钮
- **键盘快捷键** — `Ctrl+G` 首页 / `Ctrl+B` 博客 / `Ctrl+A` 后台 / `Ctrl+T` 切换主题 / `Ctrl+Esc` 回到顶部
- **水墨背景** — Canvas 墨晕漂移动画
- **非线性动画** — anime.js 驱动，spring / elastic / expo 多缓动曲线
- **响应式设计** — 适配桌面与移动端

## 设计风格

宣纸底色、朱砂红印、楷体排版、墨晕背景。以中式古典美学为基调，融入非线性动画，营造安静专注的备考氛围。

## 数据库

首次启动自动创建 `kyai.db` 并插入示例数据。删除 `kyai.db` 后重启可重置。

## License

MIT

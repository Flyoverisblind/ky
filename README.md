<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/SQLite-3-blue?logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License">
</p>

# Kyai — 考研个人空间站

一个为考研人打造的现代化个人网站，支持 Markdown 博客、学习进度追踪、任务看板和考试倒计时。采用非线性动画与赛博朋克风格的前卫 UI 设计。纯AI，零手搓！

## 截图

> 运行 `npm start` 后访问 http://localhost:3000 查看效果

## 技术栈

| 类别 | 技术 |
|------|------|
| 后端 | Node.js + Express |
| 数据库 | SQLite (better-sqlite3) |
| 模板引擎 | EJS |
| Markdown | marked |
| 动画 | anime.js + 非线性贝塞尔曲线 |
| 字体 | Noto Sans SC + JetBrains Mono |

## 快速开始

```bash
# 安装依赖
npm install

# 启动服务
npm start
```

浏览器打开 http://localhost:3000

## 项目结构

```
kyai/
├── server.js             # Express 主入口
├── db.js                 # 数据库初始化 + 种子数据
├── package.json
├── routes/
│   ├── posts.js          # 博客 CRUD API
│   ├── todos.js          # 任务看板 API
│   └── milestones.js     # 进度追踪 API
├── views/
│   ├── home.ejs          # 首页
│   ├── blog.ejs          # 博客列表
│   ├── post.ejs          # 文章详情
│   ├── admin.ejs         # 管理后台
│   ├── 404.ejs           # 404 页面
│   └── partials/         # 共用组件
│       ├── head.ejs
│       ├── nav.ejs
│       └── footer.ejs
└── public/
    ├── css/
    │   └── style.css     # 全局样式
    └── js/
        ├── app.js        # 前端主逻辑
        └── admin.js      # 后台管理逻辑
```

## 功能

- **Markdown 博客** —— 控制台编写、预览、编辑、删除，支持完整 Markdown 语法
- **学习进度** —— 进度条可视化，支持添加/删除进度项，滑块调节进度
- **任务看板** —— 按科目分组，勾选完成状态，设置截止日期
- **考试倒计时** —— 实时更新的考研倒计时，越接近越紧张
- **暗色/亮色切换** —— 一键切换主题，自动记忆偏好
- **粒子背景** —— Canvas 粒子连接动画，随鼠标交互
- **非线性动画** —— anime.js 驱动，spring / elastic / expo 多缓动曲线
- **响应式设计** —— 适配桌面与移动端

## 数据库

首次启动自动创建 `kyai.db`（SQLite），并插入示例数据：

- 3 篇博客文章（数学、英语、政治）
- 7 个学习任务
- 4 个进度里程碑
- 1 个考试日期（2026-12-26）

删除 `kyai.db` 后重启服务即可重置。

## 自定义

编辑 `db.js` 中的种子数据可修改初始内容。考试日期在 `db.js` 的 `exam_dates` 表中修改。
<img width="1910" height="873" alt="image" src="https://github.com/user-attachments/assets/efae8bd2-5078-4b83-a58f-82854f081bc0" />


const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'kyai.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    task TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    due_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    target INTEGER DEFAULT 100,
    color TEXT DEFAULT '#00f0ff',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS exam_dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_name TEXT NOT NULL,
    exam_date TEXT NOT NULL,
    color TEXT DEFAULT '#ff6b6b',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert seed data if empty
const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get();
if (postCount.count === 0) {
  const insert = db.prepare('INSERT INTO posts (title, slug, content, excerpt, tags) VALUES (?, ?, ?, ?, ?)');
  insert.run(
    '数学一复习攻略',
    'math-review-guide',
    `# 数学一复习攻略

## 高等数学

高等数学是考研数学一的重中之重，占比约 **56%**。以下是我的复习心得：

### 函数、极限、连续

- 掌握等价无穷小代换
- 洛必达法则的适用条件
- 泰勒公式展开到适当阶数

### 一元函数微分学

> 微分中值定理是高频考点，务必熟练掌握罗尔定理、拉格朗日中值定理和柯西中值定理。

### 一元函数积分学

\`\`\`python
# 常见积分技巧
def integration_tips():
    # 1. 凑微分法
    # 2. 换元积分法
    # 3. 分部积分法
    pass
\`\`\`

---

## 线性代数

线性代数占比约 **22%**，题目灵活但套路固定。

| 章节 | 重要程度 | 难度 |
|------|---------|------|
| 行列式 | ★★★ | ★★ |
| 矩阵 | ★★★★★ | ★★★ |
| 向量 | ★★★★ | ★★★★ |
| 线性方程组 | ★★★★★ | ★★★ |

## 概率论与数理统计

概率论占比约 **22%**，需要大量练习。

> 坚持每天做题，数学没有捷径！`,
    '数学一备考策略与心得，涵盖高数、线代、概率论的复习要点。',
    '数学,考研,复习'
  );

  insert.run(
    '英语学习笔记',
    'english-study-notes',
    `# 英语学习笔记

## 词汇

每天背诵 **100个** 单词，使用艾宾浩斯遗忘曲线复习。

### 高频词汇

1. **phenomenon** - 现象
2. **contemporary** - 当代的
3. **significant** - 重要的，显著的
4. **consequence** - 结果，后果
5. **ultimately** - 最终地

## 阅读理解技巧

### 五大题型

- [x] 细节题
- [x] 推断题
- [x] 主旨题
- [x] 词义题
- [x] 态度题

### 做题步骤

1. 先读题干，圈出关键词
2. 回原文定位
3. 对比选项，排除干扰项
4. 确认最佳答案

## 作文模板

> "As is vividly depicted in the picture..." —— 经典开头句式

\`\`\`
第一段：描述图画/图表
第二段：分析原因/影响
第三段：总结观点/提出建议
\`\`\`

## 翻译

- 长难句分析：找主干，拆从句
- 词性转换技巧
- 增词法与减词法`,
    '考研英语词汇、阅读、作文和翻译的学习方法与心得。',
    '英语,词汇,阅读,作文'
  );

  insert.run(
    '政治选择题技巧',
    'politics-mcq-skills',
    `# 政治选择题技巧

## 马原

### 两大特征
- **普遍联系** → 联系具有客观性、普遍性、多样性
- **永恒发展** → 发展的实质是新事物产生、旧事物灭亡

### 三大规律

1. **对立统一规律**（唯物辩证法的实质和核心）
2. **量变质变规律**
3. **否定之否定规律**

## 毛中特

### 新民主主义革命

| 时间 | 事件 | 意义 |
|------|------|------|
| 1919 | 五四运动 | 新民主主义革命的开端 |
| 1921 | 中共一大 | 中国共产党成立 |
| 1927 | 南昌起义 | 武装反抗国民党的第一枪 |

## 技巧总结

> 多选题中，**全选**的概率约占 1/3，遇到"必须""一定"等绝对化表述要警惕。

### 常见干扰项特征

- ❌ 绝对化表述（必须、一定、所有）
- ❌ 张冠李戴（A的理论归到B）
- ❌ 时态错误（已完成 → 正在进行）
- ✅ 辩证表述（既...又...）通常正确`,
    '考研政治选择题答题技巧，涵盖马原、毛中特等模块的知识点梳理。',
    '政治,选择题,技巧'
  );
}

const todoCount = db.prepare('SELECT COUNT(*) as count FROM todos').get();
if (todoCount.count === 0) {
  const insert = db.prepare('INSERT INTO todos (subject, task, completed, due_date) VALUES (?, ?, ?, ?)');
  insert.run('数学', '完成高数第三章习题', 1, '2026-07-10');
  insert.run('数学', '复习线性代数第二章', 0, '2026-07-12');
  insert.run('英语', '背诵Unit 15单词', 0, '2026-07-08');
  insert.run('英语', '做一套阅读理解真题', 0, '2026-07-09');
  insert.run('政治', '整理马原知识框架', 0, '2026-07-15');
  insert.run('专业课', '复习数据结构排序算法', 0, '2026-07-14');
  insert.run('专业课', '完成操作系统第三章笔记', 1, '2026-07-06');
}

const milestoneCount = db.prepare('SELECT COUNT(*) as count FROM milestones').get();
if (milestoneCount.count === 0) {
  const insert = db.prepare('INSERT INTO milestones (title, progress, target, color) VALUES (?, ?, ?, ?)');
  insert.run('高数复习进度', 65, 100, '#00f0ff');
  insert.run('英语词汇量', 4200, 5500, '#ff6b6b');
  insert.run('专业课背诵', 30, 100, '#ffd93d');
  insert.run('政治一轮', 40, 100, '#6bcb77');
}

const examCount = db.prepare('SELECT COUNT(*) as count FROM exam_dates').get();
if (examCount.count === 0) {
  const insert = db.prepare('INSERT INTO exam_dates (exam_name, exam_date, color) VALUES (?, ?, ?)');
  insert.run('2026考研初试', '2026-12-26', '#ff6b6b');
}

module.exports = db;

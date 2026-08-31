# 峡谷进阶（Rift Mastery）

一个面向长期 LOL 排位提升的中文训练系统。它不是攻略展示站，而是把每局排位转换为训练样本：记录对局 → 九维复盘 → 找出短板 → 生成下一局唯一训练目标 → 追踪长期趋势。

## MVP 已包含

- 训练总览：能力雷达、趋势、阶段目标、近期样本
- 三步对局复盘：基础信息、关键事件、九维自评与训练结论
- 九维评分：对线、兵线、地图意识、资源交换、团战、英雄熟练度、装备理解、阵容理解、稳定性
- 专项训练、英雄池与对位速查、五位置知识框架
- PostgreSQL/Prisma 完整数据模型与种子数据
- Auth.js GitHub 登录入口；未配置环境变量时可浏览示例档案
- 响应式桌面/移动界面

## 本地运行

需要 Node.js 20+ 与 PostgreSQL。

```bash
npm install
copy .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

打开 `http://localhost:3000`。如仅预览界面，可不配置数据库，直接运行 `npm run dev`。

## 环境变量

复制 `.env.example`。`DATABASE_URL` 是 PostgreSQL 连接串；`AUTH_SECRET` 可通过 `npx auth secret` 生成；GitHub OAuth 回调地址设为 `http://localhost:3000/api/auth/callback/github`，生产环境替换域名。

## 部署

推荐 Vercel + Neon/Supabase PostgreSQL：

1. 创建 PostgreSQL 数据库并取得连接串。
2. 在 Vercel 导入仓库，添加 `.env.example` 中的环境变量。
3. 将 GitHub OAuth 的生产回调地址设为 `https://你的域名/api/auth/callback/github`。
4. 首次部署前执行 `npx prisma migrate deploy`。开发期可用 `npx prisma db push`。

## 下一阶段

MVP 当前用前端示例数据展示体验，分析接口已位于 `/api/analyze`。下一迭代应把表单保存接到 Prisma、加入 Riot ID/手动战绩导入、基于个人历史基线计算动态评分，并补充知识条目编辑器与训练任务自动验收。

## 国服客户端同步

线上站点无法直接访问你电脑上的英雄联盟客户端，因此项目提供了仅监听本机地址的 Windows 同步助手：

1. 启动并登录国服英雄联盟客户端。
2. 双击项目根目录的 `start-companion.cmd`，在 Windows 权限提示中选择“是”。
3. 打开线上站点的“战绩同步”页面，看到“助手已连接”后点击“一键同步”。

本地开发时也可以在另一个终端执行 `npm run sync:lcu`。

同步助手只读取本机 LCU 的当前召唤师与最近 20 局数据。客户端临时认证令牌不会写入磁盘，也不会发送给 Web 服务。助手只接受配置过的站点来源，并通过 `RIFT_MASTERY_URL` 与 `RIFT_SYNC_TOKEN` 安全地把战绩上传到站点。

如果访问 Cloudflare 需要本机代理，可在 `.env.local` 设置 `RIFT_PROXY_URL`；示例使用 `http://127.0.0.1:7892`。

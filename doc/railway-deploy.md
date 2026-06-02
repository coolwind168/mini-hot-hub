# Railway 部署指南

## 一、Railway 简介

Railway 是一个一站式全栈 PaaS 部署平台，主打后端服务、常驻程序、数据库、全栈项目轻量化部署。支持几乎所有开发语言和项目类型，是个人开发者、小型项目后端上线的最优解之一。

**核心特性**：
- 全语言兼容 + 常驻服务
- 一体化服务能力（数据库、环境变量、日志监控）
- 自动 HTTPS + 公网域名
- 极简运维、低门槛

---

## 二、从根目录启动 Server

Railway 默认从项目根目录启动服务。由于本项目采用前后端分离架构，需要特别配置后端服务的启动路径。

### 1. Railway 启动配置

Railway 会自动检测项目类型并尝试启动。对于 Node.js 项目，Railway 默认查找：
- `package.json` 中的 `start` 或 `main` 字段
- 或直接执行 `npm start`

由于后端代码在 `server/` 目录下，需要配置 Railway 从该目录启动。

### 2. 配置方式

#### 方式一：使用 Railway CLI（推荐）

Railway CLI 允许你在部署前指定工作目录：

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 初始化项目
railway init

# 指定 server 目录并部署
cd server
railway up
```

#### 方式二：修改根目录 package.json

在根目录的 `package.json` 中添加 Railway 特定的启动命令：

```json
{
  "name": "mini-hot-hub",
  "scripts": {
    "railway:up": "cd server && railway up"
  }
}
```

#### 方式三：创建 Railway 配置文件

在项目根目录创建 `railway.json`：

```json
{
  "build": {
    "builder": "NIXPACKS",
    "config": {
      "nixpacks": {
        "phases": {
          "setup": {
            "nixpkgs": ["nodejs_20"]
          }
        }
      }
    }
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 三、环境变量配置

在 Railway 项目的 Settings → Variables 中配置以下环境变量：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | 3001 | 后端服务端口（Railway 会自动覆盖） |
| `CACHE_TTL` | 600 | 缓存过期时间（秒） |

**注意**：Railway 会自动设置 `PORT` 环境变量，应用程序需要监听 Railway 提供的端口。

---

## 四、后端代码适配

确保 `server/src/index.ts` 正确读取端口配置：

```typescript
const PORT = parseInt(process.env.PORT || '3001', 10)

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
```

---

## 五、部署步骤

### 1. 准备阶段

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录 Railway
railway login

# 验证登录
railway whoami
```

### 2. 部署后端

```bash
# 进入 server 目录
cd server

# 初始化 Railway 项目（如果尚未初始化）
railway init

# 部署到 Railway
railway up
```

### 3. 配置环境变量

在 Railway Dashboard 中：
1. 进入部署的项目
2. 点击 Settings → Variables
3. 添加必要的环境变量（如 `CACHE_TTL=600`）

### 4. 验证部署

```bash
# 打开 Railway 提供的公网地址
railway open
```

---

## 六、常见问题

### Q1: Railway 提示找不到 `package.json`

**原因**：Railway 默认从根目录查找 `package.json`。

**解决方案**：确保在 `server/` 目录执行 `railway up`，或配置 Railway 工作目录。

### Q2: 端口监听错误

**原因**：未正确读取 `process.env.PORT`。

**解决方案**：
```typescript
const PORT = parseInt(process.env.PORT || '3001', 10)
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
```

### Q3: 依赖安装失败

**原因**：`server/` 目录缺少依赖。

**解决方案**：
```bash
cd server
npm install
railway up
```

### Q4: 构建超时

**原因**：依赖安装或构建时间过长。

**解决方案**：
- 使用 Railway Pro 提高构建资源
- 优化 `package.json` 中的依赖

---

## 七、本地开发与部署对照

| 操作 | 本地开发 | Railway 部署 |
|------|----------|--------------|
| 安装依赖 | `npm run install:all` | `cd server && npm install` |
| 启动后端 | `npm run dev:server` | `railway up` |
| 端口 | 3001 | 由 Railway 分配 |
| 环境变量 | `.env` 文件 | Railway Dashboard |

---

## 八、相关文档

- [Railway 官方文档](https://docs.railway.app/)
- [Railway CLI 文档](https://docs.railway.app/cli)
- [部署前检查表](./checklist.md)
- [开发经验总结](./experience.md)
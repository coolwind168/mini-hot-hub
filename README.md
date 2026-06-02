# Mini Hot Hub

一个聚合多个平台热门股票数据的 Web 应用。

## 功能特性

- 聚合东方财富、同花顺、特特网三大平台热门股票数据
- 支持 loading、error、success 三种状态展示
- **牛散名称显示**：股票旁边显示关联的牛散姓名（紫色标签）
- 响应式布局，支持移动端

## 技术栈

- **前端**: React + TypeScript + Vite
- **后端**: Node.js + Express + TypeScript
- **样式**: TailwindCSS 3

## 安装依赖

### 安装前端依赖

```bash
cd client
npm install
```

### 安装后端依赖

```bash
cd server
npm install
```

### 同时安装所有依赖（Windows PowerShell）

```powershell
cd client; npm install; cd ../server; npm install
```

## 启动应用

### 方式一：分别启动（开发推荐）

**终端 1 - 启动后端**:

```bash
cd server
npm run dev
```

后端服务运行在: http://localhost:3001

**终端 2 - 启动前端**:

```bash
cd client
npm run dev
```

前端应用运行在: http://localhost:5173

### 方式二：使用 npm-run-all（需要安装）

```bash
# 安装并行运行工具
npm install -g npm-run-all

# 在项目根目录运行
npm-run-all -p "npm run dev --prefix server" "npm run dev --prefix client"
```

### 方式三：从根目录一键启动（推荐）

```bash
npm run dev
```

这将使用 `concurrently` 同时启动前端和后端服务。

**可用命令**：

| 命令 | 说明 |
|------|------|
| `npm run dev` | 同时启动前后端 |
| `npm run dev:client` | 仅启动前端 |
| `npm run dev:server` | 仅启动后端 |
| `npm run build` | 构建前端 |
| `npm run install:all` | 安装所有依赖 |

## 项目结构

```
mini-hot-hub/
├── client/              # 前端应用
│   ├── src/
│   │   ├── components/  # 组件
│   │   ├── hooks/       # 自定义 hooks
│   │   ├── api/         # API 调用
│   │   ├── types/       # TypeScript 类型定义
│   │   └── pages/       # 页面
│   ├── mock/            # Mock 数据
│   └── vite.config.ts   # Vite 配置
├── server/              # 后端服务
│   └── src/
│       ├── services/    # 数据服务（东方财富、同花顺、特特网）
│       ├── utils/       # 工具函数（缓存）
│       └── index.ts     # Express 服务器入口
├── doc/                 # 文档
└── README.md
```

## 接口文档

### 获取所有平台数据

```
GET /api/hot
```

响应示例：
```json
{
  "platforms": [
    {
      "source": "eastmoney",
      "sourceName": "东方财富",
      "listType": "stock",
      "listTypeName": "热门股票",
      "updatedAt": "2026-05-31T07:36:21.644Z",
      "items": [...]
    }
  ]
}
```

### 获取指定平台数据

```
GET /api/hot/{source}
```

支持的 source：
- `dongfangcaifu` - 东方财富
- `tonghuashun` - 同花顺
- `tetewang` - 特特网

## 数据来源说明

### 各平台数据获取方式

本项目通过各平台公开的 JSON 接口获取数据，具体如下：

| 平台 | 数据源 | 接口地址 | 数据类型 |
|------|--------|----------|----------|
| 东方财富 | 涨幅榜 | `https://push2.eastmoney.com/api/qt/clist/get` | 股票涨幅榜（前10条） |
| 同花顺 | 热门股票 | `https://dq.10jqka.com.cn/fuyao/hot_list_data/out/hot_list/v1/stock` | 小时级热门股票榜（前10条） |
| 特特网 | 牛散持仓 | 模拟数据（未找到公开 API） | 热门股票 + 牛散信息 |

**数据解析字段说明**：

- **东方财富**: `diff[].f14`（股票名称）、`diff[].f12`（代码）、`diff[].f3`（涨跌幅）
- **同花顺**: `stock_list[].name`（股票名称）、`stock_list[].code`（代码）、`stock_list[].rise_and_fall`（涨跌幅）
- **特特网**: 模拟数据，包含牛散姓名（bullName）字段

**牛散名称显示说明**：

- 牛散名称以紫色标签形式显示在股票名称旁边
- 数据来源：特特网模拟数据（真实牛散姓名）
- 显示位置：股票标题右侧，可点击高亮
- 样式特点：紫色背景、圆角边框、hover 效果

### 更新频率（缓存 TTL）

后端使用内存缓存减少重复请求，缓存策略如下：

- **默认 TTL**: 600 秒（10 分钟）
- **环境变量**: 可通过 `CACHE_TTL` 自定义缓存时间
- **强制刷新**: 添加 `?refresh=1` 参数可跳过缓存

```bash
# 设置缓存时间为 5 分钟
CACHE_TTL=300 npm run dev
```

**缓存机制说明**：

1. 首次请求 → 抓取源站数据 → 写入缓存 → 返回数据
2. 缓存期内请求 → 直接返回缓存数据（日志显示 `[cache hit]`）
3. 缓存过期 → 重新抓取源站 → 更新缓存
4. 强制刷新 → 跳过缓存，直接抓取最新数据

### 开发环境模拟失败开关

为方便测试前端 error 状态展示，后端支持以下环境变量开关：

| 环境变量 | 平台 | 作用 |
|----------|------|------|
| `MOCK_FAIL_DONGFANGCAIFU=1` | 东方财富 | 模拟服务失败 |
| `MOCK_FAIL_TONGHUASHUN=1` | 同花顺 | 模拟服务失败 |
| `MOCK_FAIL_TETEWANG=1` | 特特网 | 模拟服务失败 |

**使用示例**：

```bash
# 模拟东方财富服务失败
MOCK_FAIL_DONGFANGCAIFU=1 npm run dev

# 模拟多个平台失败
MOCK_FAIL_DONGFANGCAIFU=1 MOCK_FAIL_TONGHUASHUN=1 npm run dev
```

**测试流程**：

1. 设置环境变量启动后端
2. 前端页面会显示对应平台的 error 卡片
3. 可测试「点击重试」功能
4. 关闭环境变量重启即可恢复正常

### 学习项目免责声明

**重要声明**：

1. **本项目仅供学习交流使用**，不构成任何投资建议或推荐。

2. **数据来源**：所有数据均来自各平台公开接口，本项目仅做数据聚合展示，不存储、不修改原始数据。

3. **数据准确性**：本项目不对数据的准确性、完整性、及时性做任何保证，数据可能存在延迟或错误。

4. **非商业用途**：本项目仅用于技术学习和演示，严禁用于任何商业用途。

5. **投资风险**：股市有风险，投资需谨慎。任何依据本项目数据做出的投资决策，风险自担。

6. **合规声明**：
   - 仅爬取公开数据，不破解付费接口
   - 不存储用户隐私与敏感数据
   - 严格遵守各平台的使用条款和 robots.txt 规则
   - 如有侵权，请联系作者删除

**联系方式**：如有问题或建议，请通过 GitHub Issues 反馈。

---

## 常见问题

### 端口占用问题

**问题**: 启动时提示端口 3001 或 5173 已被占用

**解决方案**:

1. **查找占用端口的进程（Windows）**:

```powershell
# 查找端口 3001
netstat -ano | findstr :3001

# 查找端口 5173
netstat -ano | findstr :5173
```

2. **杀死占用进程**:

```powershell
# 将 <PID> 替换为实际的进程 ID
taskkill /F /PID <PID>
```

3. **或修改端口配置**:

- 后端：修改 `server/src/index.ts` 中的 `PORT` 常量
- 前端：修改 `client/vite.config.ts` 中的服务器端口

### 代理不生效

**问题**: 前端无法访问后端 API，提示 502 或 404 错误

**解决方案**:

1. **确保后端服务已启动**:
   - 检查终端是否显示 `Server listening on http://localhost:3001`
   - 直接访问 http://localhost:3001/api/health 确认后端正常运行

2. **检查代理配置**:
   - 确认 `client/vite.config.ts` 中已配置代理：
   ```typescript
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:3001',
         changeOrigin: true,
       },
     },
   }
   ```

3. **重启前端开发服务器**:
   - 修改 `vite.config.ts` 后需要重启前端才能生效

4. **检查 CORS 配置**:
   - 后端已配置允许 `http://localhost:5173` 跨域访问

### 前端显示空白

**问题**: 页面加载后显示空白

**解决方案**:

1. **检查浏览器控制台**:
   - 按 F12 打开开发者工具，查看 Console 面板是否有错误

2. **检查网络请求**:
   - 在 Network 面板查看 `/api/hot` 请求是否成功

3. **确认 mock 数据格式正确**:
   - 检查 `client/mock/hot.json` 格式是否符合 `HotMockData` 类型定义

---

## 部署

### 开发环境快速启动

从项目根目录一键启动前后端：

```bash
npm run dev
```

这将使用 `concurrently` 同时启动前端和后端服务。

**可用命令**：

| 命令 | 说明 |
|------|------|
| `npm run dev` | 同时启动前后端 |
| `npm run dev:client` | 仅启动前端 |
| `npm run dev:server` | 仅启动后端 |
| `npm run build` | 构建前端 |
| `npm run install:all` | 安装所有依赖 |

---

### 生产环境部署

#### 1. 前端部署（推荐 Vercel）

**特点**：
- 零配置自动化部署
- 默认 HTTPS + 全球 CDN
- 与 GitHub 深度集成，提交代码自动部署

**部署步骤**：

1. 将代码推送到 GitHub 仓库
2. 登录 [Vercel](https://vercel.com)
3. 点击 "Import Project"，选择 GitHub 仓库
4. Vercel 会自动检测 Next.js/Vite 项目
5. 配置环境变量（如需要）：
   - `VITE_API_BASE`: 后端 API 地址（如 `https://your-backend.railway.app`）
6. 点击 Deploy

**构建命令**：
```bash
npm run build
```

**输出目录**：`client/dist`

---

#### 2. 后端部署（推荐 Railway）

**特点**：
- 支持常驻服务，无 Serverless 超时限制
- 自动 HTTPS + 公网域名
- 支持环境变量配置

**部署步骤**：

**方式一：使用 Railway CLI（推荐）**

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 进入 server 目录
cd server

# 初始化项目（如果尚未初始化）
railway init

# 部署到 Railway
railway up
```

**方式二：直接在 Railway Dashboard 操作**

1. 登录 [Railway](https://railway.app)
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择仓库后，点击 "Configure" → "Root Directory"
4. 设置为 `/server`
5. Railway 会自动检测 Node.js 项目并部署

**环境变量配置**：

在 Railway Dashboard → Settings → Variables 中配置：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `CACHE_TTL` | 600 | 缓存过期时间（秒） |
| `PORT` | 3001 | 服务端口（由 Railway 自动设置） |

**后端端口配置**：

Railway 会自动设置 `PORT` 环境变量，代码中需正确读取：

```typescript
const PORT = parseInt(process.env.PORT || '3001', 10)
```

**验证部署**：

```bash
# 查看 Railway 提供的公网地址
railway domain

# 或在浏览器中访问 Railway 提供的域名
```

---

#### 3. 部署检查清单

- [ ] 前端构建成功（`npm run build`）
- [ ] 后端依赖安装完成（`cd server && npm install`）
- [ ] 环境变量配置正确
- [ ] 端口无冲突
- [ ] CORS 配置允许生产域名
- [ ] API 地址配置正确
- [ ] 测试环境验证通过

详细检查项请参考 [doc/checklist.md](doc/checklist.md)

---

#### 4. 常见问题

**Q: Railway 提示找不到 package.json**

A: 确保在 `server/` 目录执行 `railway up`，或配置 Railway 工作目录。

**Q: 前端无法请求后端 API**

A: 检查以下配置：
1. 后端 CORS 是否允许前端域名
2. 前端 `VITE_API_BASE` 是否指向正确的后端地址
3. 确认 Railway 提供的域名可访问

**Q: 数据不更新**

A:
- 检查缓存 TTL 设置（默认 600 秒）
- 添加 `?refresh=1` 参数强制刷新
- 查看后端日志确认缓存命中情况

详细文档请参考：
- [doc/checklist.md](doc/checklist.md) - 部署前检查表
- [doc/experience.md](doc/experience.md) - 开发经验总结
- [doc/railway-deploy.md](doc/railway-deploy.md) - Railway 详细部署指南

## 许可证

MIT License

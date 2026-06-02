# 部署前检查表

## 项目概览

本项目是一个股票热榜聚合应用，包含前端（React + Vite）和后端（Node.js + Express）两部分。

---

## 一、端口配置检查

| 服务 | 默认端口 | 环境变量 | 检查项 | 状态 |
|------|----------|----------|--------|------|
| 前端开发服务器 | 5173 | `PORT` | 端口是否被占用 | ▢ |
| 后端 API 服务 | 3001 | `PORT` | 端口是否被占用 | ▢ |
| 前端生产构建 | - | - | 构建是否成功 | ▢ |

### 端口占用检查命令

```bash
# Linux/Mac
lsof -i :3001
lsof -i :5173

# Windows PowerShell
netstat -ano | findstr :3001
netstat -ano | findstr :5173
```

---

## 二、环境变量配置检查

### 后端环境变量（server/.env）

| 变量名 | 默认值 | 说明 | 必需 | 检查 |
|--------|--------|------|------|------|
| `PORT` | 3001 | 后端服务端口 | 否 | ▢ |
| `CACHE_TTL` | 600 | 缓存过期时间（秒） | 否 | ▢ |
| `MOCK_FAIL_DONGFANGCAIFU` | - | 模拟东方财富失败（开发用） | 否 | ▢ |
| `MOCK_FAIL_TONGHUASHUN` | - | 模拟同花顺失败（开发用） | 否 | ▢ |
| `MOCK_FAIL_TETEWANG` | - | 模拟特特网失败（开发用） | 否 | ▢ |

### 前端环境变量（client/.env）

| 变量名 | 默认值 | 说明 | 必需 | 检查 |
|--------|--------|------|------|------|
| `VITE_API_BASE` | /api | API 请求基础路径 | 否 | ▢ |
| `VITE_CACHE_TTL` | 600 | 缓存更新频率（秒） | 否 | ▢ |

---

## 三、API 地址配置检查

### 开发环境

| API 路径 | 目标地址 | 检查项 | 状态 |
|----------|----------|--------|------|
| `/api/hot` | http://localhost:3001/api/hot | 全量热榜数据 | ▢ |
| `/api/hot/dongfangcaifu` | http://localhost:3001/api/hot/dongfangcaifu | 东方财富热榜 | ▢ |
| `/api/hot/tonghuashun` | http://localhost:3001/api/hot/tonghuashun | 同花顺热榜 | ▢ |
| `/api/hot/tetewang` | http://localhost:3001/api/hot/tetewang | 特特网热榜 | ▢ |

### 生产环境

| 配置项 | 说明 | 检查项 | 状态 |
|--------|------|--------|------|
| 前端 Vite 代理 | 是否已移除或配置正确 | ▢ |
| 后端 CORS 配置 | 是否允许生产域名 | ▢ |
| API 域名 | 是否配置正确（如 `https://api.example.com`） | ▢ |

---

## 四、构建检查

### 前端构建

```bash
cd client
npm run build
```

检查项：
- ✅ 构建无错误
- ✅ dist 目录生成正常
- ✅ 资源文件（CSS、JS、图片）完整
- ✅ index.html 正确引用资源

### 后端依赖

```bash
cd server
npm install
```

检查项：
- ✅ 依赖安装无错误
- ✅ `tsx` 可用（开发模式）
- ✅ `tsc` 可用（生产构建）

---

## 五、服务启动检查

### 开发模式

```bash
# 终端1 - 启动后端
cd server
npm run dev

# 终端2 - 启动前端
cd client
npm run dev
```

验证：
- ✅ 后端日志显示 `Server listening on http://localhost:3001`
- ✅ 前端日志显示 `VITE ready in X ms`
- ✅ 访问 http://localhost:5173 显示正常

### 生产模式

```bash
# 构建前端
cd client
npm run build

# 启动后端（使用 pm2 或类似工具）
cd server
npm start
```

验证：
- ✅ 后端服务稳定运行
- ✅ 前端静态资源可访问
- ✅ API 接口返回正常

---

## 六、功能验证清单

| 功能 | 验证步骤 | 状态 |
|------|----------|------|
| 首页加载 | 访问首页，等待数据加载 | ▢ |
| 东方财富数据 | 确认显示真实涨幅榜数据 | ▢ |
| 同花顺数据 | 确认显示热门股票数据 | ▢ |
| 特特网数据 | 确认显示牛散持仓数据 | ▢ |
| 火苗图标 | 前三名股票显示对应数量火苗 | ▢ |
| 牛散标签 | 特特网股票显示牛散姓名 | ▢ |
| 刷新按钮 | 点击刷新，数据重新加载 | ▢ |
| 错误处理 | 模拟失败开关验证错误卡片 | ▢ |
| 更新时间 | 显示「X分钟前」格式 | ▢ |

---

## 七、常见问题排查

### 端口占用

```bash
# Windows - 查找并杀死占用进程
netstat -ano | findstr :3001
taskkill /F /PID <PID>

# Linux/Mac
kill -9 $(lsof -ti:3001)
```

### 代理不生效

- 确认 `vite.config.ts` 中 proxy 配置正确
- 重启前端开发服务器
- 检查浏览器控制台是否有跨域错误

### 数据不更新

- 检查缓存 TTL 设置
- 添加 `?refresh=1` 参数强制刷新
- 检查后端日志确认缓存命中情况

---

## 八、部署清单

- [ ] 前端构建完成
- [ ] 后端依赖安装完成
- [ ] 环境变量配置正确
- [ ] 端口无冲突
- [ ] CORS 配置允许生产域名
- [ ] API 地址配置正确
- [ ] 测试环境验证通过
- [ ] 监控告警配置完成
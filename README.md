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
│       └── index.ts     # Express 服务器入口
└── TECH_DESIGN.md       # 技术设计文档
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

## 生产环境部署

### 构建前端

```bash
cd client
npm run build
```

### 设置环境变量

前端使用 `VITE_API_BASE` 环境变量指定后端地址：

```bash
# Linux/macOS
export VITE_API_BASE=https://your-backend-domain.com

# Windows PowerShell
$env:VITE_API_BASE="https://your-backend-domain.com"
```

## 许可证

MIT License
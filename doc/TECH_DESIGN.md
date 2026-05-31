# A股热门题材/牛散持仓聚合网站 - 技术设计与架构

## 1. 技术栈（强制）
- 前端：React + TypeScript + Vite + CSS / CSS Modules
- 后端：Node.js + Express
- 数据来源：东方财富、同花顺、特特网（公开接口/页面解析）
- 缓存：内存 Map，按「平台+榜单类型」独立缓存
- 部署：前端 Vercel，后端 Railway，公网 HTTPS 访问
- 约束：后端中转请求，前端绝不直连源站

## 2. 项目结构
a-stock-hot-hub/
├── client/                # 前端
│   ├── src/
│   │   ├── components/    # HotCard、TabSwitch、BullDetail、Layout
│   │   ├── api/           # 前端请求封装
│   │   ├── types/         # TS 类型定义
│   │   ├── hooks/         # 数据获取、缓存时间格式化
│   │   └── utils/         # 工具函数
├── server/                # 后端
│   ├── routes/            # hot.ts、bull.ts
│   ├── services/          # eastmoney、10jqka、tetewang 数据解析
│   ├── utils/             # cache、request、logger
│   └── config/            # TTL、请求频率配置
└── README.md

## 3. 数据模型（TypeScript）
### 3.1 StockHotItem
interface StockHotItem {
  rank: number
  title: string
  code?: string
  change?: string
  heat?: string
  url: string
  bullName?: string      // 关联牛散姓名（可选）
  ratio?: string         // 持仓占比（牛散页用）
  trend?: string         // 变动趋势（牛散页用）
}

### 3.2 PlatformHotResponse
interface PlatformHotResponse {
  source: 'eastmoney' | '10jqka' | 'tetewang'
  sourceName: string
  listType: 'theme' | 'stock' | 'bull'
  listTypeName: string
  updatedAt: string      // ISO 时间
  items: StockHotItem[]
  error?: boolean
  message?: string
}

### 3.3 BullDetailResponse
interface BullDetailResponse {
  name: string
  intro?: string
  updatedAt: string
  holdings: StockHotItem[]
  error?: boolean
  message?: string
}

## 4. 后端接口（必须实现）
1. 获取单平台榜单
GET /api/hot/:source/:type
- source: eastmoney / 10jqka / tetewang
- type: theme / stock / bull

2. 获取牛散详情与持仓
GET /api/bull/:name
- 数据源：特特网

3. 批量全平台（可选）
GET /api/hot/all

## 5. 缓存策略
- 缓存键：`${source}:${type}`
- TTL：5～10 分钟（300～600s）
- 异常/失败/限流：使用缓存兜底，不返回 Mock
- 前端展示：更新于 X 分钟前

## 6. 核心流程
1. 首页加载 → 请求 /api/hot/all
2. 后端检查缓存 → 命中直接返回
3. 未命中 → 抓取源站 → 解析 → 写入缓存 → 返回
4. 榜单切换 → 请求对应 /api/hot/:source/:type
5. 点击牛散 → 请求 /api/bull/:name → 进入站内详情页
6. 单平台失败 → 仅该卡片报错，不影响全局

## 7. 异常处理
- 单个平台/榜单加载失败不影响其他卡片
- 无牛散关联时不显示标签
- 请求失败重试 1 次，仍失败走缓存
- 严格控制请求频率，避免源站风控

## 8. 前端布局要求
- 桌面：3 列卡片网格
- 移动端：1 列
- 排名 1～3 可视觉强调
- 股票右侧高亮可点击牛散姓名
- 页脚固定合规声明

## 9. 合规约束
- 仅爬公开数据，不破解付费接口
- 不存储用户隐私与敏感数据
- 页脚必须标注：非投资建议、仅供学习、非商用
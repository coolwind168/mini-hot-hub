/** 数据来源平台 */
export type HotPlatform = 'eastmoney' | '10jqka' | 'tetewang'

/** 榜单类型 */
export type HotListType = 'theme' | 'stock' | 'bull'

/** 平台中文名 */
export const HOT_PLATFORM_LABELS: Record<HotPlatform, string> = {
  eastmoney: '东方财富',
  '10jqka': '同花顺',
  tetewang: '特特网',
}

/** 榜单类型中文名 */
export const HOT_LIST_TYPE_LABELS: Record<HotListType, string> = {
  theme: '热门题材',
  stock: '热门股票',
  bull: '牛散持仓',
}

/** 单条热门/持仓数据（与 TECH_DESIGN StockHotItem 对齐） */
export interface HotItem {
  rank: number
  title: string
  code?: string
  change?: string
  heat?: string
  url: string
  bullName?: string
  ratio?: string
  trend?: string
}

/** 单平台榜单响应 */
export interface PlatformHotResponse {
  source: HotPlatform
  sourceName: string
  listType: HotListType
  listTypeName: string
  updatedAt: string
  items: HotItem[]
  error?: boolean
  message?: string
}

/** mock/hot.json 根结构 */
export interface HotMockData {
  platforms: PlatformHotResponse[]
}

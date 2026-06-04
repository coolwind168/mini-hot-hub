/** 数据来源平台 */
export type HotPlatform = 'eastmoney' | '10jqka' | 'tetewang'

/** 榜单类型 */
export type HotListType = 'theme' | 'stock' | 'bull'

/** 单条热门/持仓数据 */
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

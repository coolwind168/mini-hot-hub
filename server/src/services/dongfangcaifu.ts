import type { HotItem, PlatformHotResponse } from '../types/hot.js'

/**
 * 东方财富热搜数据服务
 *
 * API: https://push2.eastmoney.com/api/qt/clist/get
 * 说明: 涨幅榜股票数据
 *
 * 解析字段说明（方便日后接口变更时修改）：
 *   diff[].f2  → item.change     // 当前价
 *   diff[].f3  → item.changePercent  // 涨跌幅
 *   diff[].f12 → item.code      // 股票代码
 *   diff[].f14 → item.title     // 股票名称
 *   diff[].f62 → item.volume     // 成交量
 */

const API_URL = 'https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=10&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m%3A0%2Bt%3A6%2Cm%3A0%2Bt%3A13%2Cm%3A0%2Bt%3A80%2Cm%3A1%2Bt%3A2%2Cm%3A1%2Bt%3A23&fields=f2%2Cf3%2Cf4%2Cf8%2Cf12%2Cf14%2Cf15%2Cf16%2Cf17%2Cf18%2Cf20%2Cf21%2Cf62%2Cf128%2Cf136%2Cf140%2Cf141%2Cf136'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://www.eastmoney.com/',
  'Accept': 'application/json',
}

interface DongfangcaifuStockItem {
  f12: string
  f14: string
  f3: number
}

interface DongfangcaifuResponse {
  data?: {
    diff?: DongfangcaifuStockItem[]
  }
}

export async function fetchDongfangcaifuHot(): Promise<PlatformHotResponse> {
  try {
    // 开发环境模拟失败开关
    if (process.env.MOCK_FAIL_DONGFANGCAIFU === '1') {
      throw new Error('模拟东方财富服务失败')
    }

    const response = await fetch(API_URL, { headers: HEADERS })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const json: DongfangcaifuResponse = await response.json()
    const diff = json?.data?.diff || []

    const items: HotItem[] = diff.slice(0, 10).map((item, index) => ({
      rank: index + 1,
      title: item.f14,
      code: item.f12,
      change: `${item.f3 > 0 ? '+' : ''}${item.f3.toFixed(2)}%`,
      url: `https://quote.eastmoney.com/${item.f12.startsWith('6') ? 'sh' : 'sz'}${item.f12}.html`,
    }))

    return {
      source: 'eastmoney',
      sourceName: '东方财富',
      listType: 'stock',
      listTypeName: '热门股票',
      items,
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`东方财富数据获取失败: ${error.message}`)
    }
    throw new Error('东方财富数据获取失败: 未知错误')
  }
}

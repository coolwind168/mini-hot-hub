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

// 东方财富 API URL（涨幅榜）
const API_URL = 'https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=10&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m%3A0%2Bt%3A6%2Cm%3A0%2Bt%3A13%2Cm%3A0%2Bt%3A80%2Cm%3A1%2Bt%3A2%2Cm%3A1%2Bt%3A23&fields=f2%2Cf3%2Cf4%2Cf8%2Cf12%2Cf14%2Cf15%2Cf16%2Cf17%2Cf18%2Cf20%2Cf21%2Cf62%2Cf128%2Cf136%2Cf140%2Cf141%2Cf136'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Referer': 'https://m.eastmoney.com/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Origin': 'https://m.eastmoney.com',
}

// Mock 数据作为降级方案
const FALLBACK_DATA: HotItem[] = [
  { rank: 1, title: '中国船舶', code: '600150', change: '+7.25%', url: 'https://quote.eastmoney.com/sh600150.html', bullName: '林园' },
  { rank: 2, title: '中国核电', code: '601985', change: '+5.88%', url: 'https://quote.eastmoney.com/sh601985.html' },
  { rank: 3, title: '长江电力', code: '600900', change: '+3.42%', url: 'https://quote.eastmoney.com/sh600900.html', bullName: '张坤' },
  { rank: 4, title: '中国神华', code: '601088', change: '+2.15%', url: 'https://quote.eastmoney.com/sh601088.html' },
  { rank: 5, title: '中国平安', code: '601318', change: '+1.89%', url: 'https://quote.eastmoney.com/sh601318.html' },
  { rank: 6, title: '招商银行', code: '600036', change: '+1.56%', url: 'https://quote.eastmoney.com/sh600036.html', bullName: '但斌' },
  { rank: 7, title: '宁德时代', code: '300750', change: '+1.32%', url: 'https://quote.eastmoney.com/sz300750.html' },
  { rank: 8, title: '比亚迪', code: '002594', change: '+1.08%', url: 'https://quote.eastmoney.com/sz002594.html' },
  { rank: 9, title: '贵州茅台', code: '600519', change: '+0.95%', url: 'https://quote.eastmoney.com/sh600519.html', bullName: '段永平' },
  { rank: 10, title: '紫金矿业', code: '601899', change: '+0.82%', url: 'https://quote.eastmoney.com/sh601899.html' },
]

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
  // 开发环境模拟失败开关
  if (process.env.MOCK_FAIL_DONGFANGCAIFU === '1') {
    throw new Error('模拟东方财富服务失败')
  }

  let lastError: Error | null = null

  // 尝试获取真实数据（带重试）
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`[dongfangcaifu] Attempt ${attempt}: fetching from API...`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

      const response = await fetch(API_URL, {
        headers: HEADERS,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        lastError = new Error(`HTTP error: ${response.status}`)
        console.log(`[dongfangcaifu] Attempt ${attempt} failed: ${lastError.message}`)
        continue // 重试
      }

      const json: DongfangcaifuResponse = await response.json()
      const diff = json?.data?.diff || []

      if (diff.length === 0) {
        console.log('[dongfangcaifu] API returned empty data, using fallback')
        break
      }

      const items: HotItem[] = diff.slice(0, 10).map((item, index) => ({
        rank: index + 1,
        title: item.f14,
        code: item.f12,
        change: `${item.f3 > 0 ? '+' : ''}${item.f3.toFixed(2)}%`,
        url: `https://quote.eastmoney.com/${item.f12.startsWith('6') ? 'sh' : 'sz'}${item.f12}.html`,
      }))

      console.log(`[dongfangcaifu] Success: ${items.length} items fetched`)
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
        if (error.name === 'AbortError') {
          console.log('[dongfangcaifu] Request timeout')
          lastError = new Error('请求超时')
        } else {
          lastError = error
          console.log(`[dongfangcaifu] Attempt ${attempt} error: ${error.message}`)
        }
      }
    }
  }

  // 所有尝试失败，使用降级数据
  console.log('[dongfangcaifu] Using fallback data due to API failures')
  return {
    source: 'eastmoney',
    sourceName: '东方财富',
    listType: 'stock',
    listTypeName: '热门股票',
    items: FALLBACK_DATA,
    updatedAt: new Date().toISOString(),
  }
}

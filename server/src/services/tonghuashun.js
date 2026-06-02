/**
 * 同花顺热搜数据服务
 *
 * API: https://dq.10jqka.com.cn/fuyao/hot_list_data/out/hot_list/v1/stock
 * 说明: 热门股票榜单数据
 *
 * 解析字段说明（方便日后接口变更时修改）：
 *   data.stock_list[].code         → item.code      // 股票代码
 *   data.stock_list[].name         → item.title     // 股票名称
 *   data.stock_list[].rise_and_fall → item.change   // 涨跌幅
 *   data.stock_list[].market       → 判断市场       // 33=深市, 17=沪市
 */

const API_URL = 'https://dq.10jqka.com.cn/fuyao/hot_list_data/out/hot_list/v1/stock?stock_type=a&type=hour&list_type=normal'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Referer': 'https://www.10jqka.com.cn/',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

export async function fetchTonghuashunHot() {
  try {
    // 开发环境模拟失败开关
    if (process.env.MOCK_FAIL_TONGHUASHUN === '1') {
      throw new Error('模拟同花顺服务失败')
    }

    const response = await fetch(API_URL, { headers: HEADERS })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const json = await response.json()
    const list = json?.data?.stock_list || []

    const items = list.slice(0, 10).map((item, index) => {
      const riseAndFall = item.rise_and_fall || 0
      const changeStr = `${riseAndFall > 0 ? '+' : ''}${riseAndFall.toFixed(2)}%`
      
      const code = item.code || ''
      const marketPrefix = item.market === 17 ? 'sh' : 'sz'
      
      return {
        rank: index + 1,
        title: item.name || '',
        code: code,
        change: changeStr,
        url: `https://stockpage.10jqka.com.cn/${code}/`,
      }
    })

    return {
      source: '10jqka',
      sourceName: '同花顺',
      listType: 'stock',
      listTypeName: '热门股票',
      items,
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`同花顺数据获取失败: ${error.message}`)
    }
    throw new Error('同花顺数据获取失败: 未知错误')
  }
}
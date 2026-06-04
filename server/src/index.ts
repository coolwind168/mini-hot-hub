import cors from 'cors'
import express from 'express'
import type { PlatformHotResponse } from './types/hot.js'
import { getCache, setCache } from './utils/cache.js'
import { fetchDongfangcaifuHot } from './services/dongfangcaifu.js'
import { fetchTonghuashunHot } from './services/tonghuashun.js'
import { fetchTetewangHot } from './services/tetewang.js'

const PORT = parseInt(process.env.PORT || '3001', 10)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const app = express()

// 支持多个域名的 CORS 配置
const allowedOrigins = [
  CLIENT_ORIGIN,
  'http://localhost:5173',
  'https://mini-hot-hub-lac.vercel.app',
  'https://mini-hot-hub-g2f-wiaoma168-84465-projects.vercel.app',
  'https://mini-hot-ql708qx5m-xiaoyumao168-4448s-projects.vercel.app',
]

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

app.get('/', (_req, res) => {
  res.json({ 
    message: 'Mini Hot Hub API Server',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/hot',
      '/api/hot/dongfangcaifu',
      '/api/hot/tonghuashun',
      '/api/hot/tetewang',
    ]
  })
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

const DONG_FANG_CAI_FU_DATA: PlatformHotResponse = {
  source: 'eastmoney',
  sourceName: '东方财富',
  listType: 'stock',
  listTypeName: '热门股票',
  updatedAt: new Date().toISOString(),
  items: [
    { rank: 1, title: '中国船舶', code: '600150', change: '+7.25%', url: 'https://quote.eastmoney.com/sh600150.html', bullName: '林园' },
    { rank: 2, title: '中国核电', code: '601985', change: '+5.88%', url: 'https://quote.eastmoney.com/sh601985.html' },
    { rank: 3, title: '长江电力', code: '600900', change: '+3.42%', url: 'https://quote.eastmoney.com/sh600900.html', bullName: '张坤' },
    { rank: 4, title: '中国神华', code: '601088', change: '+2.15%', url: 'https://quote.eastmoney.com/sh601088.html' },
    { rank: 5, title: '招商银行', code: '600036', change: '+1.89%', url: 'https://quote.eastmoney.com/sh600036.html', bullName: '但斌' },
    { rank: 6, title: '中国平安', code: '601318', change: '+4.56%', url: 'https://quote.eastmoney.com/sh601318.html' },
    { rank: 7, title: '中信证券', code: '600030', change: '+6.23%', url: 'https://quote.eastmoney.com/sh600030.html', bullName: '冯柳' },
    { rank: 8, title: '海天味业', code: '603288', change: '+2.78%', url: 'https://quote.eastmoney.com/sh603288.html' },
    { rank: 9, title: '恒瑞医药', code: '600276', change: '+3.95%', url: 'https://quote.eastmoney.com/sh600276.html', bullName: '葛卫东' },
    { rank: 10, title: '三一重工', code: '600031', change: '+5.12%', url: 'https://quote.eastmoney.com/sh600031.html' },
  ],
}

const TONG_HUA_SHUN_DATA: PlatformHotResponse = {
  source: '10jqka',
  sourceName: '同花顺',
  listType: 'stock',
  listTypeName: '热门股票',
  updatedAt: new Date().toISOString(),
  items: [
    { rank: 1, title: '新易盛', code: '300502', change: '+9.12%', heat: '热度 98', url: 'https://stockpage.10jqka.com.cn/300502/', bullName: '陈小群' },
    { rank: 2, title: '天孚通信', code: '300394', change: '+7.45%', heat: '热度 95', url: 'https://stockpage.10jqka.com.cn/300394/' },
    { rank: 3, title: '光模块概念', code: 'BK1056', change: '+6.20%', heat: '热度 92', url: 'https://q.10jqka.com.cn/gn/detail/code/BK1056/' },
    { rank: 4, title: '浪潮信息', code: '000977', change: '+4.88%', heat: '热度 88', url: 'https://stockpage.10jqka.com.cn/000977/', bullName: '方新侠' },
    { rank: 5, title: '中科曙光', code: '603019', change: '+3.76%', heat: '热度 85', url: 'https://stockpage.10jqka.com.cn/603019/' },
    { rank: 6, title: '拓维信息', code: '002261', change: '+5.11%', heat: '热度 82', url: 'https://stockpage.10jqka.com.cn/002261/' },
    { rank: 7, title: '剑桥科技', code: '603083', change: '+8.02%', heat: '热度 80', url: 'https://stockpage.10jqka.com.cn/603083/', bullName: '作手新一' },
    { rank: 8, title: '沪电股份', code: '002463', change: '+2.95%', heat: '热度 77', url: 'https://stockpage.10jqka.com.cn/002463/' },
    { rank: 9, title: '胜宏科技', code: '300476', change: '+4.33%', heat: '热度 74', url: 'https://stockpage.10jqka.com.cn/300476/' },
    { rank: 10, title: '景旺电子', code: '603228', change: '+3.18%', heat: '热度 71', url: 'https://stockpage.10jqka.com.cn/603228/' },
  ],
}

const TE_TE_WANG_DATA: PlatformHotResponse = {
  source: 'tetewang',
  sourceName: '特特网',
  listType: 'stock',
  listTypeName: '热门股票',
  updatedAt: new Date().toISOString(),
  items: [
    { rank: 1, title: '万丰奥威', code: '002085', change: '+10.01%', url: 'https://www.tetewang.com/stock/002085', bullName: '林园' },
    { rank: 2, title: '低空经济', code: 'BK0987', change: '+7.88%', heat: '题材热度 96', url: 'https://www.tetewang.com/theme/BK0987' },
    { rank: 3, title: '宗申动力', code: '001696', change: '+6.54%', url: 'https://www.tetewang.com/stock/001696', bullName: '但斌' },
    { rank: 4, title: '中信海直', code: '000099', change: '+5.32%', url: 'https://www.tetewang.com/stock/000099' },
    { rank: 5, title: '商汤科技', code: '00020', change: '+4.67%', url: 'https://www.tetewang.com/stock/00020' },
    { rank: 6, title: '海康威视', code: '002415', change: '+2.19%', url: 'https://www.tetewang.com/stock/002415', bullName: '冯柳' },
    { rank: 7, title: '药明康德', code: '603259', change: '+1.85%', url: 'https://www.tetewang.com/stock/603259' },
    { rank: 8, title: '隆基绿能', code: '601012', change: '+3.44%', url: 'https://www.tetewang.com/stock/601012' },
    { rank: 9, title: '特变电工', code: '600089', change: '+2.76%', url: 'https://www.tetewang.com/stock/600089', bullName: '张坤' },
    { rank: 10, title: '中国中免', code: '601888', change: '+1.92%', url: 'https://www.tetewang.com/stock/601888' },
  ],
}

const SOURCE_MAP: Record<string, PlatformHotResponse> = {
  dongfangcaifu: DONG_FANG_CAI_FU_DATA,
  tonghuashun: TONG_HUA_SHUN_DATA,
  tetewang: TE_TE_WANG_DATA,
}

async function fetchPlatformData(source: string): Promise<PlatformHotResponse> {
  if (source === 'dongfangcaifu') {
    return await fetchDongfangcaifuHot()
  }
  if (source === 'tonghuashun') {
    return await fetchTonghuashunHot()
  }
  if (source === 'tetewang') {
    return await fetchTetewangHot()
  }
  const mockData = SOURCE_MAP[source]
  if (!mockData) {
    throw new Error('无效的数据源')
  }
  return { ...mockData, updatedAt: new Date().toISOString() }
}

app.get('/api/hot/:source', async (req, res) => {
  const { source } = req.params
  const refresh = req.query.refresh === '1'

  const cacheKey = `hot:${source}`

  if (!refresh) {
    const cached = getCache(cacheKey)
    if (cached) {
      console.log(`[cache hit] ${cacheKey}`)
      return res.json(cached)
    }
  }

  try {
    const result = await fetchPlatformData(source)
    setCache(cacheKey, result)
    console.log(`[cache miss] ${cacheKey}, cached with TTL`)
    res.json(result)
  } catch (e) {
    console.error(`[error] fetch ${source}: ${e instanceof Error ? e.message : String(e)}`)
    res.json({
      error: true,
      items: [],
      message: '数据加载失败，请稍后重试',
    })
  }
})

app.get('/api/hot', async (_req, res) => {
  const startTime = Date.now()
  console.log(`[api/hot] request started at ${new Date().toISOString()}`)

  try {
    const platforms = await Promise.all([
      (async () => {
        const t = Date.now()
        const data = await fetchPlatformData('dongfangcaifu')
        console.log(`[api/hot] dongfangcaifu loaded in ${Date.now() - t}ms`)
        return data
      })(),
      (async () => {
        const t = Date.now()
        const data = await fetchPlatformData('tonghuashun')
        console.log(`[api/hot] tonghuashun loaded in ${Date.now() - t}ms`)
        return data
      })(),
      (async () => {
        const t = Date.now()
        const data = await fetchPlatformData('tetewang')
        console.log(`[api/hot] tetewang loaded in ${Date.now() - t}ms`)
        return data
      })(),
    ])

    const totalTime = Date.now() - startTime
    console.log(`[api/hot] request completed in ${totalTime}ms, status: 200 OK`)
    res.json({ platforms })
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`[api/hot] request failed in ${totalTime}ms: ${error instanceof Error ? error.message : String(error)}`)
    res.json({
      platforms: [],
      error: true,
      message: '数据加载失败，请稍后重试',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
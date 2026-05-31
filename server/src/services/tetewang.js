/**
 * 特特网牛散数据服务
 *
 * 说明: 特特网牛散热门股票数据（模拟真实数据格式）
 *
 * 数据格式说明：
 *   rank         → 排名
 *   title        → 股票名称
 *   code         → 股票代码
 *   change       → 涨跌幅
 *   url          → 详情链接
 *   bullName     → 牛散姓名（可选）
 */

const MOCK_STOCKS = [
  { title: '万丰奥威', code: '002085', change: 10.01, bullName: '林园' },
  { title: '宗申动力', code: '001696', change: 6.54, bullName: '但斌' },
  { title: '中信海直', code: '000099', change: 5.32 },
  { title: '商汤科技', code: '00020', change: 4.67 },
  { title: '海康威视', code: '002415', change: 2.19, bullName: '冯柳' },
  { title: '药明康德', code: '603259', change: 1.85 },
  { title: '隆基绿能', code: '601012', change: 3.44 },
  { title: '特变电工', code: '600089', change: 2.76, bullName: '张坤' },
  { title: '中国中免', code: '601888', change: 1.92 },
  { title: '宁德时代', code: '300750', change: 2.45, bullName: '葛卫东' },
]

const BULL_NAMES = ['林园', '但斌', '冯柳', '张坤', '葛卫东', '陈小群', '方新侠', '作手新一']

export async function fetchTetewangHot() {
  try {
    // 模拟一些动态变化
    const shuffled = [...MOCK_STOCKS].sort(() => Math.random() - 0.5)
    const items = shuffled.slice(0, 10).map((item, index) => {
      const change = (item.change + (Math.random() - 0.5) * 2).toFixed(2)
      const changeStr = `${parseFloat(change) > 0 ? '+' : ''}${change}%`
      
      const result = {
        rank: index + 1,
        title: item.title,
        code: item.code,
        change: changeStr,
        url: `https://www.tetewang.com/stock/${item.code}`,
      }
      
      // 随机添加牛散信息
      if (item.bullName || Math.random() > 0.6) {
        result.bullName = item.bullName || BULL_NAMES[Math.floor(Math.random() * BULL_NAMES.length)]
      }
      
      return result
    })

    return {
      source: 'tetewang',
      sourceName: '特特网',
      listType: 'stock',
      listTypeName: '热门股票',
      items,
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`特特网数据获取失败: ${error.message}`)
    }
    throw new Error('特特网数据获取失败: 未知错误')
  }
}

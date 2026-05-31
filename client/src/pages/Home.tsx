import { HotCard } from '../components/HotCard'
import { useHotList } from '../hooks/useHotList'
import './Home.css'

export default function Home() {
  const { platforms, loading, error, refetch } = useHotList()

  return (
    <div className="home">
      <header className="home__topbar">
        <h1 className="home__title">股票今日热榜</h1>
        <p className="home__intro">
          聚合东方财富、同花顺、特特网热门题材与股票，打开即览，无需登录。
        </p>
      </header>

      <main className="home__main">
        {loading ? (
          <div className="home__loading">
            <div className="home__spinner" />
            <p className="home__loading-text">加载中...</p>
          </div>
        ) : error ? (
          <div className="home__error">
            <p className="home__error-msg">{error}</p>
            <button type="button" className="home__retry" onClick={refetch}>
              点击重试
            </button>
          </div>
        ) : (
          <div className="home__grid">
            {platforms.map((p) => (
              <HotCard
                key={p.source}
                platform={p.source}
                sourceName={p.sourceName}
                listName={p.listTypeName}
                loading={false}
                error={p.error ? (p.message ?? '加载失败，请稍后重试') : null}
                data={
                  p.error
                    ? null
                    : { items: p.items, updatedAt: p.updatedAt }
                }
                onRetry={refetch}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="home__footer">
        <p>本项目仅供个人学习研究使用，不构成任何投资建议。</p>
        <p>股市有风险，投资需谨慎。请独立判断，理性决策。</p>
        <p>数据来源于东方财富、同花顺、特特网等公开渠道，仅供参考。</p>
      </footer>
    </div>
  )
}
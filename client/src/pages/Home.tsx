import { HotCard } from '../components/HotCard'
import { useHotList } from '../hooks/useHotList'
import './Home.css'

// 缓存更新频率（与后端 CACHE_TTL 一致，默认 600 秒 = 10 分钟）
const CACHE_TTL_MINUTES = parseInt((import.meta.env.VITE_CACHE_TTL as string) || '600', 10) / 60

export default function Home() {
  const { platforms, loading, error, refetch } = useHotList()

  return (
    <div className="home">
      <header className="home__topbar">
        <div className="home__header-content">
          <h1 className="home__title">股票今日热榜</h1>
          <button
            type="button"
            className="home__refresh-btn"
            onClick={refetch}
            disabled={loading}
            title="刷新数据"
          >
            <svg
              className={`home__refresh-icon ${loading ? 'home__refresh-icon--spinning' : ''}`}
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>刷新</span>
          </button>
        </div>
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
        <div className="home__footer-content">
          <p>© 2024 股票今日热榜 - 个人学习项目</p>
          <p>数据来源于各平台公开信息，非官方发布，仅供参考</p>
          <p>数据更新频率：约 {CACHE_TTL_MINUTES} 分钟</p>
          <p>如有侵权或违规，请联系：chaoguxiaobawang@gmail.com</p>
          <p className="home__footer-disclaimer">
            本项目不构成任何投资建议，股市有风险，投资需谨慎
          </p>
        </div>
      </footer>
    </div>
  )
}
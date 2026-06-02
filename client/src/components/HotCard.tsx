import type { HotItem, HotPlatform } from '../types/hot'
import { formatRelativeTime } from '../utils/format'
import './HotCard.css'

export interface HotCardData {
  items: HotItem[]
  updatedAt: string
}

export interface HotCardProps {
  platform: HotPlatform
  sourceName: string
  listName: string
  loading: boolean
  error: string | null
  data: HotCardData | null
  onRetry?: () => void
}

const SKELETON_ROWS = 10

function getRowClassName(rank: number): string {
  if (rank === 1) return 'hot-row hot-row--top hot-row--rank-1'
  if (rank === 2) return 'hot-row hot-row--top hot-row--rank-2'
  if (rank === 3) return 'hot-row hot-row--top hot-row--rank-3'
  return 'hot-row'
}

function FireIcon() {
  return (
    <svg
      className="fire-icon"
      viewBox="0 0 24 24"
      width="12"
      height="16"
    >
      <defs>
        <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path
        fill="url(#fireGradient)"
        d="M12 2C12 2 7 9 7 13a5 5 0 0 0 10 0c0-4-5-11-5-11zm0 15a3 3 0 0 1-3-3c0-2 3-6 3-6s3 4 3 6a3 3 0 0 1-3 3z"
      />
    </svg>
  )
}

function HotRow({ item }: { item: HotItem }) {
  const fireCount = item.rank === 1 ? 3 : item.rank === 2 ? 2 : item.rank === 3 ? 1 : 0

  return (
    <li className={getRowClassName(item.rank)}>
      <span className="hot-row__rank">{item.rank}</span>
      <div className="hot-row__content">
        <a
          className="hot-row__title"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.title}
        </a>
        {fireCount > 0 ? (
          <span className="hot-row__fire">
            {Array.from({ length: fireCount }, (_, i) => (
              <FireIcon key={i} />
            ))}
          </span>
        ) : null}
        {item.bullName ? (
          <span className="hot-row__bull">{item.bullName}</span>
        ) : null}
      </div>
      {item.heat ? <span className="hot-row__heat">{item.heat}</span> : null}
    </li>
  )
}

function HotCardSkeleton() {
  return (
    <div className="hot-card__loading" aria-busy="true" aria-label="加载中">
      <p className="hot-card__loading-text">加载中...</p>
      <ul className="hot-card__skeleton">
        {Array.from({ length: SKELETON_ROWS }, (_, i) => (
          <li key={i} className="hot-card__skeleton-row">
            <span className="hot-card__skeleton-rank" />
            <span className="hot-card__skeleton-title" />
            <span className="hot-card__skeleton-heat" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function HotCardError({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="hot-card__error-wrap" role="alert">
      <p className="hot-card__error-msg">{message}</p>
      {onRetry ? (
        <button type="button" className="hot-card__retry" onClick={onRetry}>
          点击重试
        </button>
      ) : null}
    </div>
  )
}

export function HotCard({
  platform,
  sourceName,
  listName,
  loading,
  error,
  data,
  onRetry,
}: HotCardProps) {
  const hasData = !loading && !error && data !== null && data.items.length > 0
  const isEmpty = !loading && !error && data !== null && data.items.length === 0

  return (
    <article
      className={`hot-card${loading ? ' hot-card--loading' : ''}${error ? ' hot-card--error' : ''}`}
      data-platform={platform}
    >
      <header className="hot-card__header">
        <h2 className="hot-card__source">{sourceName}</h2>
        <p className="hot-card__list-name">{listName}</p>
      </header>

      {loading ? (
        <HotCardSkeleton />
      ) : error ? (
        <HotCardError message={error} onRetry={onRetry} />
      ) : hasData ? (
        <ol className="hot-card__list">
          {data.items.map((item) => (
            <HotRow key={`${platform}-${item.rank}`} item={item} />
          ))}
        </ol>
      ) : isEmpty ? (
        <p className="hot-card__empty">暂无数据</p>
      ) : (
        <p className="hot-card__empty">暂无数据</p>
      )}

      <footer className="hot-card__footer">
        {hasData
          ? `更新于 ${formatRelativeTime(data.updatedAt)}`
          : loading
            ? '数据加载中'
            : '—'}
      </footer>
    </article>
  )
}

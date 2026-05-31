import type { HotItem, PlatformHotResponse } from '../types/hot'
import './HotCard.css'

interface HotCardProps {
  data: PlatformHotResponse
}

function formatUpdatedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function HotRow({ item }: { item: HotItem }) {
  const rankClass =
    item.rank <= 3 ? `hot-row hot-row--rank-${item.rank}` : 'hot-row'
  const metric = item.change ?? item.heat

  return (
    <li className={rankClass}>
      <span className="hot-row__rank">{item.rank}</span>
      <div className="hot-row__main">
        <a
          className="hot-row__title"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.title}
          {item.code ? ` (${item.code})` : ''}
        </a>
        {metric ? <span className="hot-row__metric">{metric}</span> : null}
      </div>
      {item.bullName ? (
        <span className="hot-row__bull">
          牛散：
          <button type="button" className="hot-row__bull-link">
            {item.bullName}
          </button>
        </span>
      ) : null}
    </li>
  )
}

export function HotCard({ data }: HotCardProps) {
  return (
    <article className="hot-card">
      <header className="hot-card__header">
        <h2 className="hot-card__title">{data.sourceName}</h2>
        <p className="hot-card__meta">
          <span>{data.listTypeName}</span>
          <span className="hot-card__updated">
            更新于 {formatUpdatedAt(data.updatedAt)}
          </span>
        </p>
      </header>
      <ol className="hot-card__list">
        {data.items.map((item) => (
          <HotRow key={`${data.source}-${item.rank}`} item={item} />
        ))}
      </ol>
    </article>
  )
}

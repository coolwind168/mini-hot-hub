import type { ReactNode } from 'react'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1 className="layout__title">A股热门聚合</h1>
        <p className="layout__subtitle">
          东方财富 · 同花顺 · 特特网 热门数据一览
        </p>
      </header>
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">
        <p>本项目仅供个人学习研究 · 非商用 · 非投资建议</p>
        <p>数据来源：东方财富、同花顺、特特网（公开数据）</p>
      </footer>
    </div>
  )
}

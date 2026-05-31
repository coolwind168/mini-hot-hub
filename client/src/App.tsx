import { HotCard } from './components/HotCard'
import { Layout } from './components/Layout'
import type { HotMockData } from './types/hot'
import mockData from './mock/hot.json'
import './App.css'

const { platforms } = mockData as HotMockData

function App() {
  return (
    <Layout>
      <div className="hot-grid">
        {platforms.map((platform) => (
          <HotCard key={platform.source} data={platform} />
        ))}
      </div>
    </Layout>
  )
}

export default App

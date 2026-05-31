import { useState, useEffect, useCallback } from 'react'
import type { PlatformHotResponse } from '../types/hot'
import { fetchAllHot } from '../api/hot'

export interface UseHotListResult {
  platforms: PlatformHotResponse[]
  loading: boolean
  error: string | null
  refetch: () => void
}

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const SIMULATE_ERROR = false
const LOADING_DELAY_MS = 500

export function useHotList(): UseHotListResult {
  const [platforms, setPlatforms] = useState<PlatformHotResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await simulateDelay(LOADING_DELAY_MS)
      if (SIMULATE_ERROR) {
        throw new Error('模拟错误：网络连接失败，请检查网络后重试')
      }

      const result = await fetchAllHot()
      setPlatforms(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    platforms,
    loading,
    error,
    refetch: fetchData,
  }
}
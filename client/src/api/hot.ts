import type { PlatformHotResponse } from '../types/hot'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export async function fetchDongfangcaifu(): Promise<PlatformHotResponse> {
  const res = await fetch(`${API_BASE}/api/hot/dongfangcaifu`)
  if (!res.ok) {
    throw new Error(`请求失败: ${res.status}`)
  }
  return res.json() as Promise<PlatformHotResponse>
}

export async function fetchHotPlatform(source: string): Promise<PlatformHotResponse> {
  const res = await fetch(`${API_BASE}/api/hot/${source}`)
  if (!res.ok) {
    throw new Error(`请求失败: ${res.status}`)
  }
  return res.json() as Promise<PlatformHotResponse>
}

export async function fetchAllHot(): Promise<PlatformHotResponse[]> {
  const res = await fetch(`${API_BASE}/api/hot`)
  if (!res.ok) {
    throw new Error(`请求失败: ${res.status}`)
  }
  const data = await res.json()
  return data.platforms as PlatformHotResponse[]
}
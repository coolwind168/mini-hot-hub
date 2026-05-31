import type { HotListType, HotPlatform, PlatformHotResponse } from '../types/hot'

const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export async function fetchPlatformHot(
  source: HotPlatform,
  type: HotListType,
): Promise<PlatformHotResponse> {
  const res = await fetch(`${API_BASE}/api/hot/${source}/${type}`)
  if (!res.ok) {
    throw new Error(`请求失败: ${res.status}`)
  }
  return res.json() as Promise<PlatformHotResponse>
}

export async function fetchAllHot(): Promise<PlatformHotResponse[]> {
  const res = await fetch(`${API_BASE}/api/hot/all`)
  if (!res.ok) {
    throw new Error(`请求失败: ${res.status}`)
  }
  return res.json() as Promise<PlatformHotResponse[]>
}

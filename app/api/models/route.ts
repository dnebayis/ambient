import { NextResponse } from 'next/server'

const AMBIENT_API_BASE = 'https://api.ambient.xyz'
const AMBIENT_API_KEY = process.env.AMBIENT_API_KEY
const FALLBACK_MODELS = [
  { id: 'ambient/large', name: 'Ambient Large', context_length: 128000 },
  { id: 'zai-org/GLM-4.6', name: 'GLM-4.6', context_length: 200000 },
]

export async function GET() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (AMBIENT_API_KEY) headers['Authorization'] = `Bearer ${AMBIENT_API_KEY}`

  try {
    const res = await fetch(`${AMBIENT_API_BASE}/v1/models`, { headers, cache: 'no-store' })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { fallback: true, data: FALLBACK_MODELS, error: text || res.statusText },
        { status: res.status }
      )
    }
    const data = await res.json()
    // If API returns empty, still provide fallback
    if (!Array.isArray(data?.data) || data.data.length === 0) {
      return NextResponse.json(
        { fallback: true, data: FALLBACK_MODELS, error: 'Empty model list' },
        { status: 200 }
      )
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { fallback: true, data: FALLBACK_MODELS, error: (err as Error).message },
      { status: 500 }
    )
  }
}

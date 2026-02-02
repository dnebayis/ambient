import { NextRequest, NextResponse } from 'next/server'

const AMBIENT_API_BASE = 'https://api.ambient.xyz'
const AMBIENT_API_KEY = process.env.AMBIENT_API_KEY // Server-side only, no NEXT_PUBLIC_

/**
 * Server-side Chat API Route
 * Protects API key from client exposure
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model = 'mini', temperature = 0.7, max_completion_tokens = 2000 } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Make request to Ambient API
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (AMBIENT_API_KEY) {
      headers['Authorization'] = `Bearer ${AMBIENT_API_KEY}`
    }

    const response = await fetch(`${AMBIENT_API_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_completion_tokens,
        stream: false,
        emit_usage: true,
        emit_verified: false,
        reasoning: {
          enabled: false,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ambient API error:', response.status, errorText)
      return NextResponse.json(
        { error: `API request failed: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

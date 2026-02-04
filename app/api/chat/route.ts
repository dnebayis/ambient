import { NextRequest, NextResponse } from 'next/server'
import { AMBIENT_SYSTEM_PROMPT } from '@/lib/ambient-knowledge'

const AMBIENT_API_BASE = 'https://api.ambient.xyz'
const AMBIENT_API_KEY = process.env.AMBIENT_API_KEY

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * Ambient-Only AI Chat API
 * Uses Ambient's knowledge base to answer only Ambient-related questions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, model = 'large', temperature = 0.7, max_completion_tokens = 2048 } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Prepend system prompt with Ambient knowledge base
    const messagesWithSystem: ChatMessage[] = [
      { role: 'system', content: AMBIENT_SYSTEM_PROMPT },
      ...messages
    ]

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
        messages: messagesWithSystem,
        temperature,
        max_completion_tokens,
        stream: false,
        emit_usage: true,
        emit_verified: true,
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

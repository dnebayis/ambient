/**
 * Ambient API Client
 * https://api.ambient.xyz/docs
 */

const AMBIENT_API_BASE = 'https://api.ambient.xyz'

export interface AmbientModel {
  id: string
  name: string
  created: number
  input_modalities: string[]
  output_modalities: string[]
  context_length: number
  max_output_length: number
  description?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatCompletionRequest {
  model?: string
  messages: ChatMessage[]
  temperature?: number
  max_completion_tokens?: number
  stream?: boolean
  emit_usage?: boolean
  emit_verified?: boolean
  reasoning?: {
    enabled?: boolean
    effort?: 'high' | 'medium' | 'low'
    max_tokens?: number
  }
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: ChatMessage
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  merkle_root: string
  verified?: boolean
}

export interface ListModelsResponse {
  object: string
  data: AmbientModel[]
  has_more: boolean
}

export class AmbientAPI {
  private apiKey: string | null

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    // Add 30 second timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(`${AMBIENT_API_BASE}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Ambient API error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout: API took longer than 30 seconds')
      }
      throw error
    }
  }

  /**
   * List available models
   * GET /v1/models
   */
  async listModels(): Promise<ListModelsResponse> {
    return this.fetch<ListModelsResponse>('/v1/models')
  }

  /**
   * Get specific model details
   * GET /v1/models/{model_id}
   */
  async getModel(modelId: string): Promise<AmbientModel> {
    return this.fetch<AmbientModel>(`/v1/models/${modelId}`)
  }

  /**
   * Create chat completion
   * POST /v1/chat/completions
   */
  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    return this.fetch<ChatCompletionResponse>('/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: request.model || 'large', // Default to 'large' model
        messages: request.messages,
        temperature: request.temperature,
        max_completion_tokens: request.max_completion_tokens,
        stream: request.stream || false,
        emit_usage: request.emit_usage ?? true,
        emit_verified: request.emit_verified ?? false,
        reasoning: request.reasoning,
      }),
    })
  }

  /**
   * Count tokens for messages (Anthropic endpoint)
   * POST /v1/messages/count_tokens
   */
  async countTokens(messages: ChatMessage[]): Promise<{ token_count: number }> {
    return this.fetch<{ token_count: number }>('/v1/messages/count_tokens', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    })
  }

  /**
   * Conduct research
   * POST /v1/research
   */
  async conductResearch(params: {
    topic: string
    max_sources?: number
    max_queries?: number
    number_of_answers?: number
    research_iterations?: number
  }): Promise<any> {
    return this.fetch('/v1/research', {
      method: 'POST',
      body: JSON.stringify({
        topic: params.topic,
        max_sources: params.max_sources ?? 5,
        max_queries: params.max_queries ?? 2,
        number_of_answers: params.number_of_answers ?? 1,
        research_iterations: params.research_iterations ?? 2,
      }),
    })
  }

  /**
   * List research
   * GET /v1/research
   */
  async listResearch(params?: {
    limit?: number
    after?: string
    before?: string
    order?: 'asc' | 'desc'
  }): Promise<any> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.after) queryParams.set('after', params.after)
    if (params?.before) queryParams.set('before', params.before)
    if (params?.order) queryParams.set('order', params.order)

    const query = queryParams.toString()
    return this.fetch(`/v1/research${query ? `?${query}` : ''}`)
  }

  /**
   * Get research details
   * GET /v1/research/{research_id}
   */
  async getResearch(researchId: string): Promise<any> {
    return this.fetch(`/v1/research/${researchId}`)
  }

  /**
   * Stream research actions in real-time
   * GET /v1/research/{research_id}/actions
   */
  async getResearchActions(researchId: string): Promise<any> {
    return this.fetch(`/v1/research/${researchId}/actions`)
  }
}

// Singleton instance for client-side usage
export const ambientAPI = new AmbientAPI(
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_AMBIENT_API_KEY
    : undefined
)

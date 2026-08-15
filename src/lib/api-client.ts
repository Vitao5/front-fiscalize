import 'server-only'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:3002/api'

export interface ApiResponse<T = any> {
  ok: boolean
  status: number
  data: T
  message?: string
  error?: string
}

class ApiClient {
  private baseUrl = API_BASE

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        cache: 'no-store',
      })

      const body = await response.json().catch(() => ({}))

      return {
        ok: response.ok,
        status: response.status,
        data: body,
        message: body.message,
        error: body.error,
      }
    } catch (error) {
      return {
        ok: false,
        status: 0,
        data: null as T,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      }
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint, { method: 'GET' })
  }

  async post<T = any>(
    endpoint: string,
    body?: any
  ): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async put<T = any>(
    endpoint: string,
    body?: any
  ): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
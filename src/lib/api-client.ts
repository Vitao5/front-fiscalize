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

  private async refreshAccessToken(): Promise<string | null> {
    try {
      const cookieStore = await cookies()
      const refreshToken = cookieStore.get('refresh_token')?.value
      if (!refreshToken) return null

      const res = await fetch(`${this.baseUrl}/users/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
      })

      if (!res.ok) {
        cookieStore.delete('auth_token')
        cookieStore.delete('refresh_token')
        return null
      }

      const body = await res.json()
      if (body.token) {
        cookieStore.set('auth_token', body.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 15, // 15 minutos
          path: '/',
        })

        if (body.refreshToken) {
          cookieStore.set('refresh_token', body.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: '/',
          })
        }

        return body.token
      }
      return null
    } catch {
      return null
    }
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const cookieStore = await cookies()
    let token = cookieStore.get('auth_token')?.value

  
    if (!token && !endpoint.includes('/users/login') && !endpoint.includes('/users/refresh-token') && !endpoint.includes('/users/register')) {
      token = (await this.refreshAccessToken()) ?? undefined
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      let response = await fetch(url, {
        ...options,
        headers,
        cache: 'no-store',
      })

     
      if (response.status === 401 && !endpoint.includes('/users/login') && !endpoint.includes('/users/refresh-token')) {
        const newToken = await this.refreshAccessToken()
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`
          response = await fetch(url, {
            ...options,
            headers,
            cache: 'no-store',
          })
        }
      }

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
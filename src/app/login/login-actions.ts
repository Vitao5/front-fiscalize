'use server'

import { cookies } from 'next/headers'

const API_BASE = 'http://127.0.0.1:3001/api'

export async function realizarLogin(message: any, formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '').trim()

  if (email === '' || password === '') {
    return { message: 'Campos inválidos', sucess: false }
  }

  try {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        message: data.message ?? 'Erro ao fazer login.',
        sucess: false,
      }
    }

    if (!data.token) {
      return {
        message: 'A API não retornou um token de autenticação.',
        sucess: false,
      }
    }

    const cookieStore = await cookies()
    cookieStore.set('auth_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return {
      message: data.message ?? 'Login realizado com sucesso',
      sucess: true,
      user: {
        name: data.name,
        email: data.email,
        admin: data.userRoot,
        token: data.token,
      },
    }
  } catch {
    return { message: 'Erro ao fazer login.', sucess: false }
  }
}
'use server'

import { cookies } from 'next/headers'
import { apiClient } from '@/lib/api-client'

export async function realizarLogin(message: any, formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '').trim()

  if (email === '' || password === '') {
    return { message: 'Campos inválidos', sucess: false }
  }

  const response = await apiClient.post('/users/login', { email, password })

  if (!response.ok) {
    return {
      message: response.message ?? 'Erro ao fazer login.',
      sucess: false,
    }
  }


  const cookieStore = await cookies()
  cookieStore.set('auth_token', response.data.token, {
    //o httponly impede roubo de token via js, secure define http ou https, 
    //samesite protge contra csrf
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return {
    message: response.message ?? 'Login realizado com sucesso',
    sucess: true,
    user: {
      name: response.data.name,
      email: response.data.email,
      admin: response.data.userRoot,
      token: response.data.token,
      onboardingCompleted: response.data.onboardingCompleted || false,
    },
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}
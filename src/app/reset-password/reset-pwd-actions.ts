'use server'

import { apiClient } from '@/lib/api-client'

export async function enviarCodigo(formData: FormData) {
  const email = formData.get('email') as string

  if (!email || email === '') {
    return { ok: false, status: 0, data: { message: 'Email inválidos', sucess: false } }
  }

  return await apiClient.post('/users/send-code', { email: email })
}

export async function verificarCodigo(email: string, codePassword: string) {
  if (!email || !codePassword) {
    return { ok: false, status: 0, message: 'Preencha todos os campos!' }
  }

  return await apiClient.post('/users/verify-code', { email, codePassword })
}

export async function resetarSenha(email: string, codePassword: string, password: string) {
  if (!email || !codePassword || !password) {
    return { ok: false, status: 0, message: 'Preencha todos os campos!' }
  }

  return await apiClient.post('/users/reset-password', { email, codePassword, password })
}
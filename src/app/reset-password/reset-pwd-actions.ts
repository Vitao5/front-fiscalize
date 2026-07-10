'use server'

import { apiClient } from '@/lib/api-client'

export async function enviarCodigo(formData: FormData) {
  const email = formData.get('email') as string

  if (!email || email === '') {
    return { ok: false, status: 0, data: { message: 'Email inválidos', sucess: false } }
  }

  return await apiClient.post('/users/send-code', { email: email })
}
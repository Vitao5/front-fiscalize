'use server'

import { redirect } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

export async function registrarUsuario(message: any, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const confirmPassword = String(formData.get('confirmPassword') ?? '').trim()

  if (password !== confirmPassword) {
    return { message: 'As senhas não coincidem.', sucess: false }
  }

  const response = await apiClient.post('/users/register', {
    name,
    email,
    password,
    phoneNumber: phone.replace(/\D/g, ''),
  })

  if (!response.ok) {
    return {
      message: response.message ?? 'Erro ao cadastrar.',
      sucess: false,
    }
  }

  redirect('/login')
}
'use server'

import { redirect } from "next/navigation"

const API_BASE = 'http://127.0.0.1:3001/api'

export async function registrarUsuario(message: any, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const confirmPassword = String(formData.get('confirmPassword') ?? '').trim()

  try {
    if (password !== confirmPassword) {
      return { message: 'As senhas não coincidem.', sucess: false }
    }

    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        phoneNumber: phone.replace(/\D/g, ''),
      }),
      cache: 'no-store',
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        message: data.message ?? 'Erro ao cadastrar.',
        sucess: false,
      }
    }
  } catch {
    return { message: 'Erro ao cadastrar.', sucess: false }
  }

  redirect('/login')
}
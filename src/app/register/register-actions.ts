'use server'

import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

export async function registrarUsuario(message: any, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const phone = formData.get('phone') as string
  const confirmPassword = formData.get('confirmPassword') as string

  try {
    if (password !== confirmPassword) {
      return { message: "As senhas não coincidem.", sucess: false }
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!!user) {
      return { message: "E-mail já cadastrado", sucess: false }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        loginAttempts: 0,
        phoneNumber: phone.replace(/\D/g, ''),
      }
    })
  } catch {
    return { message: "Erro ao cadastrar.", sucess: false }
  }

  redirect('/login')
}
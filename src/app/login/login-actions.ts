'use server'

import { db } from "@/lib/db"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
// @ts-ignore
import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.SECRET_KEY

export async function realizarLogin(message: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (email.trim() === '' || password.trim() === '') {
    return { message: "Campos inválidos", sucess: false }
  }

  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    return { message: "Usuário não encontrado.", sucess: false }
  }

  if (user.loginAttempts >= 2) {
    await db.user.update({ where: { email }, data: { inativeUser: true } })
    return { message: "Conta bloqueada", sucess: false }
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    await db.user.update({ where: { email }, data: { loginAttempts: user.loginAttempts + 1 } })
    return { message: `Senha incorreta. Restam ${2 - user.loginAttempts} tentativa(s)`, sucess: false }
  }

  await db.user.update({ where: { email }, data: { loginAttempts: 0 } })

  const token = jwt.sign({ email: user.email, senha: user.password, id: user.userId }, SECRET_KEY, { expiresIn: '99h' })

  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 99,
    path: '/',
  })

  return {
    message: "Login realizado com sucesso",
    sucess: true,
    user: {
      name: user.name,
      email: user.email,
      admin: user.admin,
      token,
    }
  }
}
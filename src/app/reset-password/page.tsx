'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { enviarCodigo, verificarCodigo, resetarSenha } from "./reset-pwd-actions";

type Step = 'email' | 'code' | 'newPassword'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const codeRefs = useRef<(HTMLInputElement | null)[]>([])

  const COOLDOWN_KEY = 'resetPwd_cooldownEnd'

  const startTimer = useCallback((remaining: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setCooldown(remaining)
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          localStorage.removeItem(COOLDOWN_KEY)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const startCooldown = useCallback(() => {
    const endTime = Date.now() + 180 * 1000
    localStorage.setItem(COOLDOWN_KEY, endTime.toString())
    startTimer(180)
  }, [startTimer])

  useEffect(() => {
    const saved = localStorage.getItem(COOLDOWN_KEY)
    if (saved) {
      const remaining = Math.ceil((Number(saved) - Date.now()) / 1000)
      if (remaining > 0) {
        startTimer(remaining)
      } else {
        localStorage.removeItem(COOLDOWN_KEY)
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [startTimer])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }


  const handleSendCode = async () => {
    setErrorMessage('')
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setErrorMessage('Informe um e-mail válido!')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.set('email', email)
    const response = await enviarCodigo(formData)
    setLoading(false)

    if (response.status === 429) {
      startCooldown()
    }

    setStep('code')
    setErrorMessage('')
  }

  
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)

    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus()
    }
  }

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus()
    }
  }

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length > 0) {
      const newCode = [...code]
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || ''
      }
      setCode(newCode)
      const focusIndex = Math.min(pasted.length, 5)
      codeRefs.current[focusIndex]?.focus()
    }
  }


  const handleVerifyCode = async () => {
    setErrorMessage('')
    const fullCode = code.join('')
    if (fullCode.length < 6) return

    setLoading(true)
    const response = await verificarCodigo(email, fullCode)
    setLoading(false)

    if (response.ok) {
      setStep('newPassword')
      setErrorMessage('')
    } else {
      setErrorMessage(response.message || 'Código inválido!')
    }
  }


  const handleResetPassword = async () => {
    setErrorMessage('')
    if (!newPassword) {
      setErrorMessage('Digite sua nova senha!')
      return
    }

    setLoading(true)
    const fullCode = code.join('')
    const response = await resetarSenha(email, fullCode, newPassword)
    setLoading(false)

    if (response.ok) {
      router.push('/login')
    } else {
      setErrorMessage(response.message || 'Erro ao alterar senha.')
    }
  }

  const stepTitle = {
    email: 'Recuperação de senha',
    code: 'Verificação de código',
    newPassword: 'Nova senha',
  }

  const stepSubtitle = {
    email: 'Insira seu e-mail cadastrado',
    code: 'Insira o código de verificação',
    newPassword: 'Digite sua nova senha',
  }

  return (
    <section
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)" }}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #86efac, transparent 70%)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #4ade80, transparent 70%)" }} />
      </div>

      <div className="relative flex flex-col items-center px-4 w-full max-w-[440px]">
        <Link href="#" className="flex items-center mb-8 gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Fiscalize <span className="text-primary-600">Finanças</span></span>
        </Link>

        <div
          className="sm:w-50 xl:w-full rounded-2xl p-8 shadow-2xl"
          style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(0,0,0,0.08)", backdropFilter: "blur(20px)" }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{stepTitle[step]}</h1>
          <p className="text-xl text-gray-600 mb-4">{stepSubtitle[step]}</p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

            {errorMessage && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3 animate-pulse">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {errorMessage}
              </div>
            )}

            {step === 'email' && (
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email" name="email" id="email"
                  placeholder="email@exemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500"
                  style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)" }}
                />
              </div>
            )}

            {step === 'code' && (
              <div className="space-y-1.5">
                <div className="flex justify-between gap-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { codeRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      onPaste={index === 0 ? handleCodePaste : undefined}
                      className="w-13 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 text-xl outline-none transition-all focus:ring-2 focus:ring-primary-500 text-center"
                      style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)" }}
                    />
                  ))}
                </div>
              </div>
            )}

      
            {step === 'newPassword' && (
              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nova senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} name="newPassword" id="newPassword"
                    placeholder="••••••••"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500"
                    style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}


            {cooldown > 0 && step === 'code' && (
              <p className="text-xl text-gray-500 text-center" style={{ opacity: 0.7 }}>
                Aguarde {formatTime(cooldown)} para reenviar
              </p>
            )}

      
            <button
              type="button"
              disabled={loading || (step === 'email' && cooldown > 0)}
              onClick={() => {
                if (step === 'email') handleSendCode()
                else if (step === 'code') handleVerifyCode()
                else if (step === 'newPassword') handleResetPassword()
              }}
              className="w-full py-3 px-5 rounded-xl font-bold text-white text-sm transition-all shadow-lg"
              style={{
                background: (loading || (step === 'email' && cooldown > 0))
                  ? 'rgba(0,0,0,0.1)'
                  : 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: (loading || (step === 'email' && cooldown > 0))
                  ? 'none'
                  : '0 4px 24px rgba(34,197,94,0.3)',
                cursor: (loading || (step === 'email' && cooldown > 0))
                  ? 'not-allowed'
                  : 'pointer',
                opacity: (loading || (step === 'email' && cooldown > 0)) ? 0.5 : 1,
              }}
            >
              {loading
                ? 'Aguarde...'
                : step === 'email'
                  ? 'Enviar Código'
                  : step === 'code'
                    ? 'Verificar Código'
                    : 'Alterar Senha'
              }
            </button>

            <p className="text-sm text-gray-500 text-center pt-1">
              <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                Voltar para login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

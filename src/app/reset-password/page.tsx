'use client'

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { enviarCodigo } from "./reset-pwd-actions";

export default function ResetPasswordPage() {
  const [sendCode, setSendCode] = useState(false)
  const [message, setMessage] = useState("")
  const [messageError, setMessageError] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  const showFieldCode = async (form: FormData) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const emailValid = emailRegex.test(String(form.get('email')))
    if (emailValid) {
      const response = await enviarCodigo(form)
      setMessageError(response.ok)
      setMessage(response.data.message)

      if (response.status === 429) {
        startCooldown()
      }
    }
  };

  return (
    <section
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1a2e1a 50%, #0f2a0f 100%)" }}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #22c55e, transparent 70%)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #16a34a, transparent 70%)" }} />
      </div>

      <div className="relative flex flex-col items-center px-4 w-full max-w-[440px]">
        <Link href="#" className="flex items-center mb-8 gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Fiscalize <span className="text-primary-400">Finanças</span></span>
        </Link>

        <div
          className=" sm:w-50 xl:w-full rounded-2xl p-8 shadow-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
        >
          <h1 className="text-2xl font-bold text-white mb-3">Recuperação de senha</h1>
            
           <p className="text-xl text-gray-100 mb-4" >{messageError ?  "Insira seu código de verificação" : "Insira seu e-mail cadastrado"}</p> 
          
          <span className="text-xl text-red-500 mb-7 bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-medium rounded-xl px-4 py-3" style={
            messageError == false && message.length > 0 ? { display: "block" } : { display: "none" }}
          >{message}</span>

          <form className="space-y-5">


            <div className="space-y-1.5" style={{ display: messageError == false ? 'block' : 'none' }}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">E-mail</label>
              <input
                type="email" name="email" id="email"
                placeholder="email@exemplo.com"
                required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              />
            </div>

            <div className="space-y-1.5" style={{ display: messageError == true ? 'block' : 'none' }}>
              <div className="flex justify-between gap-2">
                <input
                  type="text" name="code1" id="code1"
                  maxLength={1}
                  className={`w-13 px-4 py-3 rounded-xl text-white placeholder-gray-500 text-xl outline-none transition-all focus:ring-2 focus:ring-primary-500`}
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
                <input
                  type="text" name="code2" id="code2"
                  maxLength={1}
                  className={`w-13 px-4 py-3 rounded-xl text-white placeholder-gray-500 text-xl outline-none transition-all focus:ring-2 focus:ring-primary-500`}
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
                <input
                  type="text" name="code3" id="code3"
                  maxLength={1}
                  className={`w-13 px-4 py-3 rounded-xl text-white placeholder-gray-500 text-xl outline-none transition-all focus:ring-2 focus:ring-primary-500`}
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
                <input
                  type="text" name="code4" id="code4"
                  maxLength={1}
                  className={`w-13 px-4 py-3 rounded-xl text-white placeholder-gray-500 text-xl outline-none transition-all focus:ring-2 focus:ring-primary-500`}
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
              </div>

            </div>

            {cooldown > 0 && (
              <p className="text-XL text-gray-400 text-center" style={{ opacity: 0.7 }}>
                Aguarde {formatTime(cooldown)} para reenviar
              </p>
            )}

            <button
              type="submit"
              disabled={cooldown > 0}
              onClick={(e) => {
                if (!sendCode) {
                  e.preventDefault();
                  const form = e.currentTarget.form;
                  if (form) {
                    showFieldCode(new FormData(form));
                  }
                }
              }}
              className="w-full py-3 px-5 rounded-xl font-bold text-white text-sm transition-all shadow-lg"
              style={{
                background: cooldown > 0 ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: cooldown > 0 ? 'none' : '0 4px 24px rgba(34,197,94,0.3)',
                cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
                opacity: cooldown > 0 ? 0.5 : 1,
              }}
            >
              {!sendCode ? "Enviar Código" : "Verificar Código"}
            </button>

            <p className="text-sm text-gray-400 text-center pt-1">
              <Link href="/login" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                Voltar para login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

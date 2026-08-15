'use client'

import Link from "next/link";
import { PatternFormat } from 'react-number-format';
import { registrarUsuario } from "./register-actions";
import { useActionState, useState } from "react";


export default function RegisterPage() {

  const [state, formAction] = useActionState(registrarUsuario, { message: "", sucess: false });
  const [showPassword, setShowPassword] = useState(false);
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
          className="w-full rounded-2xl p-8 shadow-2xl"
          style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(0,0,0,0.08)", backdropFilter: "blur(20px)" }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Crie sua conta</h1>
          <p className="text-sm text-gray-500 mb-7">Preencha os dados para começar a gerenciar suas finanças</p>

          <form className="space-y-5" action={formAction}>
            {!state.sucess && state.message.length > 0 && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {state.message}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text" name="name" id="name"
                placeholder="ex: Victor Gabriel"
                required
                className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500"
                style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)" }}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email" name="email" id="email"
                placeholder="email@exemplo.com"
                required
                className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500"
                style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)" }}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Celular</label>
              <PatternFormat
                name="phone" id="phone"
                format="(##) # ####-####"
                mask="_"
                placeholder="(34) 9 9999-9999"
                className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500"
                style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.1)" }}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} name="password" id="password"
                  placeholder="••••••••"
                  required
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


            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 4px 24px rgba(34,197,94,0.3)" }}
            >
              Cadastrar
            </button>

            <p className="text-sm text-gray-500 text-center pt-1">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                Fazer login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
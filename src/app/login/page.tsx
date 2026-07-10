'use client'

import Link from "next/link";
import { realizarLogin } from "./login-actions";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [state, formAction] = useActionState(realizarLogin, { message: "", sucess: false });
  const router = useRouter();

  useEffect(() => {
    if (state.sucess) {
      router.push('/dashboard');
    }
  }, [state.sucess, state.user, router]);

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
          className="w-full rounded-2xl p-8 shadow-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
        >
          <h1 className="text-2xl font-bold text-white mb-3">Bem-vindo de volta</h1>
          <p className="text-sm font-bold text-white mb-7">Entre na sua conta para continuar</p>

          <form className="space-y-5" action={formAction}>
            {!state.sucess && state.message.length > 0 && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-medium rounded-xl px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {state.message}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-white">E-mail</label>
              <input
                type="email" name="email" id="email"
                placeholder="email@exemplo.com"
                required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-white">Senha</label>
              <input
                type="password" name="password" id="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 text-sm outline-none transition-all focus:ring-2 focus:ring-primary-500"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              />
            </div>

            <div className="text-right">
              <Link href="/reset-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                Esqueci a senha
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-lg"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 4px 24px rgba(34,197,94,0.3)" }}
            >
              Entrar
            </button>

            <p className="text-sm text-gray-400 text-center pt-1">
              Novo por aqui?{" "}
              <Link href="/register" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                Criar conta
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

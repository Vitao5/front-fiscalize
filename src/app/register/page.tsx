'use client'

import Link from "next/link";
import { PatternFormat } from 'react-number-format';
import { registrarUsuario } from "./register-actions";
import { useActionState } from "react";


export default function RegisterPage() {

  const [state, formAction] = useActionState(registrarUsuario, { message: "", sucess: false });
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-4 mx-auto w-full max-w-[450px]">
        <Link
          href="#"
          className="flex items-center mb-6 text-2xl font-bold text-primary-800 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Fiscalize Finanças
        </Link>

        <div className="w-full bg-white rounded-lg shadow border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Crie sua conta para gerenciar suas finanças
            </h1>

            <form className="space-y-4 md:space-y-6" action={formAction}>
              <span className={state && !state.sucess && state.message.length != 0 ? 'text-white font-semibold bg-red-500 rounded-lg py-3 flex items-center justify-center ' : 'hidden'}>{state?.message}</span>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  Nome
                </label>
                <input
                  type="name"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-700 focus:border-primary-700 block w-full p-2.5 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="ex: Victor Gabriel"
                  required
                />
              </div>


              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-700 focus:border-primary-700 block w-full p-2.5 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  Celular
                </label>
                <PatternFormat
                  name='phone'
                  id="phone"
                  format="(##) # ####-####"
                  mask="_"
                  placeholder="(34) 9 9999-9999"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-700 focus:border-primary-700 block w-full p-2.5 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"

                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="********"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-700 focus:border-primary-700 block w-full p-2.5 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                >
                  Confirme a Senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="********"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-700 focus:border-primary-700 block w-full p-2.5 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-bold rounded-lg px-5 py-2.5 text-center transition-colors dark:bg-primary-600 dark:hover:bg-primary-700"
              >
                Cadastrar
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                <Link
                  href="/login"
                  className="font-medium text-primary-700 hover:underline dark:text-primary-400"
                >
                  Fazer login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
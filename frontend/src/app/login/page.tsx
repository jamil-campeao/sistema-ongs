"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Footer from "@/components/footer"
import { useUser } from "@/context/userContext"
import { useOng } from "@/context/ongContext"

export default function LoginPage() {
  const { setUser } = useUser()
  const { setOng } = useOng()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError("")
    setInfo("")

    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && response.status === 200) {

        if (data.message !== "ONG") {
          const response = await fetch('/api/users/me', {
            method: 'GET'
          });
          if (!response.ok) {
            setError("Erro ao buscar usuário")
            return
          }
          const userData = await response.json();
          setUser(userData);
        }
        else {
          const response = await fetch('/api/ongs/me', {
            method: 'GET'
          });
          
          if (!response.ok) {
            setError("Erro ao buscar ONG")
            return
          }
          const ongData = await response.json();
          setOng(ongData);
        }
      }

        router.push('/feed');
        router.refresh();
      
      if (!response.ok && response.status === 401) {
        setError("Email ou senha inválidos");
        return
      }
    } catch (err) {
      setError("Erro no login");
      return
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Cabeçalho */}
      <header className="text-center py-10">
        <img src="/logo.png" alt="Logo ONG" className="w-20 h-20 mx-auto mb-2" />
        <h1 className="text-4xl font-bold text-gray-800 font-[Montserrat]">Colabora</h1>
        <p className="text-lg text-gray-600">Website de apoio à ONGs e Projetos Sociais</p>
        <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto px-4">
          Este é um espaço criado para conectar <strong>projetos sociais</strong> a pessoas dispostas a ajudar. Se você tem uma causa ou quer contribuir com uma, aqui é o seu lugar.
        </p>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-grow flex justify-center items-center px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl w-full items-center lg:items-start justify-center">
          {/* Bloco informativo */}
          <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-6">Junte-se à nossa rede!</h2>

            <div className="mb-6">
              <h3 className="flex items-center gap-2 font-medium text-gray-800 text-md">
                <i className="fa-solid fa-hand-holding-heart"></i> Para ONGs
              </h3>
              <p className="text-gray-600 text-sm">
                Dê visibilidade à sua causa! Cadastre seu projeto social e encontre voluntários e recursos para transformar vidas.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="flex items-center gap-2 font-medium text-gray-800 text-md">
                <i className="fa-solid fa-users"></i> Para Voluntários
              </h3>
              <p className="text-gray-600 text-sm">
                Encontre uma causa que combine com você e comece a contribuir como voluntário agora!
              </p>
            </div>

            <div className="text-center">
              <Link href="/signup" className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition">
                Cadastre-se
              </Link>
            </div>
          </div>

          {/* Bloco de login */}
          <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-6">Login Colabora</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>
            )}

            {info && (
              <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md text-sm">{info}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                  maxLength={256}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                  maxLength={20}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" className="h-4 w-4 mr-2 text-blue-600 rounded" />
                  Lembrar-me
                </label>
                <Link href="/forgotpassword" className="text-sm text-blue-600 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium text-sm rounded-full hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer /> 
    </div>
  )
}

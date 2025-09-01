"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Footer from "../../components/footer"
import { envioEmail, geraCodigoEmail } from "../api/email"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
        setError("Por favor, preencha todos os campos")
        return
      }

    const response = await fetch('/api/users/email', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    if (response.status === 404) {
      setError("Email não encontrado")
      return
    }
    else if (response.status === 500) {
      setError("Erro ao validar o email")
      return
    }
    setError("")

    try {
      const codigo = geraCodigoEmail();
      const mensagem = `Olá, seu código de verificação é: ${codigo}.
            Clique no link para redefinir sua senha: http://200.132.38.218:3001/editpassword?email=${encodeURIComponent(email)}&codigo=${encodeURIComponent(codigo)}`;
      
      envioEmail(email, 'Redefinição de Senha', mensagem);
      setIsButtonDisabled(true);
      setCountdown(30);
    }
    catch (error) {
      setError("Erro ao enviar o email de redefinição de senha")
    }

}

useEffect(() => {
  if (countdown > 0) {
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer); //Limpa o timer quando o componente é desmontado ou quando countdown muda
  }
  else {
    setIsButtonDisabled(false); //Reativa o botão de envio quando a contagem regressiva chega a 0
  }
}, [countdown]);

return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="container mx-auto text-center">
            <Link href="/" className="inline-block">
              <img src="/static/logo.webp" alt="Logo" className="w-20 h-20 rounded mx-auto" />
            </Link>
          </div>
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Redefinição de senha</h2>
            <h4 className="mt-6 text-md font-bold text-gray-900">Website de apoio à ONGs e Projetos Sociais</h4>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Informe seu email"
                    maxLength={256}
                  />
                </div>
              </div>

              <div>
                <button
                  id='submit'
                  type="submit"
                  disabled={isButtonDisabled} //Desabilita o botão se necessario
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    ${isButtonDisabled
                       ? "bg-gray-400 cursor-not-allowed"
                       : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }`}
                  
                >
                  Enviar código de redefinição
                </button>
              </div>
            </form>
          </div>

          {isButtonDisabled && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Email não chegou? Tente novamente em {countdown} segundos...
              </div>
          )}

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Já é membro?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Login
              </Link>
            </p>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Novo por aqui?{" "}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
)

}
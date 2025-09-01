"use client"

import Link from "next/link"
import Footer from "@/components/footer" // Reutilizando seu componente de rodapé

export default function ContactPage() {
  const contactEmail = "admin@acad.ufsm.br";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Cabeçalho Adaptado */}
      <header className="text-center py-10">
        <Link href="/"> {/* Link para a página inicial ao clicar no logo/nome */}
          <img src="/logo.png" alt="Logo Colabora" className="w-20 h-20 mx-auto mb-2 cursor-pointer" />
          <h1 className="text-4xl font-bold text-gray-800 font-[Montserrat] cursor-pointer">Colabora</h1>
        </Link>
        <p className="text-2xl text-gray-700 mt-4">Entre em Contato</p>
      </header>

      {/* Conteúdo principal com as informações de Contato */}
      <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-xl shadow-md max-w-2xl w-full text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Fale Conosco
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Adoraríamos ouvir de você! Se você tem alguma dúvida, sugestão, precisa de suporte ou deseja saber mais sobre a Plataforma Colabora, não hesite em nos contatar.
            </p>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Nosso Principal Canal de Contato:</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {/* Ícone removido daqui */}
                <a 
                  href={`mailto:${contactEmail}`} 
                  className="text-lg text-blue-600 hover:text-blue-700 hover:underline font-medium break-all"
                >
                  {contactEmail}
                </a>
              </div>
            </div>

            <p className="mt-6 text-gray-600">
              Nossa equipe se esforçará para responder o mais breve possível. Agradecemos seu contato e interesse em tornar o mundo um lugar melhor através da colaboração!
            </p>
            

            {/* Botão para Voltar para Login */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link 
                href="/login" 
                className="inline-block px-8 py-3 bg-blue-600 text-white font-medium text-base rounded-md hover:bg-blue-700 transition-colors duration-150 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Voltar
              </Link>
            </div>

          </div> {/* Fim do div.space-y-6 */}
        </div> {/* Fim do div.bg-white */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
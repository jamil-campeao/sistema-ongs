"use client"

import Link from "next/link"
import Footer from "@/components/footer" // Reutilizando seu componente de rodapé

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Cabeçalho Adaptado */}
      <header className="text-center py-10">
        <Link href="/"> {/* Link para a página inicial ao clicar no logo/nome */}
          <img src="/logo.png" alt="Logo Colabora" className="w-20 h-20 mx-auto mb-2 cursor-pointer" />
          <h1 className="text-4xl font-bold text-gray-800 font-[Montserrat] cursor-pointer">Colabora</h1>
        </Link>
        <p className="text-2xl text-gray-700 mt-4">Sobre Nós</p>
      </header>

      {/* Conteúdo principal com as informações "Sobre Nós" */}
      <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-xl shadow-md max-w-4xl w-full">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Conheça a Plataforma Colabora
          </h2>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <p className="text-lg">
                Bem-vindo à Colabora, um espaço digital dedicado a fortalecer o impacto de Organizações Não Governamentais (ONGs) e projetos sociais, conectando-os a uma rede de voluntários, doadores e apoiadores apaixonados por fazer a diferença.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Nossa Missão</h3>
              <p>
                Nossa missão é simplificar e potencializar a colaboração no terceiro setor. Acreditamos que, ao fornecer ferramentas intuitivas e um ambiente de conexão transparente, podemos ajudar ONGs a alcançar seus objetivos com maior eficácia e engajar mais pessoas na construção de um futuro melhor e mais justo para todos.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Nossa Visão</h3>
              <p>
                Visualizamos um mundo onde cada boa causa encontra o apoio necessário para prosperar. Queremos ser a ponte que transforma boas intenções em ações concretas, fomentando uma cultura de solidariedade e participação cívica através da tecnologia.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Nossos Valores</h3>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Colaboração:</strong> Acreditamos no poder da união para superar desafios.</li>
                <li><strong>Transparência:</strong> Comprometemo-nos com a clareza em todas as interações e processos na plataforma.</li>
                <li><strong>Impacto:</strong> Focamos em facilitar ações que gerem resultados sociais significativos e mensuráveis.</li>
                <li><strong>Inovação:</strong> Buscamos constantemente novas formas de apoiar e otimizar o trabalho das ONGs e voluntários.</li>
                <li><strong>Empatia:</strong> Colocamo-nos no lugar de nossos usuários para entender e atender às suas necessidades.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Como Funciona</h3>
              <p>
                A Plataforma Colabora permite que ONGs cadastradas divulguem seus projetos, necessidades e eventos, alcançando um público amplo e engajado. Voluntários podem encontrar causas que ressoam com seus interesses e habilidades, inscrever-se para participar de atividades e acompanhar o progresso dos projetos que apoiam. Facilitamos a comunicação, o gerenciamento de voluntários e a promoção de iniciativas sociais, tudo em um só lugar.
              </p>
            </section>
            
            <section>
              <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Junte-se a Nós!</h3>
              <p>
                Se você representa uma ONG em busca de maior visibilidade e apoio, ou é um indivíduo querendo dedicar seu tempo e talento para causas nobres, a Colabora é o seu ponto de encontro. Explore, conecte-se e comece a colaborar hoje mesmo!
              </p>
            </section>

            {/* Botão para Voltar para Login */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <Link 
                href="/login" 
                className="inline-block px-8 py-3 bg-blue-600 text-white font-medium text-base rounded-md hover:bg-blue-700 transition-colors duration-150 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Voltar
              </Link>
            </div>

          </div> {/* Fim do div.space-y-8 */}
        </div> {/* Fim do div.bg-white */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
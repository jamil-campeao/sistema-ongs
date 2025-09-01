"use client"

import Link from "next/link"
import Footer from "@/components/footer" // Reutilizando seu componente de rodapé

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Cabeçalho Adaptado */}
      <header className="text-center py-10">
        <Link href="/"> {/* Link para a página inicial ao clicar no logo/nome */}
          <img src="/logo.png" alt="Logo Colabora" className="w-20 h-20 mx-auto mb-2 cursor-pointer" />
          <h1 className="text-4xl font-bold text-gray-800 font-[Montserrat] cursor-pointer">Colabora</h1>
        </Link>
        <p className="text-2xl text-gray-700 mt-4">Termos de Uso</p>
      </header>

      {/* Conteúdo principal com os Termos de Uso */}
      <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-xl shadow-md max-w-4xl w-full">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
            Termos de Uso da Plataforma Colabora
          </h2>
          <p className="text-sm text-gray-600 mb-8 text-center">
            Última atualização: 26 de maio de 2025
          </p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>Bem-vindo(a) à Plataforma Colabora! Estes Termos de Uso ("Termos") regem seu acesso e uso da nossa plataforma online, incluindo websites, aplicativos móveis e quaisquer outros serviços oferecidos (coletivamente, a "Plataforma"). Ao acessar ou usar a Plataforma, você concorda em cumprir estes Termos. Leia-os com atenção.</p>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Aceitação dos Termos</h3>
              <p>Ao criar uma conta, acessar ou usar qualquer parte da Plataforma Colabora, você confirma que leu, entendeu e concorda em ficar vinculado por estes Termos e pela nossa <Link href="/privacy-policy" className="text-blue-600 hover:underline">Política de Privacidade</Link>, que é incorporada aqui por referência. Se você não concorda com algum destes termos, não deverá utilizar a Plataforma.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Descrição da Plataforma Colabora</h3>
              <p>A Plataforma Colabora é um ambiente digital projetado para conectar Organizações Não Governamentais (ONGs) e projetos sociais a voluntários, doadores e apoiadores. A Plataforma permite que ONGs divulguem suas causas, projetos e necessidades, e que voluntários encontrem oportunidades de contribuição e engajamento cívico.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Cadastro e Contas de Usuário</h3>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">a. Elegibilidade:</h4>
              <p>Para utilizar certas funcionalidades da Plataforma, você deve ter pelo menos 18 anos de idade ou a maioridade legal em sua jurisdição. Ao se cadastrar, você declara e garante que todas as informações fornecidas são verdadeiras, precisas e completas.</p>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">b. Responsabilidades do Usuário:</h4>
              <p>Você é responsável por manter a confidencialidade de suas credenciais de conta (login e senha) e por todas as atividades que ocorram sob sua conta. Você concorda em notificar imediatamente a Colabora sobre qualquer uso não autorizado de sua conta. A Plataforma não se responsabiliza por perdas ou danos decorrentes do seu descumprimento desta obrigação.</p>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">c. Tipos de Usuários e Responsabilidades Específicas:</h4>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li><strong>Administrador da ONG e Colaborador:</strong> Ao cadastrar uma ONG, você declara ter autoridade para representá-la. É responsável pela veracidade das informações da ONG e dos projetos, pela gestão adequada dos voluntários e pela comunicação transparente.</li>
                <li><strong>Voluntário:</strong> Você se compromete a agir de boa fé, respeitar as diretrizes dos projetos aos quais se vincula e a manter uma conduta ética e respeitosa com todos os membros da comunidade Colabora.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Uso da Plataforma e Conteúdo</h3>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">a. Conteúdo Gerado pelo Usuário:</h4>
              <p>Você é o único responsável por todo o conteúdo (textos, imagens, vídeos, etc.) que publica, envia ou exibe na Plataforma ("Conteúdo do Usuário"). Você declara e garante que possui todos os direitos necessários sobre o seu Conteúdo do Usuário e que ele não viola direitos de terceiros nem leis aplicáveis.</p>
              <p>A Plataforma Colabora não reivindica propriedade sobre o seu Conteúdo do Usuário. No entanto, ao publicá-lo, você nos concede uma licença mundial, não exclusiva, isenta de royalties, sublicenciável e transferível para usar, reproduzir, distribuir, preparar trabalhos derivados, exibir e executar esse Conteúdo do Usuário em conexão com a operação da Plataforma e para promover nossos serviços.</p>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">b. Propriedade Intelectual da Plataforma:</h4>
              <p>Todo o conteúdo da Plataforma, incluindo design, texto, gráficos, logotipos, ícones e software (exceto o Conteúdo do Usuário), é propriedade exclusiva da Colabora ou de seus licenciadores e é protegido por leis de direitos autorais e outras leis de propriedade intelectual.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Conduta do Usuário e Restrições</h3>
              <p>Ao utilizar a Plataforma Colabora, você concorda em não:</p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Violar quaisquer leis ou regulamentos aplicáveis.</li>
                <li>Publicar conteúdo falso, enganoso, difamatório, obsceno, ofensivo, ou que promova discurso de ódio ou discriminação.</li>
                <li>Utilizar a Plataforma para fins fraudulentos ou ilegais.</li>
                <li>Assediar, ameaçar ou prejudicar outros usuários.</li>
                <li>Interferir ou tentar interferir no funcionamento adequado da Plataforma, incluindo o uso de vírus, spam ou outras tecnologias prejudiciais.</li>
                <li>Coletar informações de outros usuários sem o consentimento deles.</li>
                <li>Criar contas falsas ou se passar por outra pessoa ou entidade.</li>
              </ul>
              <p>Reservamo-nos o direito de remover conteúdo e suspender ou encerrar contas que violem estas diretrizes, a nosso exclusivo critério.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Limitação de Responsabilidade e Isenção de Garantias</h3>
              <p>A PLATAFORMA COLABORA É FORNECIDA "COMO ESTÁ" E "CONFORME DISPONÍVEL", SEM GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS, INCLUINDO, MAS NÃO SE LIMITANDO A, GARANTIAS DE COMERCIALIZAÇÃO, ADEQUAÇÃO A UM FIM ESPECÍFICO E NÃO VIOLAÇÃO.</p>
              <p>NÃO GARANTIMOS QUE A PLATAFORMA SERÁ ININTERRUPTA, SEGURA OU LIVRE DE ERROS, OU QUE OS RESULTADOS OBTIDOS COM O USO DA PLATAFORMA SERÃO PRECISOS OU CONFIÁVEIS. VOCÊ CONCORDA QUE O USO DA PLATAFORMA É POR SUA CONTA E RISCO.</p>
              <p>EM NENHUMA CIRCUNSTÂNCIA A COLABORA, SEUS DIRETORES, FUNCIONÁRIOS OU AGENTES SERÃO RESPONSÁVEIS POR QUAISQUER DANOS INDIRETOS, INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU PUNITIVOS DECORRENTES DO SEU USO OU INCAPACIDADE DE USAR A PLATAFORMA.</p>
            </section>

             <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Privacidade e Proteção de Dados</h3>
              <p>A coleta e o uso de suas informações pessoais são regidos pela nossa <Link href="/privacy-policy" className="text-blue-600 hover:underline">Política de Privacidade</Link>. Ao usar a Plataforma, você consente com tal coleta e uso.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Alterações nos Termos de Uso</h3>
              <p>A Plataforma Colabora reserva-se o direito de modificar estes Termos a qualquer momento. Notificaremos sobre alterações significativas publicando os Termos revisados na Plataforma e atualizando a data da "Última atualização". O uso continuado da Plataforma após tais alterações constitui sua aceitação dos novos Termos.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Rescisão</h3>
              <p>Podemos suspender ou encerrar seu acesso à Plataforma, a nosso exclusivo critério, por qualquer motivo, incluindo a violação destes Termos, sem aviso prévio. Você pode encerrar sua conta a qualquer momento, seguindo as instruções na Plataforma.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Disposições Gerais</h3>
              <p>Estes Termos serão regidos e interpretados de acordo com as leis da República Federativa do Brasil. Se qualquer disposição destes Termos for considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito. Estes Termos constituem o acordo integral entre você e a Colabora em relação ao uso da Plataforma.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11. Contato</h3>
              <p>Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco através do e-mail: admin@acad.ufsm.br.</p>
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

          </div> {/* Fim do div.space-y-6 */}
        </div> {/* Fim do div.bg-white */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
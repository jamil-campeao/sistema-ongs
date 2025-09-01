"use client"

import Link from "next/link"
import Footer from "@/components/footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Cabeçalho Adaptado */}
      <header className="text-center py-10">
        <Link href="/"> {/* Link para a página inicial ao clicar no logo/nome */}
          <img src="/logo.png" alt="Logo ONG" className="w-20 h-20 mx-auto mb-2 cursor-pointer" />
          <h1 className="text-4xl font-bold text-gray-800 font-[Montserrat] cursor-pointer">Colabora</h1>
        </Link>
        <p className="text-2xl text-gray-700 mt-4">Política de Privacidade</p>
      </header>

      {/* Conteúdo principal com a Política de Privacidade */}
      <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-xl shadow-md max-w-4xl w-full">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Política de Privacidade da Plataforma Colabora
          </h2>
          <p className="text-sm text-gray-600 mb-8 text-center">
            Última atualização: 26 de maio de 2025
          </p>

          <div className="space-y-6 text-gray-700">
            <p>Bem-vindo(a) à Política de Privacidade da plataforma Colabora. Esta política descreve como nós, coletamos, usamos, compartilhamos e protegemos as informações pessoais e institucionais fornecidas por você ou coletadas durante o uso da nossa Plataforma.</p>
            <p>Nosso compromisso é com a sua privacidade e a proteção dos seus dados.</p>

            {/* 1. Definições Importantes */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Definições Importantes:</h3>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Plataforma:</strong> Refere-se ao sistema de apoio a ONGs, incluindo as páginas de cadastro, exibição de projetos sociais, perfis de usuário, feeds de atividades e demais funcionalidades descritas no Documento de Requisitos.</li>
                <li><strong>Usuários:</strong> Termo genérico para todos os indivíduos que interagem com a plataforma. Os usuários são diferenciados pelos seguintes papéis principais:
                  <ul className="list-circle list-inside space-y-1 pl-6 mt-1">
                    <li><strong>Administrador da ONG:</strong> Usuário responsável pela gestão da ONG na plataforma, podendo cadastrar projetos, gerenciar colaboradores da ONG, fazer e interagir com publicações próprias da ONG.</li>
                    <li><strong>Colaborador:</strong> Participante da ONG, autorizado pelo Administrador da ONG, que pode auxiliar na administração dos projetos, gerenciar inscrições e publicar atualizações.</li>
                    <li><strong>Voluntário:</strong> Usuário comum que pode visualizar projetos, se inscrever para contribuir, interagir em publicações por meio de comentários e seguir projetos.</li>
                    <li><strong>Administrador da Plataforma:</strong> Membros da equipe responsável pela manutenção e gestão da Plataforma [Nome da Sua Plataforma/Sistema], com funcionalidades herdadas para administração do sistema.</li>
                  </ul>
                </li>
                <li><strong>Dados Pessoais:</strong> Qualquer informação relacionada a uma pessoa natural identificada ou identificável (ex: nome, e-mail, telefone, foto de perfil, histórico de interações).</li>
                <li><strong>Dados Institucionais:</strong> Informações relacionadas a uma ONG (ex: CNPJ, nome da ONG, endereço, dados de contato institucionais, projetos sociais vinculados).</li>
                <li><strong>Tratamento de Dados:</strong> Qualquer operação realizada com dados pessoais, como as descritas na LGPD.</li>
                <li><strong>LGPD:</strong> Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).</li>
              </ul>
            </section>

            {/* 2. Informações que Coletamos */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Informações que Coletamos:</h3>
              <p>Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:</p>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">a. Informações fornecidas diretamente pelos Usuários:</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Para todos os tipos de Usuários (Administrador da ONG, Colaborador, Voluntário):</strong>
                  <ul className="list-circle list-inside space-y-1 pl-6 mt-1">
                    <li>Dados de cadastro: Nome, e-mail e senha válidos.</li>
                    <li>Dados de perfil: Foto de perfil (opcional) e outras informações que o usuário opte por fornecer ou alterar em seu perfil.</li>
                  </ul>
                </li>
                <li><strong>Adicionalmente para Administradores de ONGs e Colaboradores:</strong>
                  <ul className="list-circle list-inside space-y-1 pl-6 mt-1">
                    <li>Dados da ONG: Nome da ONG, CNPJ (ou identificador equivalente), endereço, telefone, e-mail institucional, website, logomarca.</li>
                    <li>Dados dos Projetos Sociais: Nome do projeto, descrição detalhada, tipos de contribuições possíveis, fotos de capa, fotos complementares, campo personalizável "Como ajudar?", categoria, localização, tipo de voluntariado, links para redes sociais oficiais do projeto.</li>
                    <li>Conteúdo de publicações (posts) realizadas na plataforma.</li>
                  </ul>
                </li>
                <li><strong>Adicionalmente para Voluntários:</strong>
                  <ul className="list-circle list-inside space-y-1 pl-6 mt-1">
                    <li>Informações fornecidas ao manifestar interesse ou se inscrever em projetos, eventos ou atividades, que podem incluir dados solicitados no formulário de inscrição específico.</li>
                    <li>Conteúdo de comentários feitos em postagens.</li>
                    <li>Mensagens diretas enviadas para projetos (via formulário de contato ou chat).</li>
                  </ul>
                </li>
              </ul>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">b. Informações Coletadas Automaticamente durante o uso da Plataforma:</h4>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Dados de Navegação: Endereço IP, tipo e versão do navegador, sistema operacional, informações sobre o dispositivo, páginas visitadas dentro da Plataforma, tempo de permanência, datas e horários de acesso, e outros dados de diagnóstico.</li>
                <li>Histórico de Interações do Usuário: Projetos seguidos, comentados, atividades recentes do usuário na plataforma.</li>
                <li>Dados de Interação com Projetos: Informações sobre visualizações de projetos, interações e inscrições para fins estatísticos do painel de controle dos Colaboradores/Administradores de ONG.</li>
                <li>Cookies e Tecnologias Semelhantes: Utilizamos cookies para melhorar a experiência do usuário, lembrar preferências, para fins analíticos e para o funcionamento de certas funcionalidades. Consulte nossa seção "Cookies e Tecnologias de Rastreamento" para mais detalhes.</li>
              </ul>
            </section>

            {/* 3. Como Usamos Suas Informações */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Como Usamos Suas Informações:</h3>
              <p>Utilizamos as informações coletadas para as seguintes finalidades:</p>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">Operação e Manutenção da Plataforma:</h4>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Permitir a criação, autenticação e gerenciamento de contas de usuário e seus respectivos perfis (Administrador da ONG, Colaborador, Voluntário).</li>
                <li>Possibilitar a redefinição de senha através do e-mail cadastrado.</li>
                <li>Permitir que Administradores de ONGs e Colaboradores cadastrem, editem e gerenciem informações de suas ONGs e projetos sociais, incluindo fotos.</li>
                <li>Exibir perfis de ONGs e projetos sociais para consulta pública.</li>
                <li>Processar manifestações de interesse e inscrições de Voluntários em projetos, eventos ou atividades, incluindo o envio de confirmações por e-mail, quando aplicável.</li>
                <li>Facilitar a comunicação direta entre Voluntários e projetos através de mensagens ou chat.</li>
                <li>Exibir comentários em postagens e permitir que Administradores de Projetos/Colaboradores respondam.</li>
                <li>Permitir que Usuários (ONGs/Colaboradores) realizem publicações no feed.</li>
                <li>Disponibilizar um feed com postagens dos projetos seguidos pelo usuário e um menu de atividades recentes.</li>
              </ul>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">Comunicação e Notificações:</h4>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Enviar alertas e notificações sobre novas interações (comentários, mensagens, atualizações de projetos acompanhados), seja por e-mail ou diretamente na plataforma.</li>
                <li>Comunicar sobre atualizações da Plataforma, questões de suporte técnico e informações administrativas.</li>
              </ul>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">Personalização e Melhoria:</h4>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Disponibilizar e permitir a alteração de dados do perfil do usuário, incluindo foto.</li>
                <li>Exibir o histórico de interações do usuário.</li>
                <li>Habilitar a funcionalidade de busca de projetos por nome, categoria, localização, tipo de voluntariado e filtros por popularidade, data de criação ou área de atuação.</li>
                <li>Fornecer painéis de controle para Administradores de ONGs e Colaboradores com estatísticas sobre visualizações, interações e inscrições em seus projetos.</li>
                <li>Analisar o uso da Plataforma para entender tendências, otimizar a experiência do usuário e desenvolver novas funcionalidades (de forma agregada e anonimizada sempre que possível).</li>
              </ul>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">Funcionalidades Adicionais:</h4>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Permitir o compartilhamento de projetos em redes sociais externas (WhatsApp, Facebook, Instagram, Twitter/X).</li>
                <li>Apresentar um tutorial explicativo sobre como divulgar um projeto na plataforma.</li>
              </ul>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">Segurança e Conformidade Legal:</h4>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Garantir a segurança da Plataforma e proteger os dados dos usuários.</li>
                <li>Cumprir obrigações legais e regulatórias.</li>
                <li>Responder a solicitações judiciais ou de autoridades competentes.</li>
              </ul>
            </section>

            {/* 4. Compartilhamento de Informações */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Compartilhamento de Informações:</h3>
              <p>Não vendemos suas informações pessoais ou institucionais. Podemos compartilhar informações nas seguintes circunstâncias:</p>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">a. Publicamente na Plataforma:</h4>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Informações do perfil da ONG (nome, descrição, contatos fornecidos pela ONG, logo) e dos projetos sociais (nome, descrição, fotos, como ajudar, categoria, localização, tipo de voluntariado, links para redes sociais do projeto) são visíveis publicamente.</li>
                    <li>Publicações feitas por ONGs/Colaboradores e os comentários associados são visíveis aos usuários que acessam essas postagens.</li>
                    <li>O nome de usuário e, possivelmente, a foto de perfil de quem comenta ou interage podem ser visíveis.</li>
                </ul>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">b. Com outros Usuários da Plataforma (de forma direcionada):</h4>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Mensagens diretas enviadas por um Voluntário a um projeto são compartilhadas com os Administradores/Colaboradores daquele projeto.</li>
                    <li>Quando um Voluntário se inscreve em um evento ou atividade, as informações da inscrição são compartilhadas com o Administrador/Colaborador do projeto responsável.</li>
                </ul>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">c. Com Provedores de Serviços Terceirizados:</h4>
                <p className="pl-4">Podemos contratar terceiros para realizar serviços em nosso nome (ex: provedores de hospedagem de sites e bancos de dados, serviços de armazenamento de imagens, ferramentas de análise, serviços de envio de e-mail para notificações e redefinição de senha). Esses provedores terão acesso às informações necessárias apenas para executar essas tarefas em nosso nome e são obrigados a não divulgá-las ou usá-las para qualquer outra finalidade, mantendo padrões de segurança e confidencialidade.</p>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">d. Através de Integrações com Redes Sociais:</h4>
                <p className="pl-4">Ao utilizar a funcionalidade de compartilhamento de projetos em redes sociais externas, você estará sujeito às políticas de privacidade dessas respectivas plataformas. A Plataforma [Nome da Sua Plataforma/Sistema] apenas facilita o direcionamento e o pré-preenchimento de informações básicas do projeto para compartilhamento.</p>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">e. Por Razões Legais:</h4>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Se formos obrigados por lei, processo legal, litígio e/ou solicitações de autoridades públicas e governamentais.</li>
                    <li>Para proteger nossos direitos, privacidade, segurança ou propriedade, e/ou os de nossos usuários ou do público.</li>
                </ul>
              <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">f. Com Consentimento:</h4>
                <p className="pl-4">Podemos compartilhar suas informações com terceiros para outras finalidades não descritas aqui, quando tivermos seu consentimento explícito para fazê-lo.</p>
            </section>

            {/* 5. Segurança dos Dados */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Segurança dos Dados:</h3>
              <p>Empregamos medidas técnicas e administrativas para proteger os dados pessoais e institucionais, como o uso de criptografia para senhas e dados sensíveis (Requisito Não Funcional 3.1). Nossas práticas de coleta, armazenamento e processamento de informações são revisadas buscando aprimorar a segurança. Apesar de nossos esforços, é importante reconhecer que nenhum sistema de segurança é completamente impenetrável. Caso ocorra qualquer incidente de segurança que possa acarretar risco ou dano relevante aos titulares, comunicaremos aos afetados e à Autoridade Nacional de Proteção de Dados (ANPD), conforme previsto na LGPD. Informamos que, conforme definido no Documento de Requisitos, funcionalidades como autenticação de dois fatores (2FA), backups automáticos e estratégias de recuperação rápida em caso de falhas não estão previstas para desenvolvimento nesta fase do projeto. Encorajamos os usuários a adotarem boas práticas de segurança com suas próprias credenciais.</p>
            </section>

            {/* 6. Retenção de Dados */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6. Retenção de Dados:</h3>
              <p>Reteremos suas informações pessoais e institucionais apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletadas, inclusive para fins de cumprimento de quaisquer obrigações legais, contratuais, de prestação de contas ou requisição de autoridades competentes.</p>
              <ul className="list-disc list-inside space-y-2 pl-4 mt-2">
                <li><strong>Dados de Usuários, ONGs e Projetos:</strong> Serão mantidos enquanto a conta do usuário ou da ONG estiver ativa na Plataforma. Após a exclusão da conta ou do projeto, os dados poderão ser mantidos por um período adicional para fins legais ou de auditoria, sendo posteriormente anonimizados ou excluídos de forma segura.</li>
                <li><strong>Dados de Navegação e Interação:</strong> Podem ser retidos por períodos variáveis para fins de análise, segurança e melhoria da plataforma.</li>
              </ul>
            </section>

            {/* 7. Seus Direitos como Titular dos Dados (LGPD) */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7. Seus Direitos como Titular dos Dados (LGPD):</h3>
              <p>De acordo com a LGPD, você (como pessoa natural) tem o direito de:</p>
              <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                <li>Confirmação da existência de tratamento.</li>
                <li>Acesso aos dados.</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados (você pode alterar dados do seu perfil e senha diretamente na plataforma).</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.</li>
                <li>Portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa.</li>
                <li>Eliminação dos dados pessoais tratados com o consentimento do titular, exceto nas hipóteses previstas em lei.</li>
                <li>Informação das entidades públicas e privadas com as quais o controlador realizou uso compartilhado de dados.</li>
                <li>Informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa.</li>
                <li>Revogação do consentimento.</li>
              </ul>
              <p className="mt-2">Para exercer seus direitos, entre em contato conosco através do e-mail: <strong>[Seu E-mail de Contato para Privacidade]</strong>. Os Administradores de ONGs e Colaboradores também podem gerenciar e atualizar muitas das informações de suas organizações e projetos diretamente através de seus painéis de controle na Plataforma.</p>
            </section>

            {/* 8. Cookies e Tecnologias de Rastreamento */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8. Cookies e Tecnologias de Rastreamento:</h3>
              <p>Utilizamos cookies e tecnologias semelhantes para:</p>
              <ul className="list-disc list-inside space-y-1 pl-4 mt-2">
                <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento da Plataforma (ex: login de usuários, gerenciamento de sessão).</li>
                <li><strong>Cookies de Desempenho e Análise:</strong> Coletam informações sobre como os usuários utilizam a Plataforma (ex: Google Analytics) para nos ajudar a entender o uso e melhorar o sistema.</li>
                <li><strong>Cookies de Funcionalidade:</strong> Permitem que a Plataforma se lembre de escolhas que você fez (como preferências de idioma, projetos seguidos para o feed) e forneça recursos aprimorados.</li>
              </ul>
              <p className="mt-2">Você pode configurar seu navegador para recusar cookies ou para indicar quando um cookie está sendo enviado. No entanto, algumas funcionalidades da Plataforma podem não operar corretamente sem eles.</p>
            </section>

            {/* 9. Privacidade de Crianças e Adolescentes */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9. Privacidade de Crianças e Adolescentes:</h3>
              <p>Nossa Plataforma não se destina a indivíduos menores de 18 anos. Não coletamos intencionalmente informações pessoais de crianças e adolescentes. Se você é pai/mãe ou responsável e tomou conhecimento de que seu filho(a) nos forneceu dados pessoais, entre em contato conosco.</p>
            </section>

            {/* 10. Transferência Internacional de Dados */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10. Transferência Internacional de Dados:</h3>
              <p>Seus dados podem ser transferidos para — e mantidos em — computadores localizados fora do seu país, onde as leis de proteção de dados podem diferir. Seus dados, incluindo dados pessoais, são processados no Brasil (ou onde nossos servidores de hospedagem estiverem localizados). Seu consentimento a esta Política de Privacidade, seguido pelo envio de tais informações, representa sua concordância com essa transferência.</p>
            </section>

            {/* 11. Links para Outros Sites */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">11. Links para Outros Sites:</h3>
              <p>Nossa Plataforma pode conter links para outros sites que não são operados por nós (ex: sites das próprias ONGs, plataformas de doação referenciadas). Se você clicar em um link de terceiros, será direcionado para o site desse terceiro. Não temos controle e não assumimos responsabilidade pelo conteúdo ou políticas de privacidade de sites ou serviços de terceiros.</p>
            </section>

            {/* 12. Alterações a Esta Política de Privacidade */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">12. Alterações a Esta Política de Privacidade:</h3>
              <p>Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações, publicando a nova Política de Privacidade nesta página e atualizando a data da "Última atualização" no topo. Recomendamos que você revise esta Política periodicamente.</p>
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
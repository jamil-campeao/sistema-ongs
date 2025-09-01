"use client"

import type React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Footer from "../../components/footer"
import LogoutButton from "@/components/logout-button";

// --- Interface para o objeto Invite ---
interface Invite {
  id: number;
  userId: number;
  ongId: number;
  status: 'INVITE_PENDING_ONG_TO_USER' | 'ACCEPTED' | 'REJECTED_BY_USER';

  ong: {
    id: number;
    nameONG: string;
    emailONG: string;
  };

  user: {
      id: number;
      name: string;
      email: string;
  };
  rejectionReason?: string | null;
}
// --- Fim da Interface ---


export default function InviteResponsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [inviteId, setInviteId] = useState<number | null>(null);
  const [inviteDetails, setInviteDetails] = useState<Invite | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  // 1. Obter inviteId da URL e validar
  useEffect(() => {
    const idFromUrl = searchParams.get("inviteId");
    if (idFromUrl) {
      setInviteId(parseInt(idFromUrl));
    } else {
      setError("ID do convite não encontrado na URL.");
      setIsLoading(false);
    }
  }, [searchParams]);

  // 2. Carregar Detalhes do Convite
  useEffect(() => {
    async function fetchInviteDetails() {
      if (!inviteId) return; // Só busca se o inviteId estiver disponível

      setIsLoading(true);
      setError(null);
      setResponseMessage(null);
      try {
        // Rota backend para buscar detalhes de um convite específico por ID
        // Você precisará criar /api/invites/:inviteId no seu backend
        const response = await fetch(`/api/invites/${inviteId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw (errorData.error.message || "Erro ao carregar detalhes do convite.");
        }
        const data: Invite = await response.json();

        // Validação: Checar se o convite está pendente e se é para o usuário correto (opcional, mas bom)
        // Se o usuário já está logado, você pode comparar data.userId com user?.id
        // Para simplificar, vamos assumir que o inviteId é suficiente aqui.
        if (data.status !== 'INVITE_PENDING_ONG_TO_USER') {
            setError("Este convite já foi respondido ou é inválido.");
            setInviteDetails(data); // Ainda mostra os detalhes, mas com erro
            return;
        }

        setInviteDetails(data);
      } catch (err: any) {
        setError(err || "Não foi possível carregar os detalhes do convite.");
      } finally {
        setIsLoading(false);
      }
    }

    if (inviteId) {
      fetchInviteDetails();
    }
  }, [inviteId]); // Depende do inviteId do estado local

  // 3. Lógica para Aceitar ou Rejeitar Convite
  const handleResponse = async (accepted: boolean) => {
    if (!inviteDetails || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setResponseMessage(null);

    const newStatus = accepted ? 'ACCEPTED' : 'REJECTED_BY_USER';
    const reason = accepted ? null : rejectionReason.trim() || null;

    try {
      const response = await fetch(`/api/invites/${inviteDetails.id}/respond`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, rejectionReason: reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw (errorData.error.message || `Falha ao responder ao convite (Status: ${response.status})`);
      }

      const apiResponse = await response.json();
      setResponseMessage(apiResponse.message || "Sua resposta foi registrada com sucesso!");
      setInviteDetails(prev => ({ ...prev!, status: newStatus, rejectionReason: reason })); // Atualiza localmente
      
      // Opcional: Redirecionar após sucesso
      // setTimeout(() => router.push('/dashboard-colaborador'), 3000);

    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao registrar sua resposta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="text-center">Carregando detalhes do convite...</div>
      </div>
    );
  }

  if (error && !inviteDetails) { // Se não conseguiu carregar os detalhes do convite
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-bold text-red-600">Erro ao Carregar Convite</h2>
          <p className="text-gray-700">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">Voltar para o Início</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Se o convite não for encontrado ou já foi respondido
  if (!inviteDetails) {
      return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Convite Não Encontrado</h2>
                <p className="text-gray-700">O convite com o ID {inviteId} não foi encontrado ou é inválido.</p>
                <Link href="/" className="text-blue-600 hover:underline">Voltar para o Início</Link>
            </div>
            <Footer />
        </div>
      );
  }

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
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Resposta ao Convite</h2>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
            {responseMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">{responseMessage}</div>}

            {!responseMessage && inviteDetails.status === 'INVITE_PENDING_ONG_TO_USER' ? (
                // Formulário de resposta se o convite estiver pendente
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                        A ONG <span className="text-blue-600">{inviteDetails.ong.nameONG}</span> te convidou para ser colaborador!
                    </h3>
                    <p className="text-gray-700">
                        Por favor, aceite ou rejeite o convite.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                                Motivo da Rejeição (Opcional)
                            </label>
                            <textarea
                                id="rejectionReason"
                                name="rejectionReason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Informe o motivo caso queira rejeitar..."
                                disabled={isSubmitting}
                            ></textarea>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => handleResponse(true)} // Aceitar
                                disabled={isSubmitting}
                                className="flex-1 justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Aceitando...' : 'Aceitar Convite'}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleResponse(false)} // Rejeitar
                                disabled={isSubmitting}
                                className="flex-1 justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Rejeitando...' : 'Rejeitar Convite'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Mensagem se o convite já foi respondido
                <div className="text-center space-y-4">
                    {inviteDetails.status === 'ACCEPTED' && (
                        <p className="text-green-600 font-semibold">
                            Convite da ONG {inviteDetails.ong.nameONG} já foi ACEITO por você. Boas-vindas!
                        </p>
                    )}
                    {inviteDetails.status === 'REJECTED_BY_USER' && (
                        <p className="text-red-600 font-semibold">
                            Você REJEITOU o convite da ONG {inviteDetails.ong.nameONG}.
                            {inviteDetails.rejectionReason && ` Motivo: "${inviteDetails.rejectionReason}"`}
                        </p>
                    )}
                    {responseMessage && <p className="text-gray-700">{responseMessage}</p>}
                    <div className="text-center mt-4 p-4 bg-yellow-50 rounded-md shadow-sm"> {/* Adiciona um fundo e padding para destaque */}
                      <p className="text-sm text-yellow-800 mb-2"> {/* Mensagem de alerta */}
                        É necessário realizar o **logout** para atualizar os dados do usuário.
                      </p>
                      <LogoutButton />
                    </div>
                </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
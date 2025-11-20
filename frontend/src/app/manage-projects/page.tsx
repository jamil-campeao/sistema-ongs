"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { envioEmail } from "@/api/email";
import Header from "@/components/header";
import Footer from "../../components/footer";
import type { EmailResponse } from "@/interfaces/index";

// --- Interfaces (definidas acima ou importadas) ---
interface VolunteerUser {
  id: number;
  name: string;
  email: string;
}

interface ProjectData {
  id: number;
  name: string;
}

interface VolunteerRequest {
  id: number;
  userId: number;
  projectId: number;
  status: "REQUEST_PENDING_USER_TO_ONG" | "ACCEPTED" | "REJECTED_BY_ONG";
  user: VolunteerUser;
  project: ProjectData;
  rejectionReason?: string | null;
}

interface ProcessRequestResponse {
  message: string;
  updatedRequest?: VolunteerRequest;
}
// --- Fim das Interfaces ---

export default function ManageProjectVolunteersPage() {
  const { user } = useUser();
  const router = useRouter();

  // --- Estados para as 3 listas de solicitações de voluntários ---
  const [pendingRequests, setPendingRequests] = useState<VolunteerRequest[]>(
    []
  );
  const [acceptedVolunteers, setAcceptedVolunteers] = useState<
    VolunteerRequest[]
  >([]);
  const [rejectedVolunteers, setRejectedVolunteers] = useState<
    VolunteerRequest[]
  >([]);
  // --- Fim dos novos estados ---

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(
    null
  ); // Para desabilitar botões

  // Estados para o modal de rejeição
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentRejectRequestId, setCurrentRejectRequestId] = useState<
    number | null
  >(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  // Redireciona se a ONG não estiver logada ou não tiver permissão
  useEffect(() => {
    // Adicione uma validação da role aqui para garantir que apenas 'COLABORADOR' ou 'ONG' podem acessar
    if (!user || !user.id) {
      router.push("/login");
      return;
    }

    if (user.role !== "COLLABORATOR") {
      router.push("/login");
      return;
    }
  }, [user, router]);

  async function sendNotificationEmail(
    updatedRequest: VolunteerRequest,
    ongName: string,
    isAccepted: boolean,
    rejectionReason: string | null
  ) {
    // Validação para garantir que os dados necessários existem
    if (!updatedRequest.user || !updatedRequest.project) {
      console.error("Dados incompletos para enviar e-mail de notificação.");
      return;
    }

    const { user, project } = updatedRequest;
    const volunteerEmail = user.email;
    const volunteerName = user.name;
    const projectName = project.name;

    let emailSubject: string;
    let emailMessage: string;

    if (isAccepted) {
      emailSubject = `Boas-vindas ao Projeto ${projectName} da ONG ${ongName}!`;
      emailMessage = `Olá ${volunteerName},\n\nSua solicitação para ser voluntário no projeto "${projectName}" foi aceita pela ONG ${ongName}!\n\nBoas-vindas!\n\nAtenciosamente,\nEquipe ${ongName}`;
    } else {
      emailSubject = `Sua solicitação de voluntariado para "${projectName}" foi rejeitada.`;
      const reasonText = rejectionReason
        ? `Motivo: ${rejectionReason}\n\n`
        : "";
      emailMessage = `Olá ${volunteerName},\n\nSua solicitação para ser voluntário no projeto "${projectName}" da ONG ${ongName} foi rejeitada.\n${reasonText}Atenciosamente,\nEquipe ${ongName}`;
    }

    try {
      const sendEmail = await fetch(`/api/email/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailSubject: volunteerEmail,
          subject: emailSubject,
          message: emailMessage,
        }),
      });

      const emailResponse: EmailResponse = await sendEmail.json();

      if (!emailResponse.success) {
        throw new Error(emailResponse.error || "Falha ao enviar e-mail");
      }

      alert(`E-mail de notificação enviado ao voluntário.`);
    } catch (emailError) {
      console.error("Falha ao enviar e-mail de notificação:", emailError);
      alert(
        "A solicitação foi processada, mas houve um erro ao enviar o e-mail de notificação."
      );
    }
  }

  // Função para carregar TODAS as solicitações de voluntariado para os projetos da ONG
  const fetchAllProjectVolunteerRequests = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/ongs/${user.ong?.id}/project-volunteer-requests`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erro ao carregar solicitações de voluntariado."
        );
      }
      const data: VolunteerRequest[] = await response.json();

      // Filtrar e preencher as listas com base no status
      setPendingRequests(
        data.filter((req) => req.status === "REQUEST_PENDING_USER_TO_ONG")
      );
      setAcceptedVolunteers(data.filter((req) => req.status === "ACCEPTED"));
      setRejectedVolunteers(
        data.filter((req) => req.status === "REJECTED_BY_ONG")
      );
    } catch (err: any) {
      console.error("Erro ao carregar solicitações de voluntariado:", err);
      setError(
        err.message ||
          "Não foi possível carregar as solicitações de voluntariado."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Chama a função para carregar as listas ao montar o componente ou quando a ONG muda
  useEffect(() => {
    if (user?.ong?.id) {
      fetchAllProjectVolunteerRequests();
    }
  }, [user]);

  // Função para aceitar ou rejeitar uma solicitação de voluntariado
  const handleProcessRequest = async (requestId: number, accepted: boolean) => {
    // 1. Validações iniciais (Guard Clauses)
    if (!user?.ong?.id || processingRequestId) return;
    if (!user.ong.emailONG || !user.ong.nameONG) {
      alert("Erro: Dados da ONG logada incompletos para notificação.");
      return;
    }

    setProcessingRequestId(requestId);
    setError(null);
    const reason = accepted ? null : rejectionReasonInput.trim() || null;

    try {
      // 2. Faz a chamada à API
      const newStatus = accepted ? "ACCEPTED" : "REJECTED_BY_ONG";
      const response = await fetch(`/api/projects/${requestId}/respond`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, rejectionReason: reason }),
      });

      const apiResponse: ProcessRequestResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          apiResponse.message ||
            `Falha ao ${accepted ? "aceitar" : "rejeitar"} solicitação.`
        );
      }

      alert(apiResponse.message); // Exibe mensagem de sucesso da API

      // 3. Atualiza a UI
      await fetchAllProjectVolunteerRequests();

      // 4. Chama a função de e-mail (responsabilidade delegada)
      if (apiResponse.updatedRequest) {
        await sendNotificationEmail(
          apiResponse.updatedRequest,
          user.ong.nameONG,
          accepted,
          reason
        );
      }
    } catch (err: any) {
      console.error(
        `Erro ao ${accepted ? "aceitar" : "rejeitar"} solicitação:`,
        err
      );
      setError(err.message);
    } finally {
      // 5. Limpa o estado
      setProcessingRequestId(null);
      setShowRejectModal(false);
      setRejectionReasonInput("");
    }
  };

  // Funções para o modal de rejeição
  const openRejectModal = (requestId: number) => {
    setCurrentRejectRequestId(requestId);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (currentRejectRequestId) {
      handleProcessRequest(currentRejectRequestId, false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">Carregando painel de voluntários...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center text-red-500">Erro: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <br />
      <main className="container mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-6">
          Gerenciar Voluntários de Projetos para {user?.ong?.nameONG}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* 1. Solicitações Pendentes */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            1. Solicitações Pendentes
          </h2>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-600">
              Nenhuma solicitação de voluntariado pendente.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pendingRequests.map((req) => (
                <li
                  key={req.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {req.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Email: {req.user.email}
                    </p>
                    <p className="text-sm text-gray-700">
                      Projeto:{" "}
                      <span className="font-semibold">{req.project.name}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProcessRequest(req.id, true)} // Aceitar
                      disabled={processingRequestId === req.id}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {processingRequestId === req.id
                        ? "Aceitando..."
                        : "Aceitar"}
                    </button>
                    <button
                      onClick={() => openRejectModal(req.id)} // Abrir modal de rejeição
                      disabled={processingRequestId === req.id}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {processingRequestId === req.id
                        ? "Rejeitando..."
                        : "Rejeitar"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 2. Voluntários Aceitos */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">2. Voluntários Aceitos</h2>
          {acceptedVolunteers.length === 0 ? (
            <p className="text-gray-600">
              Nenhum voluntário aceito para seus projetos.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {acceptedVolunteers.map((req) => (
                <li
                  key={req.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {req.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Email: {req.user.email}
                    </p>
                    <p className="text-sm text-gray-700">
                      Projeto:{" "}
                      <span className="font-semibold">{req.project.name}</span>
                    </p>
                    <p className="text-sm text-green-600">Status: Aceito</p>
                  </div>
                  {/* Opcional: Botão para Remover Voluntário */}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 3. Voluntários Rejeitados */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            3. Voluntários Rejeitados
          </h2>
          {rejectedVolunteers.length === 0 ? (
            <p className="text-gray-600">
              Nenhuma solicitação de voluntariado rejeitada.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {rejectedVolunteers.map((req) => (
                <li
                  key={req.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {req.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Email: {req.user.email}
                    </p>
                    <p className="text-sm text-gray-700">
                      Projeto:{" "}
                      <span className="font-semibold">{req.project.name}</span>
                    </p>
                    <p className="text-sm text-red-600">Status: Rejeitado</p>
                    {req.rejectionReason && (
                      <p className="text-sm text-gray-500">
                        Motivo: {req.rejectionReason}
                      </p>
                    )}
                  </div>
                  {/* Opcional: Botão para Reconvidar */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Modal de Rejeição */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Rejeitar Solicitação de Voluntariado
            </h3>
            <p className="mb-4">
              Deseja realmente rejeitar esta solicitação? Por favor, informe o
              motivo (opcional):
            </p>
            <textarea
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Motivo da rejeição..."
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

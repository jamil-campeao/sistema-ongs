"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/interfaces/index";
import { useUser } from "@/context/userContext";

// Interface para a resposta da API de solicitação de voluntariado
interface VolunteerRequestResponse {
  message: string;
  requestId?: number;
  status?: 'ACCEPTED' | 'REQUEST_PENDING_USER_TO_ONG' | 'REJECTED_BY_ONG';
}

export default function ContactSection({ id }: { id: number }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAlreadyVolunteered, setHasAlreadyVolunteered] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState<'ACCEPTED' | 'REQUEST_PENDING_USER_TO_ONG' | 'REJECTED_BY_ONG' | null>(null);
  const {user} = useUser();

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(`/api/projects/${id}`);
        const data = await response.json();
        setProject(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [id]);

  // Verifica se o usuário já solicitou voluntariado para este projeto
  useEffect(() => {
    async function checkVolunteerStatus() {
      if (!user?.id || !project?.id || isLoading) return;

      try {
        // rota backend para verificar o status de voluntariado do usuário para um projeto específico
        const response = await fetch(`/api/projects/${project.id}/volunteer-status?userId=${user.id}`);
        if (!response.ok) {
          // Se 404, significa que não há registro (ainda não voluntariou)
          if (response.status === 404) {
            setHasAlreadyVolunteered(false);
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro ao verificar status de voluntariado.");
        }
        const data = await response.json();
        setHasAlreadyVolunteered(!!data); // true se data não for null/undefined
        setVolunteerStatus(data.status)
      } catch (err: any) {
        console.log("Erro ao verificar status de voluntariado:", err);
      }
    }
    if (user?.id && project?.id) {
      checkVolunteerStatus();
    }
  }, [user, project, isLoading]);

  // Função para lidar com o clique no botão "Voluntariar-se"
  const handleVolunteer = async () => {
    // 1. Validações Frontend
    if (!user || !user.id || isSubmitting) return;
    if (!project || !project.id) {
      alert("Erro: Detalhes do projeto não carregados.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 2. Chamo o backend para registrar a solicitação em UserAssociateProject
      const response = await fetch(`/api/projects/${project.id}/volunteer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        throw (errorData.error.message || `Falha ao registrar voluntariado (Status: ${response.status})`);
      }


      const apiResponse: VolunteerRequestResponse = await response.json();
      alert(apiResponse.message || "Sua solicitação de voluntariado foi enviada!");
      setHasAlreadyVolunteered(true);
      setVolunteerStatus(apiResponse.status || 'REQUEST_PENDING_USER_TO_ONG');

    } catch (err: any) {
      alert(err || "Ocorreu um erro ao enviar sua solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !project) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium">Carregando informações do Projeto...</h3>
      </div>
    );
  }

  const ong = Array.isArray(project.ong) ? project.ong[0] : project.ong;
  const {
    street,
    number,
    complement,
    district,
    city,
    state,
    cep,
  } = ong;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-700">Email: {ong.emailONG}</p>
      <p className="text-sm text-gray-700">WhatsApp: {ong.whatsapp || ""}</p>
      <p className="text-sm text-gray-700">Instagram: {ong.instagram || ""}</p>
      <p className="text-sm text-gray-700">Endereço: {street}{number ? `, ${number}` : ""}{complement ? ` - ${complement}` : ""}{district ? `, ${district}` : ""}{city ? `, ${city}` : ""}{state ? `, ${state}` : ""}{cep ? `, ${cep}` : ""}</p>

      {user?.role === 'VOLUNTARY' && (
        <div className="mt-6">
          {user?.id && !hasAlreadyVolunteered && ( // Usuário logado e ainda não voluntariou
            <button
              onClick={handleVolunteer}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando Solicitação...' : 'Voluntariar-se para este Projeto'}
            </button>
          )}

          {user?.id && volunteerStatus && ( // Mostra este bloco SE o usuário está logado E há um status de voluntariado
            volunteerStatus === "ACCEPTED" ? (
              <p className="text-green-600 font-semibold">
                Você já está voluntariado para este projeto.
              </p>
            ) : volunteerStatus === "REQUEST_PENDING_USER_TO_ONG" ? (
              <p className="text-orange-600 font-semibold"> {/* Usar cor laranja para pendente */}
                Solicitação de voluntariado pendente para este projeto.
              </p>
            ) : ( // Implica status === "REJECTED_BY_ONG"
              <p className="text-red-600 font-semibold">
                Sua solicitação de voluntariado foi negada.
              </p>
            )
          )}
        </div>

    )}

    </div>
  );
}
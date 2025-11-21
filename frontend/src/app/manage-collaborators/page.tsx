"use client";

import { useEffect, useState } from "react";
import { useOng } from "@/context/ongContext";
import Header from "@/components/header";
import Footer from "../../components/footer";
import type { EmailResponse } from "@/interfaces/index";

// --- Interfaces ---
interface UserCollaborator {
  id: number;
  name: string;
  email: string;
}

interface UserInvite {
  id: number;
  userId: number;
  ongId: number;
  status: "INVITE_PENDING_ONG_TO_USER" | "ACCEPTED" | "REJECTED_BY_USER";
  user: UserCollaborator;
}

interface InviteResponse {
  message: string;
  inviteId?: number;
}
// --- Fim das Interfaces ---

export default function ManageCollaboratorsPage() {
  const { ong } = useOng();
  // const router = useRouter();

  // --- Novos estados para as 4 listas ---
  const [usersNotAssociated, setUsersNotAssociated] = useState<
    UserCollaborator[]
  >([]);
  const [pendingInvites, setPendingInvites] = useState<UserInvite[]>([]);
  const [acceptedCollaborators, setAcceptedCollaborators] = useState<
    UserInvite[]
  >([]);
  const [rejectedInvites, setRejectedInvites] = useState<UserInvite[]>([]);
  // --- Fim dos novos estados ---

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitingUserId, setInvitingUserId] = useState<number | null>(null);

  // Redireciona se a ONG não estiver logada ou não tiver permissão
  // useEffect(() => {
  //   if (!ong || !ong.id) {
  //     router.push('/login');
  //   }
  // }, [ong, router]);

  // Função para carregar TODAS as listas de colaboradores
  const fetchAllCollaboratorLists = async () => {
    if (!ong?.id) return; // Só carrega se a ONG estiver logada

    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch de TODAS as relações AssociateUserONG para esta ONG (todos os status)
      // Esta nova rota no backend trará TODOS os convites/associações da ONG
      // (Pendentes, Aceitos, Rejeitados).
      const allOngRelationsRes = await fetch(`/api/ongs/all-user-relations`);
      if (!allOngRelationsRes.ok)
        throw new Error(
          `Falha ao carregar relações da ONG: ${
            (await allOngRelationsRes.json()).error
          }`
        );
      const allOngRelations: UserInvite[] = await allOngRelationsRes.json();

      // IDs dos usuários que já têm ALGUMA relação com esta ONG
      const usersWithAnyRelationIds = new Set(
        allOngRelations.map((relation) => relation.userId)
      );

      // 2. Fetch de Usuários Não Associados (na visão global do sistema, ongId é null)
      const nonAssociatedUsersGlobalRes = await fetch(
        `/api/users/not-associated-with-ongs`
      );
      if (!nonAssociatedUsersGlobalRes.ok)
        throw new Error(
          `Falha ao carregar não associados globalmente: ${
            (await nonAssociatedUsersGlobalRes.json()).error
          }`
        );
      const nonAssociatedUsersGlobal: UserCollaborator[] =
        await nonAssociatedUsersGlobalRes.json();

      // 3. Filtrar usersNotAssociated:
      // Apenas aqueles que não têm NENHUMA relação com esta ONG.
      const trulyNotAssociated = nonAssociatedUsersGlobal.filter(
        (userItem) => !usersWithAnyRelationIds.has(userItem.id) // Remove usuários que já têm alguma relação (pendente, aceita, rejeitada)
      );
      setUsersNotAssociated(trulyNotAssociated);

      // 4. Separar e preencher as outras listas a partir de 'allOngRelations'
      setPendingInvites(
        allOngRelations.filter(
          (rel) => rel.status === "INVITE_PENDING_ONG_TO_USER"
        )
      );
      setAcceptedCollaborators(
        allOngRelations.filter((rel) => rel.status === "ACCEPTED")
      );
      setRejectedInvites(
        allOngRelations.filter((rel) => rel.status === "REJECTED_BY_USER")
      );
    } catch (err: any) {
      console.error("Erro ao carregar listas de colaboradores:", err);
      setError(
        err.message || "Não foi possível carregar as listas de colaboradores."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Chama a função para carregar as listas ao montar o componente ou quando a ONG muda
  useEffect(() => {
    if (ong?.id) {
      fetchAllCollaboratorLists();
    }
  }, [ong]);

  const handleSendInvite = async (userToInvite: UserCollaborator) => {
    if (!ong || !ong.id || !ong.nameONG || !ong.emailONG) {
      alert(
        "Erro: Dados da ONG logada incompletos. Não é possível enviar convite."
      );
      return;
    }
    setInvitingUserId(userToInvite.id);
    setError(null);

    try {
      const response = await fetch(`/api/ongs/invite-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userToInvite.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          JSON.stringify(errorData.error.message) ||
            `Falha ao registrar convite na API (Status: ${response.status})`
        );
      }

      const apiResponse: InviteResponse = await response.json();
      alert(apiResponse.message || "Convite registrado com sucesso!");

      const emailSubject = `Convite para ${ong.nameONG} - Colaborador!`;
      const inviteLink = `${window.location.origin}/invite-collaborator?inviteId=${apiResponse.inviteId}`;
      const emailMessage = `Olá ${userToInvite.name},\n\nA ONG ${ong.nameONG} gostaria de convidá-lo para ser um colaborador.\n\nPara aceitar ou rejeitar o convite, clique no link abaixo:\n${inviteLink}\n\nObrigado,\nEquipe ${ong.nameONG}`;

      const sendEmail = await fetch(`/api/email/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailSubject: userToInvite.email,
          subject: emailSubject,
          message: emailMessage,
        }),
      });

      const emailResponse: EmailResponse = await sendEmail.json();

      if (!emailResponse.success) {
        throw new Error(emailResponse.error || "Falha ao enviar e-mail");
      }

      alert("Convite enviado por e-mail com sucesso!");

      setUsersNotAssociated((prevUsers) =>
        prevUsers.filter((u) => u.id !== userToInvite.id)
      ); // Remove da lista de não associados

      const newInviteRecord: UserInvite = {
        id: apiResponse.inviteId!, // Assumindo que inviteId sempre vem
        userId: userToInvite.id,
        ongId: ong.id,
        status: "INVITE_PENDING_ONG_TO_USER",
        user: userToInvite, // O usuário convidado
      };
      setPendingInvites((prevInvites) => [...prevInvites, newInviteRecord]);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setInvitingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-4">
        Carregando listas de colaboradores...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <Header />
      <br></br>
      <main>
        <h1 className="text-2xl font-bold mb-6">
          Gerenciar Colaboradores para {ong?.nameONG}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* 1. Colaboradores Não Associados */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            1. Colaboradores Não Associados
          </h2>
          {usersNotAssociated.length === 0 ? (
            <p className="text-gray-600">
              Nenhum usuário disponível para convidar.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {usersNotAssociated.map((userItem) => (
                <li
                  key={userItem.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {userItem.name}
                    </p>
                    <p className="text-sm text-gray-500">{userItem.email}</p>
                  </div>
                  <button
                    onClick={() => handleSendInvite(userItem)}
                    disabled={invitingUserId === userItem.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {invitingUserId === userItem.id
                      ? "Enviando..."
                      : "Enviar Convite"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 2. Colaboradores com Convites Enviados (Pendentes) */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            2. Convites Enviados (Pendentes)
          </h2>
          {pendingInvites.length === 0 ? (
            <p className="text-gray-600">Nenhum convite pendente no momento.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pendingInvites.map((invite) => (
                <li
                  key={invite.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {invite.user.name}
                    </p>
                    <p className="text-sm text-gray-500">{invite.user.email}</p>
                    <p className="text-sm text-gray-400">Status: Pendente</p>
                  </div>
                  {/* Opcional: Botão para Cancelar Convite (se for uma funcionalidade) */}
                  {/* <button className="bg-red-500 text-white py-1 px-3 rounded text-sm">Cancelar</button> */}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 3. Colaboradores que Já Fazem Parte da ONG (Aceitos) */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            3. Colaboradores Atuais
          </h2>
          {acceptedCollaborators.length === 0 ? (
            <p className="text-gray-600">
              Nenhum colaborador aceito nesta ONG.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {acceptedCollaborators.map((invite) => (
                <li
                  key={invite.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {invite.user.name}
                    </p>
                    <p className="text-sm text-gray-500">{invite.user.email}</p>
                    <p className="text-sm text-green-600">Status: Aceito</p>
                  </div>
                  {/* Opcional: Botão para Remover Colaborador */}
                  {/* <button className="bg-red-500 text-white py-1 px-3 rounded text-sm">Remover</button> */}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 4. Colaboradores que Negaram os Convites */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">4. Convites Rejeitados</h2>
          {rejectedInvites.length === 0 ? (
            <p className="text-gray-600">
              Nenhum convite rejeitado no momento.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {rejectedInvites.map((invite) => (
                <li
                  key={invite.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {invite.user.name}
                    </p>
                    <p className="text-sm text-gray-500">{invite.user.email}</p>
                    <p className="text-sm text-red-500">Status: Rejeitado</p>
                    {/* Você pode adicionar o motivo da rejeição aqui se o model AssociateUserONG tiver um campo para isso */}
                    {/* <p className="text-sm text-gray-500">Motivo: {invite.rejectionReason}</p> */}
                  </div>
                  {/* Opcional: Botão para Reenviar Convite */}
                  {/* <button className="bg-yellow-500 text-white py-1 px-3 rounded text-sm">Reenviar</button> */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

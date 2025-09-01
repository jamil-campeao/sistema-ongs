"use client";

import { useEffect, useState } from "react";
import { useOng } from "@/context/ongContext";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

// --- Interfaces (Mantenha as mesmas) ---
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
  status: 'REQUEST_PENDING_USER_TO_ONG' | 'ACCEPTED' | 'REJECTED_BY_ONG';
  user: VolunteerUser;
  project: ProjectData;
  rejectionReason?: string | null;
}

interface GroupedVolunteerRequests {
  [projectId: number]: VolunteerRequest[];
}

const groupRequestsByProject = (requests: VolunteerRequest[]): GroupedVolunteerRequests => {
  const grouped: GroupedVolunteerRequests = {};
  requests.forEach(req => {
    if (!grouped[req.projectId]) {
      grouped[req.projectId] = [];
    }
    grouped[req.projectId].push(req);
  });
  return grouped;
};


export default function ViewProjectVolunteersPage() {
  const { ong } = useOng();
  const router = useRouter();
  const [groupedAcceptedVolunteers, setGroupedAcceptedVolunteers] = useState<GroupedVolunteerRequests>({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redireciona se a ONG não estiver logada ou não tiver permissão
  useEffect(() => {
    if (!ong || !ong.id) {
      router.push('/login');
      return;
    }
  }, [ong, router]);

  // Função para carregar apenas os voluntários aceitos e agrupá-los por projeto
  const fetchAcceptedVolunteersByProject = async () => {
    if (!ong?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/ongs/${ong.id}/project-volunteer-requests`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao carregar voluntários aceitos.");
      }
      const data: VolunteerRequest[] = await response.json();

      // Filtramos APENAS os voluntários com status 'ACCEPTED'
      const acceptedOnly = data.filter(req => req.status === 'ACCEPTED');
      
      // Agrupo esses voluntários aceitos por projeto
      setGroupedAcceptedVolunteers(groupRequestsByProject(acceptedOnly));

    } catch (err: any) {
      console.error("Erro ao carregar voluntários aceitos por projeto:", err);
      setError(err.message || "Não foi possível carregar os voluntários aceitos.");
    } finally {
      setIsLoading(false);
    }
  };

  // Chama a função de busca ao montar o componente ou quando a ONG muda
  useEffect(() => {
    if (ong?.id) {
      fetchAcceptedVolunteersByProject();
    }
  }, [ong]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">Carregando voluntários aceitos...</div>
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

  if (!ong || !ong.id) {
    return null;
  }

  const projectIds = Object.keys(groupedAcceptedVolunteers).map(Number); // Obtém os IDs dos projetos

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <br />
      <main className="container mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Voluntários Aceitos em Projetos para {ong?.nameONG}</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {/* Seção Única: Voluntários Aceitos Agrupados por Projeto */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Voluntários por Projeto</h2>
          {projectIds.length === 0 ? (
            <p className="text-gray-600">Nenhum voluntário aceito em projetos ainda.</p>
          ) : (
            <ul className="space-y-6">
              {projectIds.map(projectId => {
                const volunteers = groupedAcceptedVolunteers[projectId];
                // Pega o nome do projeto do primeiro voluntário neste grupo
                const projectName = volunteers[0]?.project.name || `Projeto ID: ${projectId}`; 

                return (
                  <li key={projectId} className="border border-gray-200 rounded-md p-4">
                    <h3 className="text-lg font-bold mb-2 text-blue-800">Projeto: {projectName}</h3>
                    <ul className="list-disc pl-5 space-y-1"> {/* Lista de voluntários */}
                      {volunteers.map(req => (
                        <li key={req.id} className="text-gray-800">
                          <span className="font-medium">{req.user.name}</span> (<span className="text-sm text-gray-500">{req.user.email}</span>)
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
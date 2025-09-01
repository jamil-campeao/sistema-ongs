"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/userContext";


interface UserVolunteerProject {
  id: number;
  projectId: number;
  userId: number; 
  status: 'ACCEPTED';
  project: {
    id: number;
    name: string;
    description: string;
    ongId: number; 
    ong: { 
      nameONG: string;
    };
  };
}


export default function ProfileVolunteerProjects() { 
  const { user} = useUser(); 

  const [acceptedProjects, setAcceptedProjects] = useState<UserVolunteerProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAcceptedProjects() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/accepted-projects`);
        if (!response.ok) {
          const errorData = await response.json();
          throw (errorData.error || "Erro ao carregar projetos participados.");
        }
        const data: UserVolunteerProject[] = await response.json();
        setAcceptedProjects(data);
      } catch (err: any) {
        setError(err || "Não foi possível carregar os projetos que você participa.");
      } finally {
        setIsLoading(false);
      }
    }
    loadAcceptedProjects();
  }, [user]);

  // Se o usuário e os projetos estão carregando
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-base font-medium mb-4">Carregando seus projetos participados...</h3>
      </div>
    );
  }

  // Se o usuário não é um VOLUNTARY, não renderiza a seção, apenas retorna null.
  // Isso evita que a seção apareça para outros tipos de usuários.
  if (!user || user.role !== 'VOLUNTARY') {
    return null; 
  }

  // Se houve um erro
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium mb-4">Projetos que você participa</h3>
      <div className="px-4 pb-4 space-y-6">
        {acceptedProjects.length > 0 ? (
          acceptedProjects.map((item) => (
            <Link 
              href={`/projects/${item.projectId}`} // Rota para a página de detalhes do projeto
              key={item.id} // key é o ID do UserAssociateProject
              className="block p-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <h4 className="text-md font-bold text-blue-600 hover:underline">{item.project.name}</h4>
              <p className="text-sm text-gray-600">{item.project.description}</p>
              <p className="text-sm text-gray-500 mt-1">ONG: <span className="font-semibold">{item.project.ong.nameONG}</span></p>
              <p className="text-sm text-green-600 mt-1">Status: Aceito</p>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">Você ainda não foi aceito em nenhum projeto.</p>
        )}
      </div>
    </div>
  );
}
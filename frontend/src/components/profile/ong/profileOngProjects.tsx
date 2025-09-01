"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EditProjectModal, { ProjectData } from "@/components/profile/ong/editProjectModal";  // Importando o modal de edição de projeto
import { useOng } from "@/context/ongContext";

export default function ProfileOngProjects() {
  interface Project {
    id?: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    projectImage: string;
    additionalInfo: string;
    contributionProject: string[];
    ongId: number;
    complementImages: string[];
    type: string;
  }

  const [projects, setProject] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const {ong} = useOng();

  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/ongs/projects', {
          method: 'GET',
        });

        const projectsData = await response.json();
        setProject(projectsData || []);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const handleEditClick = (project: Project) => {
    setSelectedProject({ ...project });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedProject({
      id: 0,
      name: "",
      description: "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      contributionProject: [],
      projectImage: "",
      ongId: ong!.id,
      complementImages: [],
      additionalInfo: "",
      type: "",
    });
    setIsModalOpen(true);
  };


  const handleDelete = async (projectData: ProjectData) => {
    try {
      const response = await fetch(`/api/projects/${projectData.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProject((prev) => prev.filter((project) => project.id !== projectData.id));
      } else {
        alert("Erro ao excluir o projeto.");
      }
    } catch (error) {
      alert("Erro ao excluir o projeto.");
    }
  };

  const handleSave = async (updatedProject: ProjectData) => {
    try {
      let savedProject: ProjectData;

      if (updatedProject.id === 0) {
        // Caso seja um projeto novo
        const response = await fetch('/api/projects', {
          method: 'POST',
          body: JSON.stringify(updatedProject),
        });

        savedProject = await response.json();
        setProject((prev) => [...prev, savedProject]);
      } else {
        // Caso seja um projeto existente
        const response = await fetch(`/api/projects/${updatedProject.id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedProject),
        });

        savedProject = await response.json();
        setProject((prev) =>
          prev.map((project) =>
            project.id === savedProject.id
              ? { ...project, ...savedProject }
              : project
          )
        );
      }
    } catch (error: any) {
      alert(error.message || "Erro ao criar/atualizar projeto");
    } finally {
      setIsModalOpen(false);
    }
  };


  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium">Carregando projetos...</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-4">
          <span>Projetos da ONG</span> {/* Envolva o texto em um span para melhor controle */}
          <button
            type="button"
            className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700`}
            aria-label="Adicionar Novo Projeto"
            onClick={handleAddClick}
          >
            Novo Projeto
          </button>
        </h2>
      </div>

      <div className="px-6 py-4">
        {projects.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum projeto cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project: Project) => ( // Altere `any` para `Project` se definiu a interface
              <div key={project.id} className="border rounded-lg hover:shadow-md transition">
                { project.projectImage && project.projectImage.length > 0 && (
                  <Link legacyBehavior href={`/projects/${project.id}`} passHref>
                    <a className="block h-48 w-full overflow-hidden rounded-t-lg cursor-pointer">
                      <img
                        src={project.projectImage}
                        alt={project.name}
                        className="h-full w-full object-cover"
                      />
                    </a>
                  </Link>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={() => handleEditClick(project)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(project)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Edição de Projeto */}
      {isModalOpen && selectedProject && (
        <EditProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedProject}
          type={selectedProject.id ? "Editar Projeto" : "Novo Projeto"}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
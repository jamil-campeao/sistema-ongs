"use client"; 

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/interfaces/index";

export default function OngProjects({ id }: { id: number }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch('/api/ongs/' + id);
        const data = await response.json();

        // Aqui extrai o array projects do objeto da ONG
        const projectsArray = data.projects || [];
        setProjects(projectsArray);
      } catch (error) {
        console.error("Erro ao carregar projetos da ONG:", error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, [id]);

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
        <h2 className="text-xl font-semibold text-gray-800 text-center">Projetos da ONG</h2>
      </div>

      <div className="px-6 py-4">
        {projects.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum projeto cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <div key={i} className="border rounded-lg hover:shadow-md transition">
                <Link legacyBehavior href={`/projects/${project.id}`} passHref>
                  <a className="block h-48 w-full overflow-hidden rounded-t-lg cursor-pointer">
                    <img
                      src={project.projectImage || "/placeholder.svg"}
                      alt={project.name}
                      className="h-full w-full object-cover"
                    />
                  </a>
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
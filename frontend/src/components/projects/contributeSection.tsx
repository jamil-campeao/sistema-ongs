"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/interfaces/index";

export default function ContributeSection({ id }: { id: number }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading || !project) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium">Carregando informações do Projeto...</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-2">Como Contribuir</h2>
      {project.contributionProject.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700">
          {project.contributionProject.map((contribution: any, index: any) => (
            <li key={index}>{contribution}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Nenhuma contribuição registrada.</p>
      )}
    </div>
  );
}
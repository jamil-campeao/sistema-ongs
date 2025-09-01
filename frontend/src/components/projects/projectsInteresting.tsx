"use client";

import Link from "next/link"
import { useEffect, useState } from "react"
import type { Project } from "@/interfaces/index";
import { noProfileImageProject } from "app/images";

export default function ProjectsInteresting() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        async function loadProjects() {
            setIsLoading(true);
            const response = await fetch('/api/projects', {
                method: 'GET'
            });
            const fetchedProjects = await response.json();
            setProjects(fetchedProjects || []);
            setIsLoading(false);
        }
        loadProjects();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-4">Carregando Projetos...</h3>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4">
                <h3 className="text-base font-medium mb-4">Estes podem ser do seu interesse...</h3>
            </div>
            <div className="p-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project, i) => (
                    <div key={i} className="border rounded-lg bg-white">
                        <div className="p-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-40 w-50 overflow-hidden mb-3">
                            {project.projectImage && (
                                <img
                                    src={project.projectImage || noProfileImageProject}
                                    alt={project.name}
                                    className="h-full w-full object-cover"
                                />
                            )}
                            </div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-gray-500 mb-2">{project.description}</p>
                            <p className="text-xs text-gray-500 mb-3">
                            <span className="inline-flex items-center">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3 w-3 mr-1"
                                >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                ONG: {project.ong.nameONG}
                            </span>
                            </p>
                            <Link href={`/projects/${project.id}`} className="w-full border border-gray-300 rounded py-1 px-3 hover:bg-gray-50">
                                <button>
                                    Visualizar Projeto
                                </button>
                            </Link>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                {/* <button className="w-full border border-gray-300 rounded py-2 px-3 mt-4 hover:bg-gray-50">
                    Mostrar mais
                </button> */}
            </div>
        </div>
    )
}

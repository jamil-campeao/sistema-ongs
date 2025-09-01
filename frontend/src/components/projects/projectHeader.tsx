"use client";

import { useEffect, useState, useRef } from "react";
import type { Project } from "@/interfaces/index"; // Certifique-se de que sua interface Project tem projectImage: string | null

export default function ProjectHeader({ id }: { id: number }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Estado para a imagem selecionada no modal
  const [isZoomed, setIsZoomed] = useState(false); // Estado para controlar o zoom no modal

  const imageRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Imagem de capa padrão (se project.projectImage for null ou undefined)
  const defaultProjectImage = "/projeto-capa.jpg";

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
        setProject(null); // Define como null em caso de erro
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [id]);

  // Efeito para lidar com o clique fora do modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedImage(null); // Fecha o modal
        setIsZoomed(false); // Reseta o zoom
      }
    }

    if (selectedImage) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Previne scroll do body
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // Restaura scroll do body
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  const handleImageClick = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setIsZoomed(false); // Começa sem zoom
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  // Função para gerar um nome de arquivo para download
  const getFileNameFromUrl = (url: string, projectName: string = "projeto") => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      let fileName = pathSegments[pathSegments.length - 1];

      fileName = fileName.split('?')[0]; // Remove parâmetros de query

      if (!fileName || fileName === '.' || fileName.lastIndexOf('/') === fileName.length -1) {
        return `${projectName.replace(/\s+/g, '_').toLowerCase()}_${new Date().getTime()}.jpg`;
      }

      return fileName;
    } catch (error) {
      console.warn("Could not parse image URL for filename, using default.", url);
      return `${projectName.replace(/\s+/g, '_').toLowerCase()}_${new Date().getTime()}.jpg`;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium">Carregando informações do Projeto...</h3>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium text-red-600">Projeto não encontrado ou erro ao carregar.</h3>
      </div>
    );
  }

  // Determine a imagem de capa a ser exibida (com fallback)
  const coverImageUrl = project.projectImage || defaultProjectImage;

  return (
    <div className="relative h-64 rounded-lg overflow-hidden shadow">
      <img
        src={coverImageUrl}
        alt="Foto de capa do projeto"
        className="w-full h-full object-cover cursor-pointer" // Adiciona cursor-pointer
        onClick={() => handleImageClick(coverImageUrl)} // Adiciona onClick para abrir o modal
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
        <h1 className="text-white text-2xl font-bold">{project.name}</h1>
        <p className="text-gray-200 text-sm">
          Vinculado à ONG: <span className="font-semibold">{project.ong.nameONG}</span>
        </p>
      </div>

      {/* Modal para exibir a imagem de capa em tela cheia */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="relative bg-white rounded-lg shadow-lg max-w-full max-h-full">
            {/* Botão de Fechar */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 text-lg hover:bg-gray-700 z-50"
              aria-label="Fechar"
            >
              &times;
            </button>

            {/* Botão de Salvar Imagem */}
            <a
              href={selectedImage} // URL da imagem
              download={getFileNameFromUrl(selectedImage, project.name)} // Atributo download com nome do projeto
              className="absolute top-2 right-14 text-white bg-gray-800 rounded-full p-2 text-lg hover:bg-gray-700 z-50 flex items-center justify-center"
              aria-label="Salvar Imagem"
              title="Salvar Imagem"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>


            <div
              className="overflow-hidden flex items-center justify-center"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
              }}
            >
              <img
                ref={imageRef}
                src={selectedImage}
                alt={`Capa do projeto ${project.name}`}
                className={`max-w-full max-h-full transition-transform duration-300 ease-in-out cursor-zoom-${isZoomed ? 'out' : 'in'}`}
                style={{
                  transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                  transformOrigin: 'center center',
                }}
                onClick={handleZoomToggle}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
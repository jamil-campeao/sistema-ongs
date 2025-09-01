"use client";

import { useEffect, useState, useRef } from "react";
import type { Project } from "@/interfaces/index"; // Certifique-se de que sua interface Project inclui complementImages: string[]

// Definição da interface Project (exemplo, ajuste conforme sua API)
// interface Project {
//   id: number;
//   complementImages: string[]; // Array de URLs das imagens
//   // ... outras propriedades do projeto
// }

export default function GallerySection({ id }: { id: number }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Estado para a imagem selecionada no modal
  const [isZoomed, setIsZoomed] = useState(false); // Estado para controlar o zoom no modal

  const imageRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedImage(null);
        setIsZoomed(false);
      }
    }

    if (selectedImage) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  const handleImageClick = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setIsZoomed(false);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  // Função para gerar um nome de arquivo para download
  const getFileNameFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      // Pega a última parte do caminho da URL (nome do arquivo)
      const pathSegments = urlObj.pathname.split('/');
      let fileName = pathSegments[pathSegments.length - 1];

      // Remove parâmetros de query se existirem (ex: ?v=123)
      fileName = fileName.split('?')[0];

      // Se o nome do arquivo estiver vazio ou for apenas um ponto, use um nome padrão
      if (!fileName || fileName === '.' || fileName.lastIndexOf('/') === fileName.length -1) {
        return `imagem_projeto_${new Date().getTime()}.jpg`; // Nome padrão com timestamp
      }

      return fileName;
    } catch (error) {
      // Se a URL for inválida ou ocorrer um erro, retorne um nome padrão
      console.warn("Could not parse image URL for filename, using default.", url);
      return `imagem_projeto_${new Date().getTime()}.jpg`;
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

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Galeria</h2>
      {project.complementImages && project.complementImages.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {project.complementImages.map((img, i) => (
            <div
              key={i}
              className="min-w-[200px] h-40 rounded overflow-hidden shadow cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={() => handleImageClick(img)}
            >
              <img
                src={img}
                alt={`Foto ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Sem fotos a exibir</p>
      )}

      {/* Modal para exibir a imagem em tela cheia */}
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
              download={getFileNameFromUrl(selectedImage)} // Atributo download com o nome do arquivo
              className="absolute top-2 right-14 text-white bg-gray-800 rounded-full p-2 text-lg hover:bg-gray-700 z-50 flex items-center justify-center"
              aria-label="Salvar Imagem"
              title="Salvar Imagem"
            >
              {/* Ícone de download */}
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
                alt="Imagem Ampliada"
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
"use client";

import { useEffect, useState, useRef } from "react";
import type { Ong } from "@/interfaces/index"; 
import { noCoverImage, noProfileImageONG } from "app/images"; 
import { envioEmail } from "@/api/email";

export default function OngHeader({ id }: { id: number }) {
  const [ong, setOng] = useState<Ong | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Novos estados para o modal de imagem (REUTILIZADOS) ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  // --- Fim dos novos estados ---

  useEffect(() => {
    async function loadOng() {
      try {
        const response = await fetch(`/api/ongs/${id}`);
        const data = await response.json();
        setOng(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadOng();
  }, [id]);

  // --- Efeito para lidar com o clique fora do modal (REUTILIZADO) ---
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
  // --- Fim do efeito ---]

  // --- Funções para o modal de imagem (REUTILIZADAS) ---
  const handleImageClick = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setIsZoomed(false); // Começa sem zoom
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const getFileNameFromUrl = (url: string, baseName: string = "imagem") => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      let fileName = pathSegments[pathSegments.length - 1];

      fileName = fileName.split('?')[0];

      if (!fileName || fileName === '.' || fileName.lastIndexOf('/') === fileName.length -1) {
        return `${baseName.replace(/\s+/g, '_').toLowerCase()}_${new Date().getTime()}.jpg`;
      }

      return fileName;
    } catch (error) {
      console.warn("Could not parse image URL for filename, using default.", url);
      return `${baseName.replace(/\s+/g, '_').toLowerCase()}_${new Date().getTime()}.jpg`;
    }
  };
  // --- Fim das funções ---


  if (isLoading || !ong) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium">Carregando informações da ONG...</h3>
      </div>
    );
  }

  // Definindo as URLs das imagens de perfil e capa com fallbacks
  const profileImageUrl = ong.profileImage || noProfileImageONG;
  const coverImageUrl = ong.coverImage || noCoverImage; // Use um placeholder simples

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      {/* Capa da ONG */}
      <div className="h-48 bg-gray-200 relative">
        <img
          src={coverImageUrl}
          alt="Imagem de capa"
          className="w-full h-full object-cover cursor-pointer" // Adiciona cursor-pointer
          onClick={() => handleImageClick(coverImageUrl)} // Adiciona onClick
        />
      </div>

      {/* Perfil e informações */}
      <div className="relative px-6 pb-6">
        {/* Foto de perfil */}
        <div className="absolute -top-16 left-6">
          <div className="h-32 w-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white cursor-pointer"> {/* Adiciona cursor-pointer */}
            <img
              src={profileImageUrl}
              alt={ong.nameONG}
              className="h-full w-full object-cover"
              onClick={() => handleImageClick(profileImageUrl)}
            />
          </div>
        </div>

        <div className="pt-20 pl-6 md:flex md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ong.nameONG}</h1>
            <p className="text-sm text-gray-700 mt-1">Razão Social: {ong.socialName}</p>
            <p className="text-sm text-gray-600">CNPJ: {ong.cnpj}</p>
            <p className="text-sm text-gray-500 mt-2">
              Responsável: {ong.nameLegalGuardian}
            </p>
          </div>

          {/* Informações complementares */}
          <div className="mt-6 md:mt-0 text-right">
            <p className="text-sm text-gray-500">Fundada em: {new Date(ong.foundationDate).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">{ong.city} - {ong.state}</p>
          </div>
        </div>
      </div>

      {/* --- Modal para exibir a imagem em tela cheia (REUTILIZADO) --- */}
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
              href={selectedImage}
              download={getFileNameFromUrl(selectedImage, ong.nameONG || "ONG_Perfil")}
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
                alt={`Imagem de perfil ou capa da ONG ${ong.nameONG}`}
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
      {/* --- Fim do Modal --- */}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import type { Ong } from "@/interfaces/index";
import { noCoverImage, noProfileImageONG } from "app/images";
import { useImageModal } from "@/hooks/useImageModal";
import { ImageModal } from "@/components/ui/ImageModal";

export default function OngHeader({ id }: { id: number }) {
  const [ong, setOng] = useState<Ong | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedImage, isZoomed, openModal, closeModal, toggleZoom } =
    useImageModal();

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

  if (isLoading || !ong) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium">
          Carregando informações da ONG...
        </h3>
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
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => openModal(coverImageUrl)}
        />
      </div>

      {/* Perfil e informações */}
      <div className="relative px-6 pb-6">
        {/* Foto de perfil */}
        <div className="absolute -top-16 left-6">
          <div className="h-32 w-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white cursor-pointer">
            <img
              src={profileImageUrl}
              alt={ong.nameONG}
              className="h-full w-full object-cover"
              onClick={() => openModal(profileImageUrl)}
            />
          </div>
        </div>

        <div className="pt-20 pl-6 md:flex md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ong.nameONG}</h1>
            <p className="text-sm text-gray-700 mt-1">
              Razão Social: {ong.socialName}
            </p>
            <p className="text-sm text-gray-600">CNPJ: {ong.cnpj}</p>
            <p className="text-sm text-gray-500 mt-2">
              Responsável: {ong.nameLegalGuardian}
            </p>
          </div>

          {/* Informações complementares */}
          <div className="mt-6 md:mt-0 text-right">
            <p className="text-sm text-gray-500">
              Fundada em: {new Date(ong.foundationDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              {ong.city} - {ong.state}
            </p>
          </div>
        </div>
      </div>

      <ImageModal
        imageUrl={selectedImage}
        altText={ong.nameONG || "Imagem da ONG"}
        isZoomed={isZoomed}
        onClose={closeModal}
        onToggleZoom={toggleZoom}
      />
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import EditProfileModalOng, { type ProfileDataOng } from "@/components/profile/ong/editProfileModalOng";
import EditPasswordModal from "../editPasswordModal";
import { useOng } from "@/context/ongContext";
import { noCoverImage, noProfileImageONG } from "../../../app/images";
import Link from "next/link"

export default function ProfileHeaderOng() {
  const { ong, setOng } = useOng();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileDataOng, setProfileDataOng] = useState<ProfileDataOng>({
    nameONG: "",
    socialName: "",
    profileImage: "",
    coverImage: "",
    foundationDate: new Date(),
  });

  // --- Novos estados para o modal de imagem ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  // --- Fim dos novos estados ---

  useEffect(() => {
    async function loadOng() {
        setIsLoading(true); 
        setProfileDataOng({
            nameONG: ong?.nameONG || "",
            socialName: ong?.socialName || "",
            profileImage: ong?.profileImage || "",
            coverImage: ong?.coverImage || "",
            foundationDate: ong?.foundationDate ? new Date(ong.foundationDate) : new Date(), 
        });
        setIsLoading(false); 
    }
    loadOng();
  }, [ong]); 

  // --- Efeito para lidar com o clique fora do modal (reutilizado) ---
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
  // --- Fim do efeito ---

  // --- Funções para o modal de imagem (reutilizadas) ---
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

      fileName = fileName.split('?')[0]; // Remove parâmetros de query

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

  const handleSaveProfile = async (updatedData: ProfileDataOng) => {
    try {
      const response = await fetch("/api/ongs", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao atualizar dados do perfil.");
      }

      const ongData = await response.json();
      setProfileDataOng(ongData);
      setOng(ongData); // Atualiza o contexto da ONG
    } catch (error: any) {
      alert("Falha ao atualizar dados do perfil. Tente novamente: " + error.message);
      console.error("Erro ao salvar perfil:", error);
    }
  };

  const handleSaveNewPassword = async(newPassword: string) => {
    try {
        const email = ong?.emailONG;
        if (!email) {
            alert("Email da ONG não disponível para alteração de senha.");
            return;
        }
        const response = await fetch("/api/ongs/editpassword", {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({email, password: newPassword})
        });

        const data = await response.json();

        if (!response.ok) { 
          throw new Error(data.error || "Erro desconhecido ao alterar senha.");
        }
    }
    catch (error: any) {
        alert("Falha ao atualizar senha da ONG: " + error.message);
        console.error("Erro ao alterar senha:", error);
    }
  }

  // Define as URLs das imagens de perfil e capa com fallbacks
  const profileImageUrl = profileDataOng.profileImage || noProfileImageONG;
  const coverImageUrl = profileDataOng.coverImage || noCoverImage;

  if (isLoading || !ong) { // Verifica se 'ong' do contexto está carregando ou é nulo
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium">Carregando perfil da ONG...</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      {/* Imagem de Capa */}
      <div className="h-80 relative rounded-t-lg overflow-hidden">
        <img
          src={coverImageUrl}
          alt="Capa do perfil"
          className="w-full h-full object-cover cursor-pointer" // Adiciona cursor-pointer
          onClick={() => handleImageClick(coverImageUrl)} // Adiciona onClick para abrir o modal
        />
      </div>

      <div className="relative pb-6 px-6">
        {/* Imagem de Perfil */}
        <div className="absolute -top-16 left-8">
          <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden cursor-pointer"> {/* Adiciona cursor-pointer */}
            <img
              src={profileImageUrl}
              alt={profileDataOng.nameONG || "Carregando..."}
              className="h-full w-full object-cover"
              onClick={() => handleImageClick(profileImageUrl)} // Adiciona onClick para abrir o modal
            />
          </div>
        </div>

        <div className="pt-20">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">{profileDataOng?.nameONG || "Carregando..."}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {profileDataOng?.foundationDate
                  ? new Date(profileDataOng.foundationDate).toLocaleDateString("pt-BR", { year: "numeric", month: "long" }).replace(/^\w/, (c) => c.toUpperCase())
                  : "Carregando..."}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-50"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={() => setIsEditPasswordModal(true)}
                  className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-50">Alterar Senha</button>
                {/* Edit Profile Modal */}
                <EditProfileModalOng
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                  onSave={handleSaveProfile}
                  initialData={profileDataOng}
                />
                <EditPasswordModal
                  isOpen={isEditPasswordModalOpen}
                  onClose={() => setIsEditPasswordModal(false)}
                  onSave={handleSaveNewPassword}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal para exibir a imagem em tela cheia (reutilizado) --- */}
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
              download={getFileNameFromUrl(selectedImage, profileDataOng.nameONG || "ONG_Perfil")}
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
                alt={`Imagem de perfil ou capa de ${profileDataOng.nameONG}`}
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
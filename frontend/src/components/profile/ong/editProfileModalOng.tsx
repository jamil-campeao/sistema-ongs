"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";

interface EditProfileModalOngProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: ProfileDataOng) => Promise<void>;
  initialData: ProfileDataOng;
}

export interface ProfileDataOng {
  nameONG: string;
  socialName: string;
  profileImage: string;
  coverImage: string;
  foundationDate: Date;
}

export default function EditProfileModalOng({ isOpen, onClose, onSave, initialData, canDelete }: EditProfileModalOngProps) {
  const [profileDataOng, setProfileDataOng] = useState<ProfileDataOng>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("intro");

  const modalRef = useRef<HTMLDivElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // Reset form data when modal opens with initial data
  useEffect(() => {
    if (isOpen) {
      setProfileDataOng(initialData);
    }
  }, [isOpen, initialData]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent body scrolling
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // Restore body scrolling
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileDataOng((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      try {
        const base64Image = await convertToBase64(file);

        setProfileDataOng((prev) => ({
          ...prev,
          profileImage: base64Image, // string base64
        }));
      } catch (error) {
        console.error("Erro ao converter imagem para base64:", error);
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Isso gera a string base64
    });
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      try {
        const base64Image = await convertToBase64(file);

        setProfileDataOng((prev) => ({
          ...prev,
          coverImage: base64Image, // string base64
        }));
      } catch (error) {
        console.error("Erro ao converter imagem para base64:", error);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await onSave(profileDataOng);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar dados do perfil:", error);
      // You could add error handling UI here
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-lg font-medium">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-grow">
          {/* Navigation */}
          <div className="px-4 py-3 border-b">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection("intro")}
                className={`px-3 py-2 rounded-md ${activeSection === "intro" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Introdução
              </button>
              <button
                onClick={() => setActiveSection("images")}
                className={`px-3 py-2 rounded-md ${activeSection === "images" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Imagens
              </button>
            </div>
          </div>

          {/* Intro Section */}
          {activeSection === "intro" && (
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="nameONG" className="block text-sm font-medium text-gray-700 mb-1">Nome da ONG*</label>
                <input
                  id="nameONG"
                  name="nameONG"
                  type="text"
                  value={profileDataOng.nameONG}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  maxLength={60}
                />
              </div>
              <div>
                <label htmlFor="socialName" className="block text-sm font-medium text-gray-700 mb-1">Nome Social</label>
                <input
                  id="socialName"
                  name="socialName"
                  type="text"
                  value={profileDataOng.socialName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  maxLength={60}
                />
              </div>
            </div>
          )}

          {/* Images Section */}
          {activeSection === "images" && (
            <div className="p-4 space-y-6">
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de perfil</label>
                <div className="flex items-center space-x-4">
                  <div className="h-24 w-24 rounded-full overflow-hidden border border-gray-300">
                    <img
                      src={profileDataOng.profileImage || "/placeholder.svg?height=96&width=96"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <input
                      ref={profileImageInputRef}
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => profileImageInputRef.current?.click()}
                      className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Mudar foto
                    </button>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de fundo</label>
                <div className="space-y-3">
                  <div className="h-32 w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                    {profileDataOng.coverImage ? (
                      <img
                        src={profileDataOng.coverImage || "/placeholder.svg"}
                        alt="Cover"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">Sem imagem de fundo</div>
                    )}
                  </div>
                  <div>
                    <input
                      ref={coverImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => coverImageInputRef.current?.click()}
                      className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Mudar foto de fundo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t sticky bottom-0 bg-white z-10 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: ProjectData) => Promise<void>;
  initialData: ProjectData;
  type: String;
};

export interface ProjectData {
  id?: number;
  name: string;
  type: string;
  description: string;
  complementImages: string[];
  additionalInfo: string;
  contributionProject: string[];
  projectImage: string;
  ongId: number;
}

export default function EditProjectModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  type,
}: EditProjectModalProps) {
  const [projectData, setProjectData] = useState<ProjectData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [contributionInput, setContributionInput] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [extraImages, setExtraImages] = useState<FileList | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddContribution = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && contributionInput.trim() !== "") {
      e.preventDefault();
      setProjectData((prev) => ({
        ...prev,
        contributionProject: [...prev.contributionProject, contributionInput.trim()], // Adiciona nova contribuição
      }));
      setContributionInput(""); // Limpa o campo de entrada após adicionar
    }
  };

  const handleRemoveContribution = (index: number) => {
    setProjectData((prev) => ({
      ...prev,
      contributionProject: prev.contributionProject.filter((_, i) => i !== index), // Remove a contribuição pelo índice
    }));
  };

  const handleSaveProject = async () => {
    setIsSubmitting(true);

    try {
      const dataToSave = { ...projectData };

      if (!fValidacoes(projectData)) {
        return;
      }

      // Convertendo as imagens para base64
      if (coverImage) {
        const base64Image = await convertToBase64(coverImage);
        dataToSave.projectImage = base64Image;
      }

      if (extraImages) {
        const base64Images: string[] = [];
        for (let i = 0; i < extraImages.length; i++) {
          const base64 = await convertToBase64(extraImages[i]);
          base64Images.push(base64);
        }
        dataToSave.complementImages = base64Images;
      }

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar dados do projeto:", error);
      setError("Erro ao salvar dados do projeto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function fValidacoes(projectData: ProjectData) {
    if (projectData.name === "") {
      setError("Nome do projeto não informado");
      return false;
    } else if (projectData.description === "") {
      setError("Descrição do projeto não informada");
      return false;
    }

    return true;
  }

  // Função para converter a imagem para base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" ref={modalRef}>
        <h2 className="text-2xl font-bold mb-4">{type}</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form className="space-y-6">
          {/* Nome do Projeto */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Nome do Projeto</label>
            <input
              type="text"
              name="name"
              value={projectData.name}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              maxLength={100}
            />
          </div>

          {/* Descrição do Projeto */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Descrição do Projeto</label>
            <textarea
              rows={4}
              name="description"
              value={projectData.description || ""}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              maxLength={500}
            />
          </div>

          {/* Como Contribuir com o Projeto */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Como Contribuir com o projeto?</label>
            <input
              type="text"
              value={contributionInput}
              onChange={(e) => setContributionInput(e.target.value)}
              onKeyDown={handleAddContribution}
              placeholder="Digite uma forma de como contribuir e pressione Enter. Ex: voluntários, doações de comida, financeiras..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              maxLength={30}
            />
            <div className="mt-2 text-sm text-gray-500">
              {projectData.contributionProject && projectData.contributionProject.length > 0 ? (
                projectData.contributionProject.map((contribution, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>{contribution}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveContribution(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      &times;
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-gray-400">Sem contribuições registradas</span>
              )}
            </div>
          </div>

          {/* Imagem de Capa */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Foto de Capa</label>
            <input
              type="file"
              onChange={(e) => e.target.files && setCoverImage(e.target.files[0])}
              className="w-full"
            />
            {/* Exibindo quantidade de imagens selecionadas */}
            {projectData.projectImage && (
              <div className="mt-2 text-sm text-gray-500">
                <span> 1 imagem selecionada</span>
              </div>
            )}
          </div>

          {/* Fotos Complementares */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Fotos Complementares</label>
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && setExtraImages(e.target.files)}
              className="w-full"
            />
            {/* Exibindo quantidade de imagens selecionadas */}
            {projectData.complementImages && projectData.complementImages.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                <span>{projectData.complementImages.length} imagens selecionadas</span>
              </div>
            )}
          </div>

          {/* Informações Adicionais */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">Informações Adicionais</label>
            <textarea
              rows={3}
              name="additionalInfo"
              value={projectData.additionalInfo || ""}
              onChange={handleInputChange}
              placeholder="Informações de contato, orientações para voluntários interessados..."
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              maxLength={500}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveProject}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
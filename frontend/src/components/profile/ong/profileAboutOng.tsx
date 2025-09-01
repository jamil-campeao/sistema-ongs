"use client";

import { useEffect, useState } from "react";
import { useOng } from "@/context/ongContext";

export default function ProfileAboutOng() {
  const { ong, setOng } = useOng();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setOng((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/ongs', {
        method: 'PUT',
        body: JSON.stringify(ong),
      });

      const ongData = await response.json();

      if (response.ok) {
        setOng(ongData);
        setIsModalOpen(false);
      } else {
        console.error("Erro ao salvar os dados da ONG: ");
      }
    } catch (error) {
      console.error("Erro ao salvar os dados da ONG: ", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex flex-row items-center justify-between p-4">
        <h3 className="text-lg font-medium">Sobre a ONG</h3>
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
      </div>
      <div className="px-4 pb-4">
        <p>{ong?.description || "Sem descrição"}</p>
        <p className="mt-2"><strong>Área de Atuação:</strong> {ong?.area || "Não especificado"}</p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium mb-4">Editar Sobre a ONG</h3>
            {/* Área de atuação */}
            <div className="mb-4">
              <label
                htmlFor="area"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Área de Atuação
              </label>
              <input
                id="area"
                name="area"
                type="text"
                value={ong.area || ""}
                onChange={handleInputChange}
                placeholder="Ex: Educação, Saúde, Meio Ambiente"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Descrição */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={ong.description || ""}
                onChange={handleInputChange}
                rows={6}
                placeholder="Nos conte sobre a sua ONG"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Você pode escrever sobre as ações da ONG, suas metas e conquistas.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)} // Fecha o modal
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleSave} // Salva e fecha o modal
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
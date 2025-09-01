"use client";

import { useEffect, useState } from "react"
import { useUser } from "@/context/userContext"

export default function ProfileAboutUser() {
    const { user, setUser } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUser((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                body: JSON.stringify(user)
            });

            const userData = await response.json();

            if (response.ok) {
                setUser(userData);
                setIsModalOpen(false);
            }
            else {
                console.error("Erro ao salvar os dados do usuário: ");
            } 
        } catch (error) {
            console.error("Erro ao salvar os dados do usuário: ", error);            
        }
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="flex flex-row items-center justify-between p-4">
                <h3 className="text-lg font-medium">Sobre</h3>
                <button className="p-2 rounded-full hover:bg-gray-100"
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
                <p>
                    {user?.description || ""}
                </p>
            </div>

            {/* Modal */}
            {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                        <h3 className="text-lg font-medium mb-4">Editar Sobre</h3>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Sobre
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={user.description || ""}
                            onChange={handleInputChange}
                            rows={6}
                            maxLength={500}
                            placeholder="Nos conte sobre você"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Você pode escrever suas experiências, seus interesses e habilidades.
                        </p>
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

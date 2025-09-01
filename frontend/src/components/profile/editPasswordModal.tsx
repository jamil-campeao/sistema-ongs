"use-client"

import type React from "react";
import { useState, useRef, useEffect } from "react"

interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPassword: string) => Promise<void>;
}

export default function EditPasswordModal({ isOpen, onClose, onSave }: EditPasswordModalProps) {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Limpar os campos e erros quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setNewPassword("");
      setConfirmNewPassword("");
      setError(null);
    }
  }, [isOpen]);

  // Fechar o modal ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Previne o scroll do body
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // Restaura o scroll do body
    };
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    setError(null); // Limpa erros anteriores

    // Validação básica no frontend
    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("A nova senha e a confirmação de senha não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Passa apenas a nova senha para a função onSave
      await onSave(newPassword);
      onClose();
    } catch (err: any) { // Captura o erro para exibir uma mensagem mais específica
      console.error("Erro ao alterar senha:", err);
      // Aqui você pode adicionar lógica para exibir mensagens de erro do backend
      setError(err.message || "Ocorreu um erro ao alterar a senha. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Alterar Senha</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Nova Senha:
          </label>
          <input
            type="password"
            id="newPassword"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isSubmitting}
            maxLength={20}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Confirmar Nova Senha:
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            disabled={isSubmitting}
            maxLength={20}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
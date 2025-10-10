"use client";

import { useEffect, useState } from "react";
import type { Ong } from "@/interfaces/index";

export default function AboutSection({ id }: { id: number }) {
  const [ong, setOng] = useState<Ong | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOng() {
      try {
        const response = await fetch('/api/ongs/' + id);
        const data = await response.json();
        setOng(data);
      } catch (error) {
        console.error("Erro ao carregar a ONG:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOng();
  }, [id]);

  if (isLoading || !ong) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium">Carregando informações...</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Sobre a ONG</h2>
      </div>

      <div className="px-6 py-4 space-y-4">
        {/* Descrição */}
        {ong.description && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Descrição</h3>
            <p className="text-gray-600 text-justify leading-relaxed">
              {ong.description}
            </p>
          </div>
        )}

        {/* Objetivos */}
        {ong.goals && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">Objetivos</h3>
            <p className="text-gray-600 text-justify leading-relaxed whitespace-pre-line">
              {ong.goals}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
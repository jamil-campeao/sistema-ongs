"use client";

import { useEffect, useState } from "react";
import type { Ong } from "@/interfaces/index";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function AddressSection({ id }: { id: number }) {
  const [ong, setOng] = useState<Ong | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        <h3 className="text-base font-medium">Carregando endereço...</h3>
      </div>
    );
  }

  const {
    street,
    number,
    complement,
    district,
    city,
    state,
    cep,
  } = ong;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Endereço</h2>
      </div>

      <div className="px-6 py-4 space-y-1 text-gray-700">
        {street && (
          <p>
            <FaMapMarkerAlt className="inline text-blue-600 mr-2" />
            {street}{number ? `, ${number}` : ""}{complement ? ` - ${complement}` : ""}
          </p>
        )}

        {district && <p>Bairro: {district}</p>}
        {city && state && <p>Cidade/UF: {city} - {state}</p>}
        {cep && <p>CEP: {cep}</p>}
      </div>
    </div>
  );
}
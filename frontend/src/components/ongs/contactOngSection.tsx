"use client";

import { useEffect, useState } from "react";
import type { Ong } from "@/interfaces/index";
import { FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa";

export default function ContactSection({ id }: { id: number }) {
  const [ong, setOng] = useState<Ong | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOng() {
      try {
        const response = await fetch('/api/ongs/' + id);
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
        <h3 className="text-base font-medium">Carregando informações...</h3>
      </div>
    );
  }

function fixUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return 'http://' + url;
}


  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Contatos & Redes</h2>
      </div>

      <div className="px-6 py-4 space-y-3">
        {ong.cellphone && (
          <div className="flex items-center gap-3 text-gray-700">
            <FaPhone className="text-blue-600" />
            <span>{ong.cellphone}</span>
          </div>
        )}

        {ong.emailONG && (
          <div className="flex items-center gap-3 text-gray-700">
            <FaEnvelope className="text-blue-600" />
            <span>{ong.emailONG}</span>
          </div>
        )}

        {ong.socialMedia && (
          <div className="flex items-center gap-3 text-gray-700">
            <FaGlobe className="text-blue-600" />
            <a
              href={fixUrl(ong.socialMedia)}          
              target="_blank"                 
              rel="noopener noreferrer"       
              className="text-blue-600 hover:underline break-all"
            >
              {ong.socialMedia}
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface OngSearchResult {
  id: number;
  nameONG: string;
  description: string;
  profileImage?: string | null;
}

interface ProjectSearchResult {
  id: number;
  name: string;
  description: string;
  projectImage?: string | null;
  ong: {
    nameONG: string;
  };
}

interface SearchResultsAPIResponse {
  ongs: OngSearchResult[];
  projects: ProjectSearchResult[];
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultsAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Ler o termo de busca da URL
  useEffect(() => {
    const query = searchParams.get('q');
    setSearchTerm(query);
  }, [searchParams]); // Re-executa se os parâmetros da URL mudarem

  // 2. Fazer a requisição ao backend
  useEffect(() => {
    async function fetchSearchResults() {
      if (!searchTerm) { 
        setIsLoading(false);
        setSearchResults(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setSearchResults(null);

      try {
        const response = await fetch(`/api/search-results?q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao buscar resultados.");
        }
        const data: SearchResultsAPIResponse = await response.json();
        setSearchResults(data);
      } catch (err: any) {
        console.error("Erro ao buscar:", err);
        setError(err.message || "Não foi possível realizar a busca.");
      } finally {
        setIsLoading(false);
      }
    }

    // Chama a busca apenas se o searchTerm não for nulo e não for uma string vazia após o trim
    if (searchTerm !== null && searchTerm.trim() !== '') {
      fetchSearchResults();
    }
  }, [searchTerm]); // Re-executa sempre que o termo de busca muda

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="container mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Resultados da Busca por: "{searchTerm}"</h1>

        {isLoading ? (
          <div className="text-center p-4">Carregando resultados...</div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">Erro: {error}</div>
        ) : !searchResults || (searchResults.ongs.length === 0 && searchResults.projects.length === 0) ? (
          <div className="text-center p-4 text-gray-600">Nenhum resultado encontrado para "{searchTerm}".</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Seção de ONGs */}
            <div className="md:col-span-1 lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">ONGs Encontradas ({searchResults.ongs.length})</h2>
              {searchResults.ongs.length > 0 ? (
                <ul className="space-y-4">
                  {searchResults.ongs.map((ongItem) => (
                    <li key={ongItem.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                      <Link href={`/ongs/${ongItem.id}`} className="block">
                        {ongItem.profileImage && (
                          <img src={ongItem.profileImage} alt={ongItem.nameONG} className="w-16 h-16 rounded-full object-cover mb-2 mx-auto" />
                        )}
                        <h3 className="text-lg font-semibold text-blue-600 hover:underline text-center">{ongItem.nameONG}</h3>
                        <p className="text-sm text-gray-600 text-center">{ongItem?.description?.substring(0, 100)}...</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhuma ONG encontrada.</p>
              )}
            </div>

            {/* Seção de Projetos */}
            <div className="md:col-span-1 lg:col-span-2"> {/* Projetos podem ocupar mais espaço */}
              <h2 className="text-xl font-semibold mb-4">Projetos Encontrados ({searchResults.projects.length})</h2>
              {searchResults.projects.length > 0 ? (
                <ul className="space-y-4">
                  {searchResults.projects.map((projectItem) => (
                    <li key={projectItem.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                      <Link href={`/projects/${projectItem.id}`} className="block">
                        {projectItem.projectImage && (
                          <img src={projectItem.projectImage} alt={projectItem.name} className="w-full h-32 object-cover rounded-md mb-2" />
                        )}
                        <h3 className="text-lg font-semibold text-blue-600 hover:underline">{projectItem.name}</h3>
                        <p className="text-sm text-gray-600">{projectItem?.description?.substring(0, 150)}...</p>
                        <p className="text-xs text-gray-500 mt-1">ONG: {projectItem.ong.nameONG}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhum projeto encontrado.</p>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
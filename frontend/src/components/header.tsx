"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "@/components/logout-button";
import { useOng } from "@/context/ongContext";
import { noProfileImageUser, noProfileImageONG } from "app/images";
import { useUser } from "@/context/userContext";

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { ong } = useOng();
  const { user } = useUser();
  const pathName = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const loggedInEntity = user || ong;

  const profileImage = (loggedInEntity: any) => {
    if (loggedInEntity?.role !== "ONG") {
      return loggedInEntity?.profileImage !== null ? loggedInEntity?.profileImage : noProfileImageUser
    }
    else {
      return loggedInEntity?.profileImage !== null ? loggedInEntity?.profileImage : noProfileImageONG
    }
  }

  const isActive = (path: string) => {
    return pathName === path;
  }
 

  const profileLink = ong ? "/profile/ong" : "/profile/user";

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);

  };

  // --- Função para lidar com a busca ao pressionar Enter ---
  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const trimmedSearchTerm = searchTerm.trim();
      if (trimmedSearchTerm) {
        // Redireciona para a página de resultados de busca
        router.push(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`);
        setSearchTerm(""); // Limpa o campo de busca após a pesquisa
      }
    }
  };
  // -----------

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container flex items-center justify-between h-14 px-4 mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/feed" className="text-2xl font-bold text-blue-600">
            <img src="/static/logo.webp" alt="Logo" className="w-14 h-14 rounded" />
          </Link>
          <div className="relative hidden md:block">
            <svg
              className="absolute left-2 top-2.5 h-4 w-4 text-gray-500"
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
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {/* Input de Busca */}
            <input 
              placeholder="Buscar ONG's e Projetos" 
              className="w-64 pl-8 bg-gray-100 border-none rounded-md h-9 px-3" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              />
          </div>
        </div>
        <nav className="flex items-center space-x-1">
          {/* Início */}
          <Link href="/feed" className="flex flex-col items-center px-1 py-1">
              <div
                className={`flex items-center justify-center h-9 w-9 rounded-md ${
                  isActive("/feed") ? "text-blue-600 bg-blue-100" : "text-gray-500 hover:text-gray-700"
                }`}
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
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span
              className={`text-xs mt-0.5 ${
                isActive("/feed") ? "text-blue-600 font-semibold" : "text-gray-500"
              }`}
            >
              Início
            </span>
          </Link>

           {/* ONG's */}     
            <Link href="/ongs" className="flex flex-col items-center px-1 py-1">
              <div
                className={`flex items-center justify-center h-9 w-9 rounded-md ${
                  isActive("/ongs") ? "text-blue-600 bg-blue-100" : "text-gray-500 hover:text-gray-700"
                }`}
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span
              className={`text-xs mt-0.5 ${
                isActive("/ongs") ? "text-blue-600 font-semibold" : "text-gray-500"
              }`}
            >
              ONG's
            </span>
          </Link>

          {/* Projetos */}      
            <Link href="/projects" className="flex flex-col items-center px-1 py-1">
              <div
                className={`flex items-center justify-center h-9 w-9 rounded-md ${
                  isActive("/projects") ? "text-blue-600 bg-blue-100" : "text-gray-500 hover:text-gray-700"
                }`}
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
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <span
              className={`text-xs mt-0.5 ${
                isActive("/projects") ? "text-blue-600 font-semibold" : "text-gray-500"
              }`}
            >
              Projetos
            </span>
          </Link>

          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Meu Perfil */}
            <Link href={profileLink} className="flex flex-col items-center">
              <div className={`h-7 w-7 rounded-full overflow-hidden ${
                    isActive(profileLink) ? "text-blue-600 bg-blue-100" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                <img src={profileImage(loggedInEntity)} alt="User" className="h-full w-full object-cover" />
              </div>
                <span
                  className={`text-xs mt-0.5 ${
                    isActive(profileLink) ? "text-blue-600 font-semibold" : "text-gray-500"
                  }`}
                >Perfil ▼</span>
            </Link>

            <div
              className={`absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 transition-opacity duration-200 ${
                isHovered ? "opacity-100 visible" : "opacity-0 invisible"
              }`
            }
            >
              <Link href={profileLink} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Meu Perfil
              </Link>
              {/* Renderiza o link 'Painel de Colaboradores' APENAS SE loggedInEntity for uma ONG */}
              {loggedInEntity?.role === 'ONG' && (
                <Link href='/manage-collaborators' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Painel de Colaboradores
                </Link>
              )}
              {/* Renderiza o link 'Painel de Projetos da ONG' APENAS SE loggedInEntity for uma ONG */}
              {loggedInEntity?.role === 'ONG' && (
                <Link href='/manage-projects/ong' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Painel de Projetos da ONG
                </Link>
              )}
              {/* Renderiza o link 'Painel de Projetos' APENAS SE loggedInEntity for um COLABORADOR */}
              {loggedInEntity?.role === 'COLLABORATOR' && loggedInEntity.ong?.id && (
                <Link href='/manage-projects' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Painel de Projetos
                </Link>
              )}
              <div className="border-t border-gray-100 my-1"></div>
              <div className="px-4 py-2">
                <LogoutButton />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
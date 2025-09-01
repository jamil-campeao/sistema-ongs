"use client"

import { useState } from "react"
import Header from "@/components/header"
import Feed from "@/components/feed/feed"
import RecentActivity from "@/components/recentActivity"
import Footer from "@/components/footer"
import CreatePostModal, { type PostData } from "@/components/createPostModal"
import { useUser } from "@/context/userContext"
import { useOng } from "@/context/ongContext"
import { noProfileImageONG, noProfileImageUser } from "app/images"

export default function HomePage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const { user } = useUser();
  const { ong } = useOng();

  const typeLabels: Record<string, string> = {
      ONG: "ONG",
      COLLABORATOR: "COLABORADOR",
      VOLUNTARY: "VOLUNTÁRIO",
      ADMIN: "ADMINISTRADOR"
  };

  const role = user?.role || "ONG";
  const loggedInEntity = user || ong;

  const profileImage = (loggedInEntity: any) => {
    if (loggedInEntity?.role !== "ONG") {
      return loggedInEntity?.profileImage !== null ? loggedInEntity?.profileImage : noProfileImageUser
    }
    else {
      return loggedInEntity?.profileImage !== null ? loggedInEntity?.profileImage : noProfileImageONG
    }
  }


  const handlePost = async (postData: PostData) => {
    try {
      if (user) {
        postData.userId = user.id;
      } else if (ong) {
        postData.ongId = ong.id;
      } else {
        throw new Error("Usuário ou ONG não autenticado");
      }
      // postData.projectId = 1; // NÃO SEI O PQ ISSO AQUI SÓ SEI QUE SE EU TIRAR PARA DE FUNCIONAR {JAMIL} //AGORA EU ENTENDI

      const response = await fetch('/api/posts', {
          method: "POST",
          body: JSON.stringify(postData),
          headers: {
            "Content-Type": "application/json"
          }
      });

      if (!response.ok) {
        console.error("Erro ao publicar o post", await response.json());
        throw new Error("Falha ao publicar o post");
      }
      setReloadTrigger(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Conteúdo principal */}
      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Profile Card */}
          <div className="md:col-span-1 h-fit bg-white rounded-lg shadow">
            <div className="p-0">
              <div className="h-16 bg-blue-600 rounded-t-lg"></div>
              <div className="flex justify-center -mt-8">
                <div className="h-16 w-16 rounded-full border-4 border-white overflow-hidden">
                  {profileImage(loggedInEntity) ? (
                      <img
                          src={profileImage(loggedInEntity)}
                          alt={loggedInEntity?.name || loggedInEntity?.nameONG}
                          className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">{loggedInEntity?.name?.charAt(0) || loggedInEntity?.nameONG?.charAt(0)}</span>
                      </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-center pt-2 p-4">
              <h3 className="font-semibold text-lg">{loggedInEntity?.name || loggedInEntity?.nameONG}</h3>
              <p className="text-sm text-gray-500">{typeLabels[role]}</p>
              {role !== 'ONG' && (
              <div className="border-t border-b my-3 py-3">
                {/* <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Visualizações do Perfil</span>
                  <span className="font-semibold text-blue-600">
                    {user?.views !== undefined ? user.views : "Carregando..."}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Conexões</span>
                    <span className="font-semibold text-blue-600">
                      {user?.connections !== undefined ? user.connections : "Carregando..."}
                    </span>
                </div> */}
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Atividades</span>
                    <span className="font-semibold text-blue-600">
                      {user?.activity ? user.activity.length : "Carregando..."}
                    </span>
                </div>
                </div>
              )}

            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4">
            {/* Post Creator */}
            {user?.role !== 'VOLUNTARY' && (
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  {profileImage(loggedInEntity) ? (
                    <img
                      src={profileImage(loggedInEntity)}
                      alt={loggedInEntity.name || loggedInEntity.nameONG}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">{loggedInEntity?.name?.charAt(0) || loggedInEntity?.nameONG?.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="w-full justify-start text-gray-500 rounded-full border border-gray-300 px-4 py-2 text-left hover:bg-gray-50"
                >
                  O que você está pensando?
                </button>
              </div>
            </div>
            )}

            {/* Feed */}
            <Feed reloadTrigger={reloadTrigger} />
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </main>

      {/* Modal de criação de post */}
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        userImage={profileImage(loggedInEntity)}
        userName={loggedInEntity?.name || loggedInEntity?.nameONG}
        userTitle={typeLabels[role]}
        onPost={handlePost}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
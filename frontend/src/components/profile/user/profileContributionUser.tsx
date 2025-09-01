"use client";

import { useEffect, useState } from "react"
import EditContributionModal, {ContributionData} from "@/components/profile/user/editContributionModal";

export default function ProfileContributionUser() {
    interface Contribution {
        id?: number;
        name: string;
        description: string;
        type: string;
        location: string;
        hours: number;
        date: string,
        ongId?: number;
        ongName: string;
        rating?: number;
        feedback?: string;
    }

    const [contributions, setContribution] = useState<Contribution[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContribution, setSelectedContribution] = useState<ContributionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const typeLabels: Record<string, string> = {
        PRESENCIAL: "Presencial",
        REMOTO: "Remoto",
        SUPORTE_TECNICO: "Suporte Técnico",
        DOACAO: "Doação",
        OUTRO: "Outro"
    };

    useEffect(() => {
        async function loadContributions() {
            setIsLoading(true);
            const response = await fetch('/api/contributions', {
                method: 'GET'
            });
            const contributionsData = await response.json();
            setContribution(contributionsData || []);
            setIsLoading(false);
        }
        loadContributions()
    }, []);

    const handleEditClick = (contribution: Contribution) => {
        setSelectedContribution({
            ...contribution
        });
        setIsModalOpen(true);
    }

    const handleSave = async (updatedContribution: ContributionData) => {
        try {
            let savedContribution: ContributionData;

            if( updatedContribution.id === undefined) {
                const response = await fetch('/api/contributions', {
                    method: 'POST',
                    body: JSON.stringify(updatedContribution)
                });

                savedContribution = await response.json();
                setContribution((prev) => [...prev, savedContribution]);
            }
            else {
                const response = await fetch('/api/contributions/'  + updatedContribution.id, {
                    method: 'PUT',
                    body: JSON.stringify(updatedContribution)
                });

                savedContribution = await response.json();
                setContribution((prev) =>
                    prev.map((contribution) =>
                        contribution.id === savedContribution.id ? savedContribution : contribution
                    )   
                );
            }
            
        } catch (error: any) {
            alert(error.message || "Erro ao criar/atualizar contribuilçao");
        }
        finally {
            setIsModalOpen(false);
        }
    };

    const handleDelete = async (contribution: ContributionData) => {
        try {
            if (contribution.id === undefined) return;

            const response = await fetch('/api/contributions/' + contribution.id, {
                method: 'DELETE'
            });

            setContribution((prev) => prev.filter((c) => c.id !== contribution.id));
        } catch (error: any) {
            alert(error.message || "Erro ao excluir contribuição")
        }
        finally {
            setIsModalOpen(false);
        }
    }

    const handleAddClick = () => {
        setSelectedContribution({
            name: "",
            description: "",
            type: "",
            location: "",
            hours: 0,
            date: new Date().toISOString().split("T")[0],
            ongId: 0,
            ongName: "",
        });
        setIsModalOpen(true)
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-4">Carregando contribuições...</h3>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="flex flex-row items-center justify-between p-4">
            <h3 className="text-lg font-medium">Minhas Contribuições</h3>
            <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Adicionar Contribuição"
                onClick={handleAddClick}>
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
                    <path d="M12 5v14M5 12h14" />
                </svg>
                </button>
            </div>
            </div>
            <div className="px-4 pb-4 space-y-6">
    {contributions.length > 0 ? (
        contributions.map((contribution, index) => (
            <div
                key={index}
                className="p-4 border border-gray-300 rounded-md shadow-sm"
            >
                <h4 className="text-md font-bold">{contribution.name}</h4>
                <p className="text-sm text-gray-600">{contribution.description}</p>
                <p className="text-sm text-gray-500">Local: {contribution.location}</p>
                <p className="text-sm text-gray-500">Horas: {contribution.hours}</p>
                <p className="text-sm text-gray-500">
                    Data: {new Date(contribution.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500"> Tipo: {typeLabels[contribution.type] || "Tipo Desconhecido"}</p>
                <p className="text-sm text-gray-800"> ONG: {contribution.ongName}</p>
                <p className="text-sm text-gray-500"> Avaliação da ONG: {contribution.rating ? contribution.rating : "Sem avaliação"}</p>
                <p className="text-sm text-gray-500"> Feedback: {contribution.feedback ? contribution.feedback : "Sem Feedback"}</p>
                {/* Botão Editar dentro do mapeamento */}
                <button className="p-2 rounded-full hover:bg-gray-100 top-2 right-2"
                aria-label="Editar Contribuição"
                onClick={() => handleEditClick(contribution)}>
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
        ))
    ) : (
        <p className="text-sm text-gray-500">Nenhuma contribuição encontrada.</p>
    )}
        </div>
            {/* Modal de Edição / Criação*/}
            {isModalOpen && selectedContribution && (
                <EditContributionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    initialData={selectedContribution}
                    type={selectedContribution.id ? "Editar Contribuição" : "Nova Contribuição"}
                    canDelete={selectedContribution.id ? true : false}
                />
            )}
        </div>
    );
}
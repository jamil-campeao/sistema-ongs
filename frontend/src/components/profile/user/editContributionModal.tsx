"use client";

import { useState, useRef, useEffect } from "react";

interface EditContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contributionData: ContributionData) => Promise<void>;
  onDelete: (contributionData: ContributionData) => Promise<void>;
  initialData: ContributionData;
  type: String;
  canDelete: Boolean
}

export interface ContributionData {
  id?: number;
  name: string;
  date: string;
  type: string;
  description: string;
  hours: number;
  location: string;
  ongId?: number;
  ongName: string;
}

export default function EditContributionModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  type,
  canDelete
}: EditContributionModalProps) {
  const [contributionData, setContributionData] = useState<ContributionData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allOngs, setAllOngs] = useState<{ id: number; name: string }[]>([]);
  const [suggestions, setSuggestions] = useState<{ id: number; name: string } []>([]);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
        async function fetchAllOngs() {
            try {
              const response = await fetch('/api/ongs', {
                  method: 'GET'
              });
              const fetchedOngs = await response.json();
                setAllOngs(fetchedOngs.map((ong: { id: number; name: string }) => ({
                    id: ong.id,
                    name: ong.name,
                })));
            } 
            catch (error) {
                console.error("Erro ao carregar as ONGS: ", error);
            }
        }
        fetchAllOngs();
        const dataFormatada = new Date(initialData.date).toISOString().split("T")[0];
        setContributionData((prev) => ({
            ...prev,
            date: dataFormatada,
        }));
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent body scrolling
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // Restore body scrolling
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContributionData((prev) => ({
      ...prev,
      [name]: name === "hours" ? Number.parseInt(value) : value, // Converte "hours" para número
    }));

    if (name === "ongName") {
        filterSuggestions(value); // Filtra suguestões localmente
        setIsSuggestionSelected(false); //Marca que nenhuma sugestão foi selecionada
    }
  };

  const filterSuggestions = async (query: string) => {
    if (!query) {
        setSuggestions([]);
        return;
    }

    const filtered = allOngs.filter((ong) =>
        ong.name.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
        //Removo o ongId se nenhuma sugestão foi selecionada
        const dataToSave = { ...contributionData };

        if (!isSuggestionSelected) {
            delete dataToSave.ongId;
        }

        if (!fValidacoes(contributionData)) {
          return
        }

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar dados da contribuição:", error);
      setError("Erro ao salvar dados da contribuição");
    } finally {
      setIsSubmitting(false);
    }

    function fValidacoes(contribuitonData: ContributionData) {
      if (contribuitonData.name === "") {
        setError("Título não informado");
        return false;
      }
      else
      if (contribuitonData.ongName === "") {
        setError("Nome da ONG não informada");
        return false;
      }
      else
      if(contribuitonData.date === "") {
        setError("Data não informada")
        return false;
      }
      if (contribuitonData.hours === 0) {
        setError("Número de horas não inforamada");
        return false;
      }
      else
      if (contribuitonData.location === "") {
        setError("Localização não informada");
        return false;
      }
      else
      if (contribuitonData.type === "") {
        setError("Tipo da contribuição não informada");
        return false;
      }
      else
      if(contribuitonData.description === "") {
        setError("Descrição não informada");
        return false;
      }

      return true;

    }
  };

  const handleDeleteClick = () => {
    const confirmDelete = confirm("Deseja realmente excluir esta contribuição?");
    if (confirmDelete) {
      onDelete(contributionData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-lg font-medium">{type}</h2> 
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        {error && (
        <div className="text-center">
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
            </div>
            </div>
          )}

        {/* Content */}
        <div className="overflow-y-auto flex-grow p-4 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Título*
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={contributionData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="ongName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da ONG*
            </label>
            <input
                id="ongName"
                name="ongName"
                type="text"
                value={contributionData.ongName}
                onChange={handleInputChange}
                onFocus={() => {
                    if (!contributionData.ongName) {
                        setSuggestions(allOngs); //Mostra todas as ONGS ao focar (caso o campo estiver vazio)
                    }
                }}
                onBlur={() => {
                    setTimeout(() => setSuggestions([]), 200); // Esconde sugestões com um pequeno delay
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                maxLength={60}
            />
            {/* Lista de sugestões */}
            {suggestions.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-y-auto z-20">
                {suggestions.map((suggestion) => (
                    <li
                    key={suggestion.id}
                    onClick={() => {
                        setContributionData((prev) => ({
                        ...prev,
                        ongId: suggestion.id, // Define o ID da ONG
                        ongName: suggestion.name, // Define o nome da ONG
                        }));
                        setIsSuggestionSelected(true); // Marca que uma sugestão foi selecionada
                        setSuggestions([]); // Esconde as sugestões
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                    {suggestion.name}
                    </li>
                ))}
                </ul>
            )}
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Data*
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={contributionData.date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                Horas*
              </label>
              <input
                id="hours"
                name="hours"
                type="number"
                value={contributionData.hours}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Localização*
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={contributionData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              maxLength={60}
            />
            <div>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={async () => {
                  let cepRetorno;

                  if (contributionData.location && contributionData.location.length > 0) {
                    cepRetorno = contributionData.location;
                  }
                  else {
                    cepRetorno = prompt("Digite o CEP da Cidade: ");
                  }

                  console.log(cepRetorno)

                  if (cepRetorno) {
                    // Remove caracteres não numéricos do CEP
                    cepRetorno = cepRetorno.replace(/\D/g, "");
                    //Verifica se o CEP tekm 8 dígitos
                    if (cepRetorno.length !== 8) {
                      alert("CEP inválido. O CEP deve conter 8 dígitos.");
                      contributionData.location = "";
                      return;
                    }
                    try {
                      const response = await fetch('/api/location', {
                        method: 'POST',
                        body: JSON.stringify({ cep: cepRetorno })
                      });
                      const data = await response.json();
                      const location = data.localidade + ", " + data.uf;
                      if (!location) {
                        alert("Localização não encontrada. Verifique o CEP e tenten novamente.");
                        contributionData.location = "";
                        return;
                      }
                      // Atualiza o campo de localização com a cidade e o estado retornados
                      setContributionData((prev) => ({
                        ...prev,
                        location 
                      })); 
                    }
                    catch (error) {
                      alert("Erro ao buscar localização. Verifique o CEP e tente novamente.");
                      contributionData.location = "";
                    }
                  }
                }}
                >
                  Importar Localização pelo CEP
                </button>

            </div>
          </div>

          <div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo*
              </label>
              <select
                id="type"
                name="type"
                value={contributionData.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um tipo</option>
                <option value="PRESENCIAL">Presencial</option>
                <option value="REMOTO">Remoto</option>
                <option value="DOACAO">Doação</option>
                <option value="SUPORTE_TECNICO">Suporte Técnico</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição*
            </label>
            <textarea
              id="description"
              name="description"
              value={contributionData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              maxLength={500}
            />
          </div>


        </div>

        {/* Footer */}
        <div className="p-4 border-t sticky bottom-0 bg-white z-10 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            {canDelete && (
          <button
              onClick={handleDeleteClick}
              className="px-4 py-2 border border-red-500 text-red-600 rounded-md text-sm font-medium hover:bg-red-50"
            >
              Excluir
            </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
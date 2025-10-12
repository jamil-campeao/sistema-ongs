"use client";

import type React from "react";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/footer";
import { validaCNPJ } from "../functions.js";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [nameONG, setNameONG] = useState("");
  const [socialName, setSocialName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [foundationDate, setFoundationDate] = useState("");
  const [area, setArea] = useState("");
  const [goals, setGoals] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [emailONG, setEmailONG] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [nameLegalGuardian, setNameLegalGuardian] = useState("");
  const [cpfLegalGuardian, setCpfLegalGuardian] = useState("");
  const [rgLegalGuardian, setRgLegalGuardian] = useState("");
  const [cellphoneLegalGuardian, setCellphoneLegalGuardian] = useState("");
  const [ongId, setOngId] = useState("");
  const [error, setError] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const router = useRouter();
  const showVoluntaryFields = role === "VOLUNTARY";
  const showAdvertiserFields = role === "ADVERTISER";
  const showCollaboratorFields = role === "COLLABORATOR";

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setMaxDate(getTodayDateString());
  });

  // Função auxiliar para validar senhas
  const validatePassword = (
    password: string,
    passwordConfirm: string
  ): string | null => {
    if (password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres";
    }
    if (password !== passwordConfirm) {
      return "As senhas não coincidem";
    }
    return null;
  };

  // Função específica para cadastrar USUÁRIO
  const handleUserSubmit = async () => {
    // 1. Validação de campos
    if (
      !name ||
      !email ||
      !password ||
      !passwordConfirm ||
      !location ||
      !role
    ) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    const passwordError = validatePassword(password, passwordConfirm);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // 2. Chamada à API
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          location,
          role,
          description,
        }),
      });
      const data = await response.json(); // Lemos a resposta aqui

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar usuário");
      }

      alert("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (error: any) {
      setError(error.message || "Erro ao cadastrar usuário");
    }
  };

  // Função específica para cadastrar ANUNCIANTE (ONG/Empresa)
  const handleAdvertiserSubmit = async () => {
    // 1. Validação de campos
    if (
      !nameONG ||
      !socialName ||
      !cnpj ||
      !foundationDate ||
      !area ||
      !goals ||
      !role ||
      !cep ||
      !street ||
      !emailONG ||
      !nameLegalGuardian ||
      !password ||
      !passwordConfirm
    ) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    const passwordError = validatePassword(password, passwordConfirm);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // 2. Chamada à API
    try {
      const response = await fetch(`/api/ongs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameONG,
          socialName,
          cnpj,
          foundationDate,
          area,
          goals,
          cep,
          street,
          number,
          complement,
          city,
          district,
          state,
          cellphone,
          emailONG,
          socialMedia,
          nameLegalGuardian,
          cpfLegalGuardian,
          rgLegalGuardian,
          cellphoneLegalGuardian,
          description,
          password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar ONG/Empresa");
      }

      alert("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (error: any) {
      setError(`Erro ao cadastrar ONG/Empresa: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "ADVERTISER") {
      await handleAdvertiserSubmit();
    } else {
      await handleUserSubmit();
    }
  };

  async function consultaDadosCEP(cep: any) {
    let cepRetorno;

    if (cep && cep.length > 0) {
      cepRetorno = cep;
    } else {
      cepRetorno = prompt("Digite o CEP da Cidade: ");
    }

    if (cepRetorno) {
      // Remove caracteres não numéricos do CEP
      cepRetorno = cepRetorno.replace(/\D/g, "");
      //Verifica se o CEP tekm 8 dígitos
      if (cepRetorno.length !== 8) {
        alert("CEP inválido. O CEP deve conter 8 dígitos.");
        return;
      }
      try {
        const response = await fetch("/api/location", {
          method: "POST",
          body: JSON.stringify({ cep: cepRetorno }),
        });
        const data = await response.json();

        if (!data) {
          alert(
            "Localização não encontrada. Verifique o CEP e tente novamente."
          );
          return;
        } else if (data.erro == "true") {
          alert("CEP inválido, tente novamente");
          return;
        } else {
          return data;
        }
      } catch (error) {
        alert("Erro ao buscar localização. Verifique o CEP e tente novamente.");
      }
    }
  }

  async function consultaDadosCNPJ(cnpjParam: any) {
    let CNPJ;
    if (cnpjParam && cnpjParam.length > 0) {
      CNPJ = cnpjParam;
    } else {
      CNPJ = prompt("Digite o CNPJ:");
    }

    if (!CNPJ) return;

    // Remove tudo que não for número
    CNPJ = CNPJ.replace(/\D/g, "");

    if (!validaCNPJ(CNPJ)) {
      alert("CNPJ informado é inválido");
      return;
    }

    try {
      const response = await fetch(`/api/ongs/cnpj/${CNPJ}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status === "ERROR") {
        alert(data.message || "Erro ao consultar CNPJ.");
        return;
      }

      return data;
    } catch (error) {
      console.error(error);
      alert("Erro ao realizar consulta dos dados do CNPJ.");
    }
  }

  const resetFormFields = () => {
    setNameONG("");
    setSocialName("");
    setEmailONG("");
    setCnpj("");
    setFoundationDate("");
    setArea("");
    setCep("");
    setStreet("");
    setComplement("");
    setDistrict("");
    setCity("");
    setState("");
    setNumber("");
    setCellphone("");
    setCpfLegalGuardian("");
    setRgLegalGuardian("");
  };

  const handleCnpjLookup = async () => {
    resetFormFields();

    try {
      const data = await consultaDadosCNPJ(cnpj);

      // Se a API não retornar dados, não fazemos nada
      if (!data) return;

      // Mapeamento direto e seguro usando ?. e ??
      setNameONG(data.fantasia?.trim() ?? "");
      setSocialName(data.nome?.trim() ?? "");
      setCnpj(data.cnpj?.trim() ?? "");
      setEmailONG(data.email?.trim() ?? "");
      setCep(data.cep?.trim() ?? "");
      setStreet(data.logradouro?.trim() ?? "");
      setComplement(data.complemento?.trim() ?? "");
      setDistrict(data.bairro?.trim() ?? "");
      setCity(data.municipio?.trim() ?? "");
      setState(data.uf?.trim() ?? "");
      setNumber(data.numero?.trim() ?? "");
      setCellphone(data.telefone?.trim() ?? "");

      if (data.abertura) {
        const partes = data.abertura.split("/");
        if (partes.length === 3) {
          setFoundationDate(`${partes[2]}-${partes[1]}-${partes[0]}`);
        }
      }

      // Acesso seguro a arrays
      const atividadePrincipal = data.atividade_principal?.[0]?.text;
      setArea(atividadePrincipal?.trim() ?? "");

      const nomeResponsavel = data.qsa?.[0]?.nome;
      setNameLegalGuardian(nomeResponsavel?.trim() ?? "");
    } catch (error) {
      console.error("Erro ao consultar CNPJ:", error);
      alert(
        "Ocorreu um erro ao consultar o CNPJ. Verifique o número e tente novamente."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="container mx-auto text-center">
            <Link href="/" className="inline-block">
              <img
                src="/static/logo.webp"
                alt="Logo"
                className="w-20 h-20 rounded mx-auto"
              />
            </Link>
          </div>
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Cadastro Colabora
            </h2>
            <h4 className="mt-6 text-md font-bold text-gray-900">
              Website de apoio à ONGs e Projetos Sociais
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              Conecte-se com ONG's e Projetos Sociais
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipo de Usuário
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    autoComplete="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Selecione o tipo de usuário
                    </option>
                    <option value="ADVERTISER">Empresa/ONG</option>
                    <option value="VOLUNTARY">Voluntário</option>
                    <option value="COLLABORATOR">Colaborador</option>
                  </select>
                </div>
              </div>

              {/* Campos dos Voluntários e Colaboradores de ONGs */}
              {(showVoluntaryFields || showCollaboratorFields) && (
                <>
                  {/* Nome */}

                  <hr className="my-4" />
                  <h3 className="text-md font-semibold text-gray-700">
                    Informações de Voluntários / Colaboradores
                  </h3>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome Completo
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome Completo"
                        maxLength={60}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Informe o email"
                        maxLength={256}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cidade
                    </label>
                    <div className="mt-1">
                      <input
                        id="location"
                        name="location"
                        type="location"
                        autoComplete="location"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: São Paulo, SP"
                        maxLength={50}
                      />
                    </div>

                    <div className="mt-1">
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={async () => {
                          const data = await consultaDadosCEP(location);

                          if (data) {
                            const cidade = data.localidade + ", " + data.uf;

                            setLocation(cidade);
                          } else {
                            setLocation("");
                          }
                        }}
                      >
                        Importar Localização pelo CEP
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div></div>

              {/* Campos para Empresa/ONG */}
              {showAdvertiserFields && (
                <>
                  <hr className="my-4" />
                  <h3 className="text-md font-semibold text-gray-700">
                    Informações da Organização
                  </h3>

                  <div>
                    <label
                      htmlFor="nameONG"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome Fantasia*
                    </label>
                    <div className="mt-1">
                      <input
                        id="nameONG"
                        name="nameONG"
                        type="text"
                        autoComplete="nameONG"
                        required
                        value={nameONG}
                        onChange={(e) => setNameONG(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome usado publicamente"
                        maxLength={60}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="socialName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Razão Social*
                    </label>
                    <div className="mt-1">
                      <input
                        id="socialName"
                        name="socialName"
                        type="text"
                        autoComplete="socialName"
                        required
                        value={socialName}
                        onChange={(e) => setSocialName(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome jurídico no CNPJ"
                        maxLength={60}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cnpj"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CNPJ*
                    </label>
                    <div className="mt-1">
                      <input
                        id="cnpj"
                        name="cnpj"
                        type="text"
                        autoComplete="cnpj"
                        required
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                      />
                    </div>

                    <div className="mt-1">
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleCnpjLookup}
                      >
                        Importar dados do CNPJ
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="FoundationDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Data de Fundação*
                    </label>
                    <div className="mt-1">
                      <input
                        id="FoundationDate"
                        name="FoundationDate"
                        type="date"
                        autoComplete="FoundationDate"
                        required
                        value={foundationDate}
                        onChange={(e) => setFoundationDate(e.target.value)}
                        max={maxDate}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="area"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Área de Atuação*
                    </label>
                    <div className="mt-1">
                      <input
                        id="area"
                        name="area"
                        type="text"
                        autoComplete="area"
                        required
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Educação, Saúde, etc."
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="goals"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Missão/Objetivo*
                    </label>
                    <div className="mt-1">
                      <input
                        id="goals"
                        name="goals"
                        type="text"
                        autoComplete="goals"
                        required
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Finalidade da ONG"
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cep"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CEP*
                    </label>
                    <div className="mt-1">
                      <input
                        id="cep"
                        name="cep"
                        type="text"
                        autoComplete="cep"
                        required
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>

                    <div className="mt-1">
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={async () => {
                          const data = await consultaDadosCEP(cep);

                          {
                            /* Primeiro limpo os campos */
                          }
                          setCep("");
                          setStreet("");
                          setComplement("");
                          setDistrict("");
                          setCity("");
                          setState("");
                          setNumber("");

                          if (data) {
                            {
                              /* seto eles caso existam na requisição */
                            }
                            data.cep ? setCep(data.cep.trim()) : setCep("");
                            data.logradouro
                              ? setStreet(data.logradouro.trim())
                              : setStreet("");
                            data.complemento
                              ? setComplement(data.complemento.trim())
                              : setComplement("");
                            data.bairro
                              ? setDistrict(data.bairro.trim())
                              : setDistrict("");
                            data.localidade
                              ? setCity(data.localidade.trim())
                              : setCity("");
                            data.uf ? setState(data.uf.trim()) : setState("");
                          }
                        }}
                      >
                        Importar dados de localização pelo CEP
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Rua/Avenida*
                    </label>
                    <div className="mt-1">
                      <input
                        id="street"
                        name="street"
                        type="text"
                        autoComplete="street"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Rua das Flores"
                        maxLength={60}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Número
                    </label>
                    <div className="mt-1">
                      <input
                        id="number"
                        name="number"
                        type="text"
                        autoComplete="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: 210"
                        maxLength={30}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="complement"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Complemento
                    </label>
                    <div className="mt-1">
                      <input
                        id="complement"
                        name="complement"
                        type="text"
                        autoComplete="complement"
                        value={complement}
                        onChange={(e) => setComplement(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Bloco, sala, etc."
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bairro
                    </label>
                    <div className="mt-1">
                      <input
                        id="district"
                        name="district"
                        type="text"
                        autoComplete="district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Centro"
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cidade
                    </label>
                    <div className="mt-1">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: São Paulo"
                        maxLength={50}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estado
                    </label>
                    <div className="mt-1">
                      <input
                        id="state"
                        name="state"
                        type="text"
                        autoComplete="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: SP"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cellphone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Telefone / WhatsApp
                    </label>
                    <div className="mt-1">
                      <input
                        id="cellphone"
                        name="cellphone"
                        type="text"
                        autoComplete="cellphone"
                        value={cellphone}
                        onChange={(e) => setCellphone(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: (11) 99999-9999"
                        maxLength={16}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="emailONG"
                      className="block text-sm font-medium text-gray-700"
                    >
                      E-mail institucional*
                    </label>
                    <div className="mt-1">
                      <input
                        id="emailONG"
                        name="emailONG"
                        type="text"
                        autoComplete="emailONG"
                        required
                        value={emailONG}
                        onChange={(e) => setEmailONG(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: contato@ong.org.br"
                        maxLength={256}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="socialMedia"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Redes Sociais
                    </label>
                    <div className="mt-1">
                      <input
                        id="socialMedia"
                        name="socialMedia"
                        type="text"
                        autoComplete="socialMedia"
                        value={socialMedia}
                        onChange={(e) => setSocialMedia(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Facebook, Instagram, LinkedIn..."
                        maxLength={100}
                      />
                    </div>
                  </div>

                  <hr className="my-4" />
                  <h3 className="text-md font-semibold text-gray-700">
                    Responsável Legal
                  </h3>

                  <div>
                    <label
                      htmlFor="nameLegalGuardian"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome completo*
                    </label>
                    <div className="mt-1">
                      <input
                        id="nameLegalGuardian"
                        name="nameLegalGuardian"
                        type="text"
                        autoComplete="nameLegalGuardian"
                        required
                        value={nameLegalGuardian}
                        onChange={(e) => setNameLegalGuardian(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome do responsável legal"
                        maxLength={60}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="CPFLegalGuardian"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CPF
                    </label>
                    <div className="mt-1">
                      <input
                        id="CPFLegalGuardian"
                        name="CPFLegalGuardian"
                        type="text"
                        autoComplete="CPFLegalGuardian"
                        value={cpfLegalGuardian}
                        onChange={(e) => setCpfLegalGuardian(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="000.000.000-00"
                        maxLength={14}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="RGLegalGuardian"
                      className="block text-sm font-medium text-gray-700"
                    >
                      RG
                    </label>
                    <div className="mt-1">
                      <input
                        id="RGLegalGuardian"
                        name="RGLegalGuardian"
                        type="text"
                        autoComplete="RGLegalGuardian"
                        value={rgLegalGuardian}
                        onChange={(e) => setRgLegalGuardian(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="00.000.000-0"
                        maxLength={12}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cellphoneLegalGuardian"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Telefone / Celular
                    </label>
                    <div className="mt-1">
                      <input
                        id="cellphoneLegalGuardian"
                        name="cellphoneLegalGuardian"
                        type="text"
                        autoComplete="cellphoneLegalGuardian"
                        value={cellphoneLegalGuardian}
                        onChange={(e) =>
                          setCellphoneLegalGuardian(e.target.value)
                        }
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: (11) 99999-9999"
                        maxLength={16}
                      />
                    </div>
                  </div>
                </>
              )}

              {role && (
                <>
                  <hr className="my-4" />
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sobre
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        autoComplete="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Breve descrição do usuário/ONG"
                        rows={4}
                        maxLength={500}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Senha (6 ou mais caracteres)*
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Informe a senha"
                        maxLength={20}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="passwordConfirm"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirmação de Senha*
                    </label>
                    <div className="mt-1">
                      <input
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={6}
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Confirme a senha"
                        maxLength={20}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="text-sm text-center text-gray-600">
                <p>
                  Ao clicar em cadastrar-se você aceita os{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Termos de Uso
                  </a>
                  , e{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Política de Privacidade
                  </a>
                  .
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cadastrar-se
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Já é membro?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

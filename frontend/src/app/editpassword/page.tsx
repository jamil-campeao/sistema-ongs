"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "../../components/footer";

const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    ></path>
  </svg>
);

function EditPasswordForm() {
  const searchParams = useSearchParams();

  // Pegamos email e codigo da URL e já colocamos no estado
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [codigo, setCodigo] = useState(searchParams.get("codigo") || "");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!codigo || !email || !password || !passwordConfirm) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (password !== passwordConfirm) {
      setError("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/forgot-password/", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          codigo: codigo,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao redefinir a senha");
      }

      setSuccessMessage(data.message || "Senha redefinida com sucesso!");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Se tiver mensagem de sucesso, escondemos o formulário */}
      {successMessage ? (
        <div className="text-center">
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
            {successMessage}
          </div>
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Ir para o Login
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="codigo"
              className="block text-sm font-medium text-gray-700"
            >
              Código de Verificação
            </label>
            <div className="mt-1">
              <input
                id="codigo"
                name="codigo"
                type="text"
                required
                readOnly // Trocado de disabled para readOnly, para que o valor seja enviado
                value={codigo}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
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
                readOnly // Trocado de disabled para readOnly
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                maxLength={256}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Nova Senha (6 ou mais caracteres)
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
                placeholder="Informe a nova senha"
                maxLength={20}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmação de Senha
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
                placeholder="Confirme a nova senha"
                maxLength={20}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
            >
              {isLoading ? <Spinner /> : "Redefinir senha"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function EditPasswordPage() {
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
              Redefinição de senha
            </h2>
            <h4 className="mt-6 text-md font-bold text-gray-900">
              Website de apoio à ONGs e Projetos Sociais
            </h4>
          </div>

          <Suspense fallback={<div>Carregando...</div>}>
            <EditPasswordForm />
          </Suspense>

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

      <Footer />
    </div>
  );
}

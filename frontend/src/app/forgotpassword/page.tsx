"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsButtonDisabled(false);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Por favor, preencha o campo de email");
      return;
    }

    setIsLoading(true);
    setIsButtonDisabled(true);

    try {
      const response = await fetch("/api/forgot-password/send-email", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar o e-mail");
      }

      // Sucesso! A API cuidou de tudo.
      setSuccessMessage(
        data.message || "E-mail de redefinição enviado com sucesso!"
      );
      setCountdown(30);
      setEmail("");
    } catch (error: any) {
      setError(error.message);
      setIsButtonDisabled(false);
    } finally {
      setIsLoading(false);
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
              Redefinição de senha
            </h2>
            <h4 className="mt-6 text-md font-bold text-gray-900">
              Website de apoio à ONGs e Projetos Sociais
            </h4>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                {successMessage}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    placeholder="Informe seu email"
                    maxLength={256}
                    disabled={isLoading || isButtonDisabled}
                  />
                </div>
              </div>

              <div>
                <button
                  id="submit"
                  type="submit"
                  disabled={isButtonDisabled || isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white
                    ${
                      isButtonDisabled || isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }`}
                >
                  {isLoading ? (
                    <Spinner />
                  ) : isButtonDisabled ? (
                    `Tente novamente em ${countdown}s`
                  ) : (
                    "Enviar código de redefinição"
                  )}
                </button>
              </div>
            </form>
          </div>

          {isButtonDisabled && !isLoading && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Email não chegou? Tente novamente em {countdown} segundos...
            </div>
          )}

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

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Novo por aqui?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white py-6 px-4">
            <div className="container mx-auto">
                <div className="flex flex-wrap justify-center text-xs text-gray-500 gap-x-4 gap-y-2">
                    <Link href="/about" className="hover:text-blue-600">
                    Sobre
                    </Link>
                    <Link href="/privacy-policy" className="hover:text-blue-600">
                    Política de Privacidade
                    </Link>
                    <Link href="/terms-of-use" className="hover:text-blue-600">
                    Termos de Uso
                    </Link>
                    <Link href="/contact" className="hover:text-blue-600">
                    Contato
                    </Link>
                    <Link href="/credits" className="hover:text-blue-600">
                    Créditos
                    </Link>
                </div>
                <div className="text-center mt-4 text-xs text-gray-500">
                    <p>Colabora © {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    )
}

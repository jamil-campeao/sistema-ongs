import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { UserProvider } from "@/context/userContext"
import { OngProvider } from "@/context/ongContext"

export const metadata: Metadata = {
  title: "Colabora",
  description: "Website de apoio à ONGs e Projetos Sociais",
    generator: ''
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <UserProvider>
          <OngProvider>
          {children}
          </OngProvider>
        </UserProvider>
      </body>
    </html>
  )
}

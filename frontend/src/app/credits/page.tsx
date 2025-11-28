"use client"

import Link from "next/link"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Linkedin, Instagram, Heart } from "lucide-react"
import imageGleison from "../static/gleison.jpeg"

export default function CreditsPage() {
  const contributors = [
    {
      name: "Lenon Antonio Corrêa",
      role: "Frontend Architect & Backend Support",
      description: "Arquitetou e desenvolveu o frontend do Colabora, responsável pelas telas bonitas e intuitivas. Deu apoio fundamental no backend e infraestrutura.",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQFhYl5wxLfGcg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1664303760496?e=1766016000&v=beta&t=HwP0akPHqJ3KZDHVwMRaesfC1oKqN4HacW15o8JoBrk",
      socials: {
        linkedin: "https://www.linkedin.com/in/lenon-corr%C3%AAa-108825186/",
        github: "https://github.com/correalenon",
      }
    },
    {
      name: "Manoela Griep Berwaldt",
      role: "Software Engineer & UI/UX",
      description: "Fundamental no desenvolvimento do frontend, engenharia de software, planejamento, regras de negócio e na experiência do usuário (UI/UX).",
      image: "https://avatars.githubusercontent.com/u/100965384?v=4",
      socials: {
        linkedin: "https://www.linkedin.com/in/manoela-berwaldt-4588761b2/",
        github: "https://github.com/ManoGBw",
        instagram: "https://www.instagram.com/mano_berw/"
      }
    },
    {
      name: "Gleison Sousa Santos",
      role: "QA & Validation",
      description: "Responsável pela validação rigorosa e testes do sistema, garantindo a qualidade e estabilidade da plataforma.",
      image: imageGleison.src,
      socials: {
        instagram: "https://www.instagram.com/03sousag/"
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="text-center py-12 bg-white shadow-sm">
        <Link href="/">
            <img src="/logo.png" alt="Logo Colabora" className="w-24 h-24 mx-auto mb-4 hover:opacity-90 transition-opacity cursor-pointer" />
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 font-[Montserrat] mb-2">Créditos</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Conheça as pessoas incríveis que tornaram o <span className="font-bold text-blue-600">Colabora</span> realidade.
        </p>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12">
        
        {/* Featured Section - Jamil */}
        <section className="mb-16 flex justify-center">
          <Card className="w-full max-w-4xl bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center p-8 gap-8">
              <div className="flex-shrink-0">
                <Avatar className="w-48 h-48 border-4 border-white shadow-xl">
                  <AvatarImage src="https://media.licdn.com/dms/image/v2/D4D03AQFPcZHjwnyaUA/profile-displayphoto-shrink_400_400/B4DZPvdRP3GgAg-/0/1734889249436?e=1766016000&v=beta&t=j4Olouw-Pe9zS30wDCL00-UR20pBcJTz-C9o-CO3Vgo" alt="Jamil Luiz da Silva Campeão" />
                  <AvatarFallback className="text-4xl">JC</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h2 className="text-3xl font-bold text-gray-900">Jamil Luiz da Silva Campeão</h2>
                </div>
                <p className="text-blue-600 font-semibold text-lg mb-4">Idealizador & Lead Developer</p>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  O grande responsável pelo projeto. Liderou a visão técnica e de produto, coordenando esforços e garantindo que o Colabora se tornasse uma plataforma robusta e impactante para a comunidade.
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                  <a href="https://github.com/jamil-campeao" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-700">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="https://www.linkedin.com/in/jamilcampeao/" target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors text-blue-700">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="https://www.instagram.com/_jam1l/" target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-100 rounded-full hover:bg-pink-200 transition-colors text-pink-600">
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Contributors Grid */}
        <section>
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-10 relative">
            <span className="bg-gray-50 px-4 relative z-10">Time de Desenvolvimento</span>
            <span className="absolute top-1/2 left-0 w-full h-px bg-gray-200 -z-0"></span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {contributors.map((person, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-gray-100 flex flex-col h-full">
                <CardHeader className="flex flex-col items-center pb-2">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-md mb-4">
                    <AvatarImage src={person.image} alt={person.name} />
                    <AvatarFallback>{person.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl text-center">{person.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium text-center">{person.role}</CardDescription>
                </CardHeader>
                <CardContent className="text-center flex-grow flex flex-col justify-between">
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {person.description}
                  </p>
                  <div className="flex justify-center gap-3 mt-auto pt-4 border-t border-gray-100">
                    {person.socials.github && (
                        <a href={person.socials.github} className="text-gray-500 hover:text-gray-900 transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                    )}
                    {person.socials.linkedin && (
                        <a href={person.socials.linkedin} className="text-gray-500 hover:text-blue-700 transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    )}
                    {person.socials.instagram && (
                        <a href={person.socials.instagram} className="text-gray-500 hover:text-pink-600 transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="text-center mt-16 text-gray-400 text-sm">
            <p>Feito com <Heart className="inline w-4 h-4 text-red-400 fill-red-400 mx-1" /> pela equipe Colabora</p>
        </div>

      </main>
      <Footer />
    </div>
  )
}

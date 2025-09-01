export interface User {
  id: number
  name: string
  location: string
  profileImage: string
  role?: string
}

export interface Comment {
  id: number
  description: string
  createdAt: string
  user?: User
  ong?: Ong
}

export interface Like {
  id: number
  user?: User
  ong? : Ong
}

export interface Image {
  id: number
  content: string
  caption: string
}

export interface Post {
  id: number
  description: string
  createdAt: string
  user?: User
  likes: Like[]
  comments: Comment[]
  images: Image[]
  userLiked: boolean
  ong?: Ong
}

export interface Ong {
    id: number
    nameONG: string
    socialName: string
    emailONG: string
    cnpj: string
    foundationDate: string
    area: string
    goals: string
    cep: string
    street: string
    number: string
    complement: string
    city: string
    district: string
    state: string
    nameLegalGuardian: string
    contact: string
    description: string
    createdAt: string
    updatedAt: string
    socialMedia: string
    profileImage: string
    coverImage: string
    cellphone: string
    role?: string
}

export interface Project {
    id: number
    name: string
    description: string
    createdAt: string
    updatedAt: string
    coverImage: string
    ongId: number
    projectImage: string
    complementImages: string[]
    contributionProject: string
    additionalInfo: string 
    ong: Ong[]
}

"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type User = {
  id: number
  name: string
  email: string
  profileImage?: string
  coverImage?: string
  role?: string
  ong?: ONGUser
}

type ONGUser = {
  id: number
  nameONG: string
  emailONG: string
}

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser !== null) {
      setUserState(JSON.parse(storedUser))
    }
  }, [])

  const setUser = (user: User | null) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
    setUserState(user)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
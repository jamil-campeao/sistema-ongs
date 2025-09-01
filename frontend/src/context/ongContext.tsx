"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ONG = {
  id: number;
  nameONG: string;
  socialName: string;
  emailONG: string;
  profileImage?: string;
  coverImage?: string;
  role?: string;
};

type OngContextType = {
  ong: ONG | null;
  setOng: (ong: ONG | null) => void;
  logoutOng: () => void;
};

const OngContext = createContext<OngContextType>({
  ong: null,
  setOng: () => {},
  logoutOng: () => {},
});

export const OngProvider = ({ children }: { children: ReactNode }) => {
  const [ong, setOngState] = useState<ONG | null>(null);

  useEffect(() => {
    const storedOng = localStorage.getItem("ong");
    if (storedOng !== null) {
      setOngState(JSON.parse(storedOng));
    }
  }, []);

  const setOng = (ong: ONG | null) => {
    if (ong) {
      localStorage.setItem("ong", JSON.stringify(ong));
    } else {
      localStorage.removeItem("ong");
    }
    setOngState(ong);
  };

  const logoutOng = () => {
    setOng(null); 
  };

  return (
    <OngContext.Provider value={{ ong, setOng, logoutOng }}>
      {children}
    </OngContext.Provider>
  );
};

export const useOng = () => useContext(OngContext);
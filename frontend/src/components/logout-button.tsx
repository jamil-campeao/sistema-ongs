"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/context/userContext";
import { useOng } from "@/context/ongContext";

export default function LogoutButton() {
  const router = useRouter()
  const { user, logout } = useUser();
  const { logoutOng } = useOng();

  const handleLogout = async () => {
    if (user) {
      logout();
    }
    else {
      logoutOng();
    }
    
    
    const response = await fetch('/api/logout', {
      method: 'POST',
    });
    if (!response.ok) {
      return
    }
    router.push("/login")
  }

  return (
    <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
      Logout
    </button>
  )
}

// hooks/useAuth.ts
import { useState, useEffect } from "react"

import { authService } from "../services/auth.service"
import type { Profile } from "@/types/profile"
import { ProfileService } from "@/services/Profile.service"

export const useAuth = () => {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

 
  const fetchUser = async () => {
    setLoading(true)
    try {
      const profile: Profile = await ProfileService.getProfile()
      setUser(profile)
  
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile")
    } finally {
      setLoading(false)
    }
  }


  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await authService.login({ email, password })
      if (!data.success || !data.token || !data.refreshToken) {
        throw new Error(data.message || "Login failed")
      }
      localStorage.setItem("token", data.token)
      localStorage.setItem("refreshToken", data.refreshToken)
      await fetchUser() // populate user state after login
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    setUser(null)
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchUser()
    }
  }, [])

  return { user, loading, error, login, logout, refresh: fetchUser }
}

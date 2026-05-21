import { defineStore } from "pinia"
import { api } from "../utils/api"
import { useSocket } from "./socket"

export const useAuth = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  }),

  actions: {
    async checkCredentials(username, password) {
      try {
        const response = await api.post("/api/auth/login", {
          username,
          password,
        })

        if (response.data?.success && response.data?.accessToken) {
          this.token = response.data.accessToken
          this.refreshToken = response.data.refreshToken
          this.isAuthenticated = true

          localStorage.setItem("token", response.data.accessToken)
          localStorage.setItem("refreshToken", response.data.refreshToken)

          const socket = useSocket()
          socket.connect()

          return ""
        }

        this.clearAuth()

        return response.data?.message || "Autentificare eșuată."
      } catch (error) {
        console.error("Login error:", error)

        this.clearAuth()

        return "A apărut o eroare. Încearcă din nou."
      }
    },

    logout() {
      const socket = useSocket()
      socket.disconnect()
      this.clearAuth()
    },

    clearAuth() {
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false

      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
    },
  },
})

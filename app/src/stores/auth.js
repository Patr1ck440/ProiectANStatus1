import { defineStore } from "pinia"
import axios from "axios"

export const useAuth = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  }),

  actions: {
    async checkCredentials(username, password) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          username,
          password,
        })

        if (response.data?.success && response.data?.token) {
          this.token = response.data.token
          this.isAuthenticated = true

          localStorage.setItem("token", response.data.token)

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
      this.clearAuth()
    },

    clearAuth() {
      this.token = null
      this.isAuthenticated = false

      localStorage.removeItem("token")
    },
  },
})
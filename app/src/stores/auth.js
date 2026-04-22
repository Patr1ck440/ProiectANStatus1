// stores/auth.js (Pinia)
import { defineStore } from "pinia"

export const useAuth = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null
  }),
  actions: {
    login(username, password) {
      if (this.checkCredentials(username, password)) {
        this.isAuthenticated = true
        this.user = { name: username } // opțional
        return true
      }
      return false
    },
    logout() {
      this.isAuthenticated = false
      this.user = null
    },
    checkCredentials(username, password) {
      // logica ta de verificare
      return username === "admin" && password === "admin"
    }
  }
})

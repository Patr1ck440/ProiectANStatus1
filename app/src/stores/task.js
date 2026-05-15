import { defineStore } from "pinia"
import axios from "axios"

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),

  actions: {
    authHeaders() {
      const token = localStorage.getItem("token")

      if (!token) {
        return {}
      }

      return {
        Authorization: `Bearer ${token}`,
      }
    },

    async getTasks() {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/task/get-all`,
          {
            headers: this.authHeaders(),
          }
        )

        this.tasks = response.data

        return response.data
      } catch (error) {
        console.error("Get tasks error:", error)

        this.error = "Nu s-au putut încărca task-urile."

        return []
      } finally {
        this.loading = false
      }
    },
  },
})
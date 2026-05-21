import { defineStore } from "pinia"
import { api } from "../utils/api"

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
  }),

  actions: {
    async getTasks() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem("token")
        const response = await api.get("/task/get-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

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

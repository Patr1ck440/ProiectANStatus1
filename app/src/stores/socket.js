import { defineStore } from "pinia"
import { io } from "socket.io-client"

let socket = null

export const useSocket = defineStore("socket", {
  state: () => ({
    connected: false,
    notifications: [],
  }),

  actions: {
    connect() {
      if (socket) return

      socket = io(import.meta.env.VITE_API_URL, {
        auth: {
          token: localStorage.getItem("token"),
        },
      })

      socket.on("connect", () => {
        console.log("WebSocket connected")
        this.connected = true
      })

      socket.on("disconnect", () => {
        console.log("WebSocket disconnected")
        this.connected = false
      })

      socket.on("task:updated", (data) => {
        this.addNotification("Task updated", "info")
      })

      socket.on("task:changed", (data) => {
        this.addNotification("Task changed", "info")
      })

      socket.on("task:removed", (data) => {
        this.addNotification("Task removed", "warning")
      })
    },

    disconnect() {
      if (socket) {
        socket.disconnect()
        socket = null
        this.connected = false
      }
    },

    emitTaskCreated(data) {
      if (socket) socket.emit("task:created", data)
    },

    emitTaskUpdated(data) {
      if (socket) socket.emit("task:updated", data)
    },

    emitTaskDeleted(data) {
      if (socket) socket.emit("task:deleted", data)
    },

    addNotification(message, type = "info") {
      this.notifications.push({
        id: Date.now(),
        message,
        type,
      })

      setTimeout(() => {
        this.notifications = this.notifications.filter((n) => n.id !== id)
      }, 3000)
    },

    clearNotifications() {
      this.notifications = []
    },
  },
})

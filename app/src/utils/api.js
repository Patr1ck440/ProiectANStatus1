import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem("refreshToken")

      if (refreshToken) {
        try {
          const response = await api.post("/api/auth/refresh", { refreshToken })
          if (response.data.success) {
            localStorage.setItem("token", response.data.accessToken)
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
            return api(originalRequest)
          }
        } catch {
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  }
)

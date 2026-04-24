import { fileURLToPath, URL } from "node:url"
import { VitePWA } from "vite-plugin-pwa"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"

// https://vite.dev/config/
export default defineConfig({
  //base: "/ProiectANStatus1/",
  server: {
    host: true, // ascultă pe 0.0.0.0
    port: 5173
  },

  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: "autoUpdate",
     devOptions: {
       enabled: true
      },

      manifest: {
        theme_color: "#169bcb",
        icons: [
          {
            src: "icons/therock.png",
            sizes: "192x192",
            type: "image/png"
          }
        ]
      }
    })
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
})

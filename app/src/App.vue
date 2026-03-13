<script setup>
import { useAuth } from "@/stores/auth"
import { onMounted, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useSettingsStore } from "./stores/settingsStore"
import { useUserStore } from "./stores/userStore"
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"

const auth = useAuth()
const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

// Navigare
const navigateToAbout = () => router.push("/despre")
const navigateToExercises = () => router.push("/")
const navigateToChapters = () => router.push("/capitole")
const navigateToProfile = () => router.push("/profil")
const navigateToSettings = () => router.push("/setari")

watch(
  () => settingsStore.settings.fontFamily,
  font => {
    document.documentElement.style.fontFamily = font
  },
  { immediate: true }
)

onMounted(() => {
  settingsStore.loadSettings()

  if (!auth.isAuthenticated && route.path !== "/login") {
    router.push("/login")
  }

  if (!userStore.isUserAuthenticated) {
    userStore.login({
      name: "Utilizator EduBac",
      email: "utilizator@edubac.ro",
      level: 1,
      points: 0,
      joinDate: new Date().toISOString().split("T")[0]
    })
  }

  userStore.updateStreak()
})

// Determină dacă Header/Footer să fie afișat
const showHeaderFooter = route.path !== "/login"
</script>

<template>
  <Header
    v-if="auth.isAuthenticated && showHeaderFooter"
    :title="'EduBac'"
    class="bg-gray-200 p-4"
    @about="navigateToAbout"
    @exercitii="navigateToExercises"
    @rezultate="navigateToChapters"
    @profile="navigateToProfile"
    @setari="navigateToSettings"
  />

  <main
    :class="[
      'min-h-[70vh] transition-colors',
      showHeaderFooter ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-900'
    ]"
    class="p-6"
  >
    <RouterView />
  </main>

  <Footer
    v-if="showHeaderFooter"
    class="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  />
</template>

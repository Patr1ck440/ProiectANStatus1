<script setup>
import { computed, onMounted, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useAuth } from "@/stores/auth"
import { useSettingsStore } from "./stores/settingsStore"
import { useUserStore } from "./stores/userStore"
import { useChapterStore } from "./stores/chapterStore"
import { useQuizStore } from "./stores/quizStore"
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"

const auth = useAuth()
const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const chapterStore = useChapterStore()
const quizStore = useQuizStore()

// Navigare
const navigateToAbout = () => router.push("/despre")
const navigateToExercises = () => router.push("/")
const navigateToChapters = () => router.push("/capitole")
const navigateToProfile = () => router.push("/profil")
const navigateToSettings = () => router.push("/setari")

// Font settings
watch(
  () => settingsStore.settings.fontFamily,
  font => {
    document.documentElement.style.fontFamily = font
  },
  { immediate: true }
)

// Load settings & user
onMounted(async () => {
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

  try {
    await chapterStore.fetchChaptersFromDB()
    await quizStore.fetchQuizzesFromDB()
    console.log("Date încărcate din DB ✅")
  } catch (err) {
    console.error("Eroare la încărcarea datelor din DB:", err)
  }
})

// Reactive display of header/footer
const showHeaderFooter = computed(() => route.path !== "/login" && auth.isAuthenticated)
</script>

<template>
  <Header
    v-if="showHeaderFooter"
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
      'min-h-[70vh] p-6 transition-colors',
      showHeaderFooter ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-900'
    ]"
  >
    <RouterView />
  </main>

  <Footer class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
</template>
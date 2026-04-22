<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from './stores/settingsStore'
import { useUserStore } from './stores/userStore'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const router = useRouter()
const settingsStore = useSettingsStore()
const userStore = useUserStore()


watch(
  () => settingsStore.settings.fontFamily,
  (font) => {
    document.documentElement.style.setProperty(
      'font-family',
      font,
      'important'
    )
  },
  { immediate: true }
)

onMounted(() => {
  settingsStore.loadSettings()

  if (!userStore.isUserAuthenticated) {
    userStore.login({
      name: 'Utilizator EduBac',
      email: 'utilizator@edubac.ro',
      level: 1,
      points: 0,
      joinDate: new Date().toISOString().split('T')[0]
    })
  }

  userStore.updateStreak()
})

// navigare
const navigateToAbout = () => router.push('/despre')
const navigateToExercises = () => router.push('/')
const navigateToChapters = () => router.push('/capitole')
const navigateToProfile = () => router.push('/profil')
const navigateToSettings = () => router.push('/setari')
</script>

<template>
  <Header
    title="EduBac"
    @about="navigateToAbout"
    @exercitii="navigateToExercises"
    @rezultate="navigateToChapters"
    @profile="navigateToProfile"
    @setari="navigateToSettings"
  />

  <main class="min-h-[70vh] p-6 bg-white dark:bg-gray-800 transition-colors">
    <RouterView />
  </main>

  <Footer class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
 </template>

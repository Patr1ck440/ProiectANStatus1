<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { useAuth } from '../stores/auth'

const auth = useAuth()
const router = useRouter()
const username = ref("")
const password = ref("")
const message = ref("")

const authentification = async () => {
  const isAuth = await auth.checkCredentials(username.value, password.value)
  message.value = isAuth
  if (!isAuth) {
    router.push("/")
  }
}
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-100">
    <div class="w-96 rounded-lg bg-white p-8 shadow-lg">
      <h1 class="mb-6 text-center text-3xl font-bold">Login</h1>

      <form @submit.prevent="authentification" class="space-y-4">
        <input v-model="username" placeholder="Username" class="w-full border p-2" />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border p-2"
        />

        <button class="w-full rounded bg-blue-500 py-2 text-white">Login</button>
      </form>

      <p v-if="message" class="mt-4 text-red-500">{{ message }}</p>
    </div>
  </div>
</template>

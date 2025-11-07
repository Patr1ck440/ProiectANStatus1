<template>
  <button @click="$emit('toggle-theme')" class="theme-toggle">
    {{ isDark ? '🌙 Dark' : '☀️ Light' }}
  </button>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
const props = defineProps({
  isDark: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.theme-toggle {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background-color: darkcyan;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.theme-toggle:hover {
  background-color: #009999;
}

.theme-toggle:active {
  background-color: #008080;
}
</style>

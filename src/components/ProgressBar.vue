<template>
  <div class="progress-wrapper">
    <div class="progress-info">
      <span>Întrebarea {{ current + 1 }} din {{ total }}</span>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const progressPercent = computed(() =>
  props.total > 0 ? ((props.current + 1) / props.total) * 100 : 0
)
</script>

<style scoped>
.progress-wrapper {
  width: 100%;
  max-width: 600px;
  margin: 10px auto 20px auto;
}

.progress-info {
  text-align: center;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.progress-bar {
  height: 12px;
  width: 100%;
  background-color: #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: darkcyan;
  transition: width 0.4s ease;
}
</style>

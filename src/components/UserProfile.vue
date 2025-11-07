<template>
  <div class="user-profile">
    <img v-if="avatar" :src="avatar" alt="Avatar" class="avatar" />
    <div class="info">
      <h3>{{ name }}</h3>
      <p>Capitole completate: {{ chaptersCompleted }} / {{ totalChapters }}</p>
      <p>Răspunsuri corecte: {{ correctAnswers }} / {{ totalAnswers }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    default: 'Student'
  },
  avatar: {
    type: String,
    default: '' // poți pune link default la un avatar
  },
  chaptersCompleted: {
    type: Number,
    default: 0
  },
  totalChapters: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalAnswers: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #f0f4f8;
  padding: 16px;
  border-radius: 12px;
  max-width: 500px;
  margin: 20px auto;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid darkcyan;
}

.info h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #222;
}

.info p {
  margin: 2px 0;
  font-size: 0.95rem;
  color: #555;
}
</style>

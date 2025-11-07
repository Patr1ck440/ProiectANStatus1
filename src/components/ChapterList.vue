<template>
  <div class="chapter-list">
    <h3>Capitole disponibile:</h3>
    <ul>
      <li v-for="(chapter, index) in chapters" :key="index">
        <button @click="$emit('select-chapter', index)">
          {{ chapter.title }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  chapters: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.chapter-list {
  margin: 20px auto;
  max-width: 500px;
  text-align: center;
}

.chapter-list ul {
  list-style: none;
  padding: 0;
}

.chapter-list li {
  margin: 10px 0;
}

.chapter-list button {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  background-color: darkcyan;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.chapter-list button:hover {
  background-color: #009999;
}

.chapter-list button:active {
  background-color: #008080;
}
</style>

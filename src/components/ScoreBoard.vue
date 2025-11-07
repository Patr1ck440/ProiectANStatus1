<template>
  <div class="scoreboard">
    <h3>Rezultatele tale</h3>
    <div class="scores">
      <p class="correct">Corecte: {{ correct }}</p>
      <p class="wrong">Greșite: {{ wrong }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  correct: Number,
  wrong: Number
})
</script>

<style scoped>
.scoreboard {
  background: #f4f6f8;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #ddd;
  max-width: 400px;
  margin: 10px auto;
}

.scores {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.correct {
  color: #2e8b57;
  font-weight: bold;
}

.wrong {
  color: #c0392b;
  font-weight: bold;
}
</style>

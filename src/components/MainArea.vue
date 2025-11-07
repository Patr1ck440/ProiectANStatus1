<template>
  <div class="main-area">

    <!-- AlertBox pentru mesaje -->
    <AlertBox v-if="alertMessage" :message="alertMessage" :type="alertType" />

    <!-- User Profile -->
    <UserProfile
      name="Patrick Pușcaș"
      avatar="https://i.pravatar.cc/70"
      :chaptersCompleted="currentChapterIndex"
      :totalChapters="chapters.length"
      :correctAnswers="correctCount"
      :totalAnswers="userAnswers.length"
    />

    <!-- Theme Toggle -->
    <ThemeToggle :isDark="isDark" @toggle-theme="handleToggleTheme" />

    <!-- Chapter List (doar dacă nu am început capitolul) -->
    <ChapterList 
      v-if="!chapterStarted" 
      :chapters="chapters" 
      @select-chapter="selectChapter"
    />

    <!-- Main Quiz -->
    <div v-if="chapterStarted && !chapterFinished">
      <ChapterTitle :title="currentChapter.title" />
      <ProgressBar :current="currentQuestionIndex" :total="totalQuestions" />
      <QuestionDisplay :question="currentQuestion?.question" />
      <AnswerInput @send-answer="submitAnswer" />
      <FeedbackMessage v-if="feedback" :message="feedback" :status="feedbackStatus" />
      <button v-if="feedback" @click="nextQuestion" class="next-btn">Următoarea întrebare</button>
    </div>

    <!-- Rezumat capitol -->
    <div v-if="chapterFinished" class="chapter-end">
      <ScoreBoard :correct="correctCount" :wrong="incorrectAnswers.length" />
      <ChapterControls
        @restart="restartChapter"
        @show-incorrect="showIncorrect"
        @next="nextChapter"
      />
      <IncorrectAnswers v-if="showIncorrectList && incorrectAnswers.length" :answers="incorrectAnswers" />
      <div v-if="showIncorrectList && !incorrectAnswers.length" class="no-incorrect">
        <p>Nu ai răspuns greșit la nicio întrebare. 🎉</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import ChapterList from './ChapterList.vue'


import ChapterTitle from './ChapterTitle.vue'
import ProgressBar from './ProgressBar.vue'
import QuestionDisplay from './QuestionDisplay.vue'
import AnswerInput from './AnswerInput.vue'
import FeedbackMessage from './FeedbackMessage.vue'
import ChapterControls from './ChapterControls.vue'
import IncorrectAnswers from './IncorrectAnswers.vue'
import ScoreBoard from './ScoreBoard.vue'

// ===== State =====
const isDark = ref(false)
const chapters = [
  { title: 'Capitolul 1: Variabile', questions: [
    { question: "Ce este o variabilă?", answer: "un spațiu de stocare" },
    { question: "Ce tip de variabilă stochează numere întregi?", answer: "integer" }
  ]},
  { title: 'Capitolul 2: Bucla for', questions: [
    { question: "Cum începe o buclă for în C++?", answer: "for(" },
    { question: "Ce face break?", answer: "oprește bucla" }
  ]}
]

const currentChapterIndex = ref(0)
const currentQuestionIndex = ref(0)
const userAnswers = ref([])
const feedback = ref('')
const feedbackStatus = ref('')
const showIncorrectList = ref(false)
const alertMessage = ref('')
const alertType = ref('info')

// ===== Computed =====
const chapterStarted = computed(() => currentQuestionIndex.value >= 0)
const currentChapter = computed(() => chapters[currentChapterIndex.value])
const totalQuestions = computed(() => currentChapter.value.questions.length)
const currentQuestion = computed(() => {
  if(currentQuestionIndex.value >= currentChapter.value.questions.length) return undefined
  return currentChapter.value.questions[currentQuestionIndex.value]
})
const chapterFinished = computed(() => currentQuestionIndex.value >= currentChapter.value.questions.length)
const incorrectAnswers = computed(() => userAnswers.value.filter(a => !a.correct))
const correctCount = computed(() => userAnswers.value.filter(a => a.correct).length)

// ===== Funcții =====
function handleToggleTheme() {
  isDark.value = !isDark.value
}

function submitAnswer(answer) {
  if(!currentQuestion.value) return
  if(feedback.value) return

  const correct = answer.trim().toLowerCase() === currentQuestion.value.answer.trim().toLowerCase()
  feedback.value = correct ? 'Corect! ✅' : `Greșit ❌ Răspuns corect: ${currentQuestion.value.answer}`
  feedbackStatus.value = correct ? 'correct' : 'wrong'

  userAnswers.value.push({
    question: currentQuestion.value.question,
    userAnswer: answer,
    correct
  })
}

function nextQuestion() {
  feedback.value = ''
  feedbackStatus.value = ''
  if(currentQuestionIndex.value < currentChapter.value.questions.length) {
    currentQuestionIndex.value++
  }
}

function selectChapter(index) {
  currentChapterIndex.value = index
  currentQuestionIndex.value = 0
  userAnswers.value = []
  showIncorrectList.value = false
}

function restartChapter() {
  currentQuestionIndex.value = 0
  feedback.value = ''
  feedbackStatus.value = ''
  userAnswers.value = []
  showIncorrectList.value = false
}

function showIncorrect() {
  showIncorrectList.value = true
}

function nextChapter() {
  if(currentChapterIndex.value < chapters.length - 1) {
    currentChapterIndex.value++
    restartChapter()
  } else {
    alertMessage.value = 'Ai terminat toate capitolele!'
    alertType.value = 'success'
  }
}
</script>

<style scoped>
.main-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.next-btn {
  align-self: flex-end;
  background-color: darkcyan;
  color: white;
  border: none;
  padding: 10px 18px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.next-btn:hover { background-color: #009999; transform: translateY(-1px); }
.next-btn:active { background-color: #008080; transform: translateY(0); }

.chapter-end { text-align: center; padding: 12px; border-radius: 10px; background: #eef6f6; color: #033; }
.no-incorrect { text-align: center; margin-top: 8px; color: #155724; }
</style>

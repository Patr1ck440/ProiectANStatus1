

<template>
  <div class="main-area">
    <AlertBox v-if="alertMessage" :message="alertMessage" :type="alertType" />

    <ThemeToggle :isDark="isDark" @toggle-theme="handleToggleTheme" />

    <ChapterList 
      v-if="!chapterStarted" 
      :chapters="chapters" 
      @select-chapter="selectChapter"
    />

    <div v-if="chapterStarted && !chapterFinished">
      <ChapterTitle :title="currentQuiz?.title" />
      <ProgressBar 
        :current="currentQuestionIndex + 1" 
        :total="totalQuestions" 
      />
      <QuestionDisplay :question="currentQuestion?.question" />
      <AnswerInput @send-answer="submitAnswer" />
      <FeedbackMessage 
        v-if="feedback" 
        :message="feedback" 
        :status="feedbackStatus" 
      />
      <button 
        v-if="feedback && currentQuestionIndex < totalQuestions - 1" 
        @click="nextQuestion" 
        class="next-btn"
      >
        Următoarea întrebare
      </button>
      <button 
        v-if="feedback && currentQuestionIndex === totalQuestions - 1" 
        @click="finishQuiz" 
        class="finish-btn"
      >
        Termină quiz-ul
      </button>
    </div>

    <div v-if="chapterFinished" class="chapter-end">
      <ScoreBoard 
        :correct="correctCount" 
        :wrong="incorrectAnswers.length" 
        :score="quizStore.score"
      />
      <ChapterControls
        @restart="restartChapter"
        @show-incorrect="showIncorrect"
        @next="nextChapter"
      />
      <IncorrectAnswers 
        v-if="showIncorrectList && incorrectAnswers.length" 
        :answers="incorrectAnswers" 
      />
      <div v-if="showIncorrectList && !incorrectAnswers.length" class="no-incorrect">
        <p>Nu ai răspuns greșit la nicio întrebare. 🎉</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'


// componente
import AlertBox from '@/components/AlertBox.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import ChapterList from '@/components/ChapterList.vue'
import ChapterTitle from '@/components/ChapterTitle.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import QuestionDisplay from '@/components/QuestionDisplay.vue'
import AnswerInput from '@/components/AnswerInput.vue'
import FeedbackMessage from '@/components/FeedbackMessage.vue'
import ChapterControls from '@/components/ChapterControls.vue'
import IncorrectAnswers from '@/components/IncorrectAnswers.vue'
import ScoreBoard from '@/components/ScoreBoard.vue'

import { useQuizStore } from '../stores/quizStore'
import { useUserStore } from '../stores/userStore'  // ← adaugă asta

const quizStore = useQuizStore()
const userStore = useUserStore()  // ← adaugă asta

// Local state
const isDark = ref(false)
const showIncorrectList = ref(false)
const alertMessage = ref('')
const alertType = ref('info')
const feedback = ref('')
const feedbackStatus = ref('')

// ===== COMPUTED PROPERTIES =====
const chapters = computed(() => quizStore.getAllQuizzes)
const currentQuiz = computed(() => quizStore.getCurrentQuiz)
const currentQuestion = computed(() => quizStore.getCurrentQuestion)

const currentQuestionIndex = computed(() => quizStore.currentQuestionIndex)
const totalQuestions = computed(() => 
  currentQuiz.value?.questions?.length || 0
)

const chapterStarted = computed(() => quizStore.quizStarted)
const chapterFinished = computed(() => quizStore.quizCompleted)


const incorrectAnswers = computed(() =>
  quizStore.userAnswers.filter(a => !a.correct)
)
const correctCount = computed(() =>
  quizStore.userAnswers.filter(a => a.correct).length
)

// ===== METHODS =====
function handleToggleTheme() {
  isDark.value = !isDark.value
}

function selectChapter(index) {
  const quiz = chapters.value[index]
  if (quiz) {
    quizStore.startQuiz(quiz.id)
  }
}

function submitAnswer(answer) {
  if (!answer.trim()) return
  
  const isCorrect = quizStore.submitAnswer(answer)
  feedback.value = isCorrect ? 'Corect! ✅' : `Greșit ❌ Răspuns corect: ${currentQuestion.value.answer}`
  feedbackStatus.value = isCorrect ? 'correct' : 'wrong'
}

function nextQuestion() {
  quizStore.nextQuestion()
  feedback.value = ''
  feedbackStatus.value = ''
}

function finishQuiz() {
  quizStore.nextQuestion()
  
  // Adaugă puncte utilizatorului
  if (quizStore.quizCompleted) {
    const pointsEarned = Math.floor(quizStore.score / 10) // Sau altă formulă
    userStore.addPoints(pointsEarned)
    
    // Adaugă badge dacă e cazul
    if (quizStore.score === 100) {
      userStore.addBadge('perfect-score')
    }
  }
}

function restartChapter() {
  quizStore.resetQuiz()
  showIncorrectList.value = false
  feedback.value = ''
  feedbackStatus.value = ''
}

function showIncorrect() {
  showIncorrectList.value = true
}

function nextChapter() {
  quizStore.resetQuiz()
  showIncorrectList.value = false
  feedback.value = ''
  feedbackStatus.value = ''
  
  if (currentQuiz.value) {
    const currentIndex = chapters.value.findIndex(q => q.id === currentQuiz.value.id)
    if (currentIndex < chapters.value.length - 1) {
      selectChapter(currentIndex + 1)
    } else {
      alertMessage.value = 'Ai terminat toate capitolele!'
      alertType.value = 'success'
    }
  }
}
</script>

<style scoped>
.main-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.next-btn, .finish-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.next-btn {
  background-color: #3b82f6;
  color: white;
}

.finish-btn {
  background-color: #10b981;
  color: white;
}

.next-btn:hover {
  background-color: #2563eb;
}

.finish-btn:hover {
  background-color: #059669;
}

.chapter-end {
  text-align: center;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin-top: 2rem;
}

.no-incorrect {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #d1fae5;
  border-radius: 0.375rem;
  color: #065f46;
}
</style>
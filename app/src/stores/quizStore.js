import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { quizApi } from './apiService.js'
import { useUserStore } from './userStore.js' // asigură-te că calea e corectă

export const useQuizStore = defineStore('quiz', () => {
  // State
  const currentQuiz = ref(null)
  const quizzes = ref([
    {
      id: 1,
      title: 'Capitolul 1: Variabile',
      questions: [
        { id: 1, question: 'Ce este o variabilă?', answer: 'un spațiu de stocare' },
        { id: 2, question: 'Ce tip de variabilă stochează numere întregi?', answer: 'integer' }
      ],
      completed: false,
      score: 0,
      chapterId: 1
    },
    {
      id: 2,
      title: 'Capitolul 2: Funcții',
      questions: [
        { id: 3, question: 'Ce este o funcție?', answer: 'un bloc de cod reutilizabil' },
        { id: 4, question: 'Ce returnează o funcție void?', answer: 'nimic' }
      ],
      completed: false,
      score: 0,
      chapterId: 2
    }
  ])

  const currentQuestionIndex = ref(0)
  const userAnswers = ref([])
  const quizTimer = ref(0)
  const quizStarted = ref(false)
  const quizCompleted = ref(false)
  const score = ref(0)

  // Loading / Error
  const loading = ref(false)
  const error = ref(null)

  // User store
  const userStore = useUserStore()
  const getCurrentUserId = () => {
    try {
      return userStore.user?.value?.id ?? userStore.user?.id ?? null
    } catch {
      return null
    }
  }

  // Getters
  const getCurrentQuiz = computed(() => currentQuiz.value)
  const getAllQuizzes = computed(() => quizzes.value)
  const getCompletedQuizzes = computed(() => quizzes.value.filter(quiz => quiz.completed))
  const getIncompleteQuizzes = computed(() => quizzes.value.filter(quiz => !quiz.completed))
  const getQuizCount = computed(() => quizzes.value.length)
  const getCompletedCount = computed(() => quizzes.value.filter(quiz => quiz.completed).length)
  const getProgressPercentage = computed(() => {
    if (quizzes.value.length === 0) return 0
    return (getCompletedCount.value / quizzes.value.length) * 100
  })
  const getAverageScore = computed(() => {
    const completed = quizzes.value.filter(q => q.completed)
    if (completed.length === 0) return 0
    return completed.reduce((sum, q) => sum + q.score, 0) / completed.length
  })
  const getCurrentQuestion = computed(() => {
    if (!currentQuiz.value || !currentQuiz.value.questions) return null
    return currentQuiz.value.questions[currentQuestionIndex.value]
  })
  const getQuizProgress = computed(() => {
    if (!currentQuiz.value || !currentQuiz.value.questions) return 0
    return ((currentQuestionIndex.value + 1) / currentQuiz.value.questions.length) * 100
  })

  // Local actions
  function startQuiz(quizId) {
    const quiz = quizzes.value.find(q => q.id === quizId)
    if (quiz) {
      currentQuiz.value = quiz
      currentQuestionIndex.value = 0
      userAnswers.value = []
      quizStarted.value = true
      quizCompleted.value = false
      score.value = 0
      quizTimer.value = 0
      console.log(`Început quiz: ${quiz.title}`)
    }
  }

  function submitAnswer(answer) {
    if (!currentQuiz.value || !currentQuiz.value.questions) return false

    const currentQuestion = currentQuiz.value.questions[currentQuestionIndex.value]
    const isCorrect = answer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase()

    userAnswers.value.push({
      questionIndex: currentQuestionIndex.value,
      questionId: currentQuestion.id ?? null,
      question: currentQuestion.question,
      userAnswer: answer,
      correct: isCorrect,
      timestamp: Date.now()
    })

    if (isCorrect) score.value += 10

    return isCorrect
  }

  function nextQuestion() {
    if (!currentQuiz.value || !currentQuiz.value.questions) return
    if (currentQuestionIndex.value < currentQuiz.value.questions.length - 1) {
      currentQuestionIndex.value++
    } else {
      finishQuiz()
    }
  }

  function finishQuiz() {
    if (!currentQuiz.value) return
    quizCompleted.value = true
    quizStarted.value = false

    const quizIndex = quizzes.value.findIndex(q => q.id === currentQuiz.value.id)
    if (quizIndex !== -1) {
      quizzes.value[quizIndex].completed = true
      quizzes.value[quizIndex].score = score.value
    }

    console.log(`Quiz terminat! Scor: ${score.value}`)
  }

  function resetQuiz() {
    currentQuiz.value = null
    currentQuestionIndex.value = 0
    userAnswers.value = []
    quizStarted.value = false
    quizCompleted.value = false
    score.value = 0
    console.log('Quiz resetat')
  }

  function addQuiz(quiz) {
    quizzes.value.push({
      id: quizzes.value.length + 1,
      ...quiz,
      completed: false,
      score: 0
    })
    console.log(`Quiz adăugat: ${quiz.title}`)
  }

  function removeQuiz(quizId) {
    quizzes.value = quizzes.value.filter(q => q.id !== quizId)
    console.log(`Quiz eliminat: ID ${quizId}`)
  }

  function updateQuiz(quizId, updates) {
    const index = quizzes.value.findIndex(q => q.id === quizId)
    if (index !== -1) {
      quizzes.value[index] = { ...quizzes.value[index], ...updates }
      console.log(`Quiz actualizat: ${quizzes.value[index].title}`)
    }
  }

  function resetAllQuizzes() {
    quizzes.value.forEach(quiz => {
      quiz.completed = false
      quiz.score = 0
    })
    console.log('Toate quiz-urile resetate')
  }

  function startTimer() {
    quizTimer.value = 0
    const timer = setInterval(() => {
      if (quizStarted.value && !quizCompleted.value) {
        quizTimer.value++
      } else {
        clearInterval(timer)
      }
    }, 1000)
  }

  // ---------------------------------------------------------
  // Backend integration
  // ---------------------------------------------------------
  async function fetchQuizzesFromDB() {
    loading.value = true
    error.value = null
    try {
      const data = await quizApi.getAll()
      // Backend returns attempts by default in your API; keep local quiz definitions intact.
      // If backend exposes quiz definitions, merge them here.
      console.log('Quiz attempts / data preluate din DB:', Array.isArray(data) ? data.length : 0)
      return data
    } catch (err) {
      error.value = err.message || 'Eroare la preluarea quiz-urilor'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchQuizById(id) {
    loading.value = true
    error.value = null
    try {
      const q = await quizApi.getById(id)
      if (q) {
        const idx = quizzes.value.findIndex(x => x.id === q.id)
        if (idx === -1) quizzes.value.push(q)
        else quizzes.value[idx] = { ...quizzes.value[idx], ...q }
        return q
      }
      return null
    } catch (err) {
      error.value = err.message || 'Eroare la preluarea quiz-ului'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function submitAttemptToDB({ userId = null, chapterId = null, score: s = 0, totalQuestions = 0, correctAnswers = 0 } = {}) {
    loading.value = true
    error.value = null
    try {
      const uid = userId ?? getCurrentUserId()
      const payload = { userId: uid, chapterId, score: s, totalQuestions, correctAnswers }
      const attempt = await quizApi.submit(payload)
      console.log('Attempt salvat în DB', attempt?.id ?? attempt)
      return attempt
    } catch (err) {
      error.value = err.message || 'Eroare la salvarea tentativei'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Convenience: calculează și trimite tentativa curentă (folosește userStore)
  async function submitCurrentAttempt() {
    if (!currentQuiz.value) throw new Error('Nu există quiz curent')
    const totalQuestions = currentQuiz.value.questions?.length ?? 0
    const correctAnswers = userAnswers.value.filter(a => a.correct).length
    const chapterId = currentQuiz.value.chapterId ?? null
    const uid = getCurrentUserId()
    return await submitAttemptToDB({
      userId: uid,
      chapterId,
      score: score.value,
      totalQuestions,
      correctAnswers
    })
  }

  async function checkAnswerRemote(questionId, answer) {
    loading.value = true
    error.value = null
    try {
      const res = await quizApi.checkAnswer(questionId, answer)
      return res
    } catch (err) {
      error.value = err.message || 'Eroare la verificarea răspunsului'
      console.error(err)
      return { isCorrect: false, correctAnswer: null }
    } finally {
      loading.value = false
    }
  }

  async function addAwardToDB({ userId = null, title, description, icon }) {
    loading.value = true
    error.value = null
    try {
      const uid = userId ?? getCurrentUserId()
      const award = await quizApi.addAward({ userId: uid, title, description, icon })
      console.log('Award creat', award?.id ?? award)
      return award
    } catch (err) {
      error.value = err.message || 'Eroare la adăugarea premiului'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAttemptToDB(attemptId, { score: s, correctAnswers }) {
    loading.value = true
    error.value = null
    try {
      const updated = await quizApi.updateAttempt(attemptId, { score: s, correctAnswers })
      console.log('Attempt actualizat', updated?.id ?? updated)
      return updated
    } catch (err) {
      error.value = err.message || 'Eroare la actualizarea tentativei'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    currentQuiz,
    quizzes,
    currentQuestionIndex,
    userAnswers,
    quizTimer,
    quizStarted,
    quizCompleted,
    score,
    loading,
    error,
    getCurrentQuiz,
    getAllQuizzes,
    getCompletedQuizzes,
    getIncompleteQuizzes,
    getQuizCount,
    getCompletedCount,
    getProgressPercentage,
    getAverageScore,
    getCurrentQuestion,
    getQuizProgress,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
    addQuiz,
    removeQuiz,
    updateQuiz,
    resetAllQuizzes,
    startTimer,
    fetchQuizzesFromDB,
    fetchQuizById,
    submitCurrentAttempt,
    checkAnswerRemote,
    addAwardToDB,
    updateAttemptToDB
  }
})
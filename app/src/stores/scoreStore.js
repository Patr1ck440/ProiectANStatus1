import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { quizApi } from './apiService.js'
import { useUserStore } from './userStore.js'

export const useScoreStore = defineStore('score', () => {
  // State
  const scores = ref([
    {
      id: 1,
      quizId: 1,
      quizTitle: 'Capitolul 1: Variabile',
      score: 85,
      maxScore: 100,
      date: '2024-01-10',
      timeSpent: '15:30',
      correctAnswers: 8,
      totalQuestions: 10
    },
    {
      id: 2,
      quizId: 2,
      quizTitle: 'Capitolul 2: Funcții',
      score: 90,
      maxScore: 100,
      date: '2024-01-09',
      timeSpent: '12:45',
      correctAnswers: 9,
      totalQuestions: 10
    }
  ])

  const highScores = ref([])
  const userRank = ref(150)
  const totalUsers = ref(1000)

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
  const getAllScores = computed(() => scores.value)
  const getHighScores = computed(() => highScores.value)
  const getUserRank = computed(() => userRank.value)
  const getTotalUsers = computed(() => totalUsers.value)
  const getAverageScore = computed(() => {
    if (scores.value.length === 0) return 0
    const total = scores.value.reduce((sum, score) => sum + score.score, 0)
    return Math.round(total / scores.value.length)
  })
  const getTotalCorrectAnswers = computed(() => {
    return scores.value.reduce((sum, score) => sum + score.correctAnswers, 0)
  })
  const getTotalQuestionsAttempted = computed(() => {
    return scores.value.reduce((sum, score) => sum + score.totalQuestions, 0)
  })
  const getAccuracyRate = computed(() => {
    const totalCorrect = getTotalCorrectAnswers.value
    const totalAttempted = getTotalQuestionsAttempted.value
    if (totalAttempted === 0) return 0
    return Math.round((totalCorrect / totalAttempted) * 100)
  })
  const getBestScore = computed(() => {
    if (scores.value.length === 0) return null
    return scores.value.reduce((best, current) =>
      current.score > best.score ? current : best
    )
  })
  const getWorstScore = computed(() => {
    if (scores.value.length === 0) return null
    return scores.value.reduce((worst, current) =>
      current.score < worst.score ? current : worst
    )
  })
  const getScoreDistribution = computed(() => {
    const distribution = {
      '90-100': 0,
      '80-89': 0,
      '70-79': 0,
      '60-69': 0,
      '0-59': 0
    }

    scores.value.forEach(score => {
      if (score.score >= 90) distribution['90-100']++
      else if (score.score >= 80) distribution['80-89']++
      else if (score.score >= 70) distribution['70-79']++
      else if (score.score >= 60) distribution['60-69']++
      else distribution['0-59']++
    })

    return distribution
  })

  // Actions
  function addScoreFromQuiz(quizData, userAnswers, scoreValue, timeSpentSeconds) {
    const correctAnswers = userAnswers.filter(answer => answer.correct).length
    const totalQuestions = userAnswers.length

    const newScore = {
      id: scores.value.length + 1,
      quizId: quizData.id,
      quizTitle: quizData.title,
      score: scoreValue,
      maxScore: totalQuestions * 10,
      date: new Date().toISOString().split('T')[0],
      timeSpent: formatTime(timeSpentSeconds),
      correctAnswers: correctAnswers,
      totalQuestions: totalQuestions
    }

    scores.value.push(newScore)
    updateHighScores()
    updateUserRank()

    console.log(`✅ Scor adăugat: ${scoreValue}/${newScore.maxScore}`)
    return newScore
  }

  function addScore(scoreData) {
    const newScore = {
      id: scores.value.length + 1,
      date: new Date().toISOString().split('T')[0],
      ...scoreData
    }

    scores.value.push(newScore)
    updateHighScores()
    updateUserRank()

    console.log(`➕ Scor adăugat: ${scoreData.score}/${scoreData.maxScore}`)
  }

  function removeScore(scoreId) {
    scores.value = scores.value.filter(score => score.id !== scoreId)
    console.log(`🗑️ Scor eliminat: ID ${scoreId}`)
  }

  function updateScore(scoreId, updates) {
    const index = scores.value.findIndex(score => score.id === scoreId)
    if (index !== -1) {
      scores.value[index] = { ...scores.value[index], ...updates }
      console.log(`✏️ Scor actualizat: ID ${scoreId}`)
    }
  }

  function updateHighScores() {
    highScores.value = [...scores.value]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    console.log('🏆 High scores actualizate')
  }

  function updateUserRank() {
    const newRank = Math.max(1, Math.floor(Math.random() * totalUsers.value))
    userRank.value = newRank
    console.log(`📊 Rank actualizat: ${newRank}/${totalUsers.value}`)
  }

  function clearAllScores() {
    scores.value = []
    highScores.value = []
    console.log('🔄 Toate scorurile eliminate')
  }

  function calculateStatistics() {
    return {
      averageScore: getAverageScore.value,
      totalAttempts: scores.value.length,
      totalCorrect: getTotalCorrectAnswers.value,
      totalAttempted: getTotalQuestionsAttempted.value,
      accuracy: getAccuracyRate.value,
      bestScore: getBestScore.value?.score || 0,
      worstScore: getWorstScore.value?.score || 0
    }
  }

  function filterScoresByQuiz(quizId) {
    return scores.value.filter(score => score.quizId === quizId)
  }

  function filterScoresByDate(startDate, endDate) {
    return scores.value.filter(score => {
      const scoreDate = new Date(score.date)
      return scoreDate >= new Date(startDate) && scoreDate <= new Date(endDate)
    })
  }

  function exportScores() {
    const dataStr = JSON.stringify(scores.value, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `edubac-scores-${new Date().toISOString().split('T')[0]}.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    console.log('💾 Scoruri exportate')
  }

  function importScores(data) {
    try {
      const importedScores = JSON.parse(data)
      scores.value = [...scores.value, ...importedScores]
      updateHighScores()
      console.log('📥 Scoruri importate cu succes')
    } catch (err) {
      console.error('❌ Eroare la importul scorurilor:', err)
    }
  }

  // Backend integration
  async function fetchScoresFromDB(userId = null) {
    loading.value = true
    error.value = null
    try {
      const uid = userId ?? getCurrentUserId()
      if (!uid) {
        error.value = 'User not authenticated'
        return null
      }
      const attempts = await quizApi.getByUser(uid)
      // Transform attempts into score entries compatible with store
      const mapped = attempts.map(a => ({
        id: a.id,
        quizId: a.chapterId ?? null,
        quizTitle: a.chapter?.title ?? `Capitol ${a.chapterId}`,
        score: a.score,
        maxScore: (a.totalQuestions ?? 0) * 10,
        date: a.completedAt ? new Date(a.completedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        timeSpent: '00:00',
        correctAnswers: a.correctAnswers ?? 0,
        totalQuestions: a.totalQuestions ?? 0
      }))
      // Replace local scores for this user with fetched attempts
      scores.value = mapped
      updateHighScores()
      updateUserRank()
      return mapped
    } catch (err) {
      error.value = err.message || 'Eroare la preluarea scorurilor'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function submitScoreToDB({ quizId = null, scoreValue = 0, totalQuestions = 0, correctAnswers = 0, userId = null } = {}) {
    loading.value = true
    error.value = null
    try {
      const uid = userId ?? getCurrentUserId()
      if (!uid) throw new Error('User not authenticated')
      const payload = {
        userId: uid,
        chapterId: quizId,
        score: scoreValue,
        totalQuestions,
        correctAnswers
      }
      const attempt = await quizApi.submit(payload)
      // Update local store with returned attempt
      const newScore = {
        id: attempt.id ?? scores.value.length + 1,
        quizId: attempt.chapterId ?? quizId,
        quizTitle: attempt.chapter?.title ?? `Capitol ${attempt.chapterId ?? quizId}`,
        score: attempt.score ?? scoreValue,
        maxScore: (attempt.totalQuestions ?? totalQuestions) * 10,
        date: attempt.completedAt ? new Date(attempt.completedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        timeSpent: '00:00',
        correctAnswers: attempt.correctAnswers ?? correctAnswers,
        totalQuestions: attempt.totalQuestions ?? totalQuestions
      }
      // push or replace
      const idx = scores.value.findIndex(s => s.id === newScore.id)
      if (idx === -1) scores.value.push(newScore)
      else scores.value[idx] = newScore
      updateHighScores()
      updateUserRank()
      return newScore
    } catch (err) {
      error.value = err.message || 'Eroare la trimiterea scorului'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function syncScoresWithAttempts(userId = null) {
    loading.value = true
    error.value = null
    try {
      const uid = userId ?? getCurrentUserId()
      if (!uid) throw new Error('User not authenticated')
      const attempts = await quizApi.getByUser(uid)
      // Merge attempts into scores without duplicating
      attempts.forEach(a => {
        const exists = scores.value.find(s => s.id === a.id)
        const entry = {
          id: a.id,
          quizId: a.chapterId ?? null,
          quizTitle: a.chapter?.title ?? `Capitol ${a.chapterId}`,
          score: a.score,
          maxScore: (a.totalQuestions ?? 0) * 10,
          date: a.completedAt ? new Date(a.completedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          timeSpent: '00:00',
          correctAnswers: a.correctAnswers ?? 0,
          totalQuestions: a.totalQuestions ?? 0
        }
        if (!exists) scores.value.push(entry)
        else {
          Object.assign(exists, entry)
        }
      })
      updateHighScores()
      updateUserRank()
      return scores.value
    } catch (err) {
      error.value = err.message || 'Eroare la sincronizare'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getLeaderboardFromDB() {
    loading.value = true
    error.value = null
    try {
      const board = await quizApi.getLeaderboard()
      // board is list of users with points and level
      return board
    } catch (err) {
      error.value = err.message || 'Eroare la preluarea leaderboard'
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Helper functions
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  function getLatestScore() {
    if (scores.value.length === 0) return null
    return scores.value[scores.value.length - 1]
  }

  function getQuizStats(quizId) {
    const quizScores = filterScoresByQuiz(quizId)
    if (quizScores.length === 0) return null

    const totalScore = quizScores.reduce((sum, score) => sum + score.score, 0)
    const avgScore = Math.round(totalScore / quizScores.length)
    const bestScore = Math.max(...quizScores.map(s => s.score))
    const attempts = quizScores.length

    return {
      quizId,
      attempts,
      averageScore: avgScore,
      bestScore,
      latestScore: quizScores[quizScores.length - 1].score
    }
  }

  return {
    // State
    scores,
    highScores,
    userRank,
    totalUsers,
    loading,
    error,

    // Getters
    getAllScores,
    getHighScores,
    getUserRank,
    getTotalUsers,
    getAverageScore,
    getTotalCorrectAnswers,
    getTotalQuestionsAttempted,
    getAccuracyRate,
    getBestScore,
    getWorstScore,
    getScoreDistribution,

    // Actions
    addScoreFromQuiz,
    addScore,
    removeScore,
    updateScore,
    updateHighScores,
    updateUserRank,
    clearAllScores,
    calculateStatistics,
    filterScoresByQuiz,
    filterScoresByDate,
    exportScores,
    importScores,
    getLatestScore,
    getQuizStats,

    // Backend actions
    fetchScoresFromDB,
    submitScoreToDB,
    syncScoresWithAttempts,
    getLeaderboardFromDB
  }
})

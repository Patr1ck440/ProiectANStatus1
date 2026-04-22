import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chapterApi } from './apiService.js'

export const useChapterStore = defineStore('chapter', () => {
  // ─── STATE (existent, nemodificat) ───────────────────────────────────────────
  const chapters = ref([
    {
      id: 1,
      title: 'Algebră',
      subject: 'Matematică',
      difficulty: 'mediu',
      description: 'Noțiuni de bază de algebră',
      completed: false,
      progress: 30,
      questions: 15,
      duration: '2 ore'
    },
    {
      id: 2,
      title: 'Geometrie',
      subject: 'Matematică',
      difficulty: 'dificil',
      description: 'Geometrie plană și în spațiu',
      completed: false,
      progress: 10,
      questions: 20,
      duration: '3 ore'
    },
    {
      id: 3,
      title: 'Literatură Română',
      subject: 'Română',
      difficulty: 'ușor',
      description: 'Autori și opere clasice',
      completed: true,
      progress: 100,
      questions: 12,
      duration: '1.5 ore'
    },
    {
      id: 4,
      title: 'Literatură Română',
      subject: 'Română',
      difficulty: 'ușor',
      description: 'Autori și opere clasice',
      completed: true,
      progress: 100,
      questions: 12,
      duration: '1.5 ore'
    },
    {
      id: 5,
      title: 'Literatură Română',
      subject: 'Română',
      difficulty: 'ușor',
      description: 'Autori și opere clasice',
      completed: true,
      progress: 100,
      questions: 12,
      duration: '1.5 ore'
    }
  ])

  const currentChapter = ref(null)
  const selectedSubject = ref('all')

  // ─── GETTERS (existente, nemodificate) ───────────────────────────────────────
  const getAllChapters = computed(() => chapters.value)
  const getCompletedChapters = computed(() =>
    chapters.value.filter(chapter => chapter.completed)
  )
  const getIncompleteChapters = computed(() =>
    chapters.value.filter(chapter => !chapter.completed)
  )
  const getChapterCount = computed(() => chapters.value.length)
  const getCompletedCount = computed(() =>
    chapters.value.filter(chapter => chapter.completed).length
  )
  const getProgressPercentage = computed(() => {
    if (chapters.value.length === 0) return 0
    const totalProgress = chapters.value.reduce((sum, ch) => sum + ch.progress, 0)
    return totalProgress / chapters.value.length
  })
  const getChaptersBySubject = computed(() => {
    if (selectedSubject.value === 'all') return chapters.value
    return chapters.value.filter(ch => ch.subject === selectedSubject.value)
  })
  const getSubjects = computed(() => {
    const subjects = chapters.value.map(ch => ch.subject)
    return ['all', ...new Set(subjects)]
  })
  const getCurrentChapter = computed(() => currentChapter.value)
  const getChaptersByDifficulty = (difficulty) => {
    return computed(() => chapters.value.filter(ch => ch.difficulty === difficulty))
  }

  // ─── ACTIONS (existente, nemodificate) ───────────────────────────────────────
  function selectChapter(chapterId) {
    const chapter = chapters.value.find(ch => ch.id === chapterId)
    if (chapter) {
      currentChapter.value = chapter
      console.log(` Capitol selectat: ${chapter.title}`)
    }
  }

  function markChapterAsCompleted(chapterId) {
    const chapter = chapters.value.find(ch => ch.id === chapterId)
    if (chapter) {
      chapter.completed = true
      chapter.progress = 100
      console.log(` Capitol completat: ${chapter.title}`)
    }
  }

  function updateChapterProgress(chapterId, progress) {
    const chapter = chapters.value.find(ch => ch.id === chapterId)
    if (chapter) {
      chapter.progress = Math.min(100, Math.max(0, progress))
      if (chapter.progress === 100) {
        chapter.completed = true
      }
      console.log(` Progres capitol ${chapter.title}: ${chapter.progress}%`)
    }
  }

  function addChapter(chapter) {
    chapters.value.push({
      id: chapters.value.length + 1,
      ...chapter,
      completed: false,
      progress: 0
    })
    console.log(` Capitol adăugat: ${chapter.title}`)
  }

  function removeChapter(chapterId) {
    chapters.value = chapters.value.filter(ch => ch.id !== chapterId)
    console.log(` Capitol eliminat: ID ${chapterId}`)
  }

  function updateChapter(chapterId, updates) {
    const index = chapters.value.findIndex(ch => ch.id === chapterId)
    if (index !== -1) {
      chapters.value[index] = { ...chapters.value[index], ...updates }
      console.log(` Capitol actualizat: ${chapters.value[index].title}`)
    }
  }

  function filterBySubject(subject) {
    selectedSubject.value = subject
    console.log(` Filtrat după materie: ${subject}`)
  }

  function resetChapterProgress(chapterId) {
    const chapter = chapters.value.find(ch => ch.id === chapterId)
    if (chapter) {
      chapter.completed = false
      chapter.progress = 0
      console.log(` Progres resetat pentru capitol: ${chapter.title}`)
    }
  }

  function resetAllProgress() {
    chapters.value.forEach(chapter => {
      chapter.completed = false
      chapter.progress = 0
    })
    console.log(' Progresul tuturor capitoarelor resetat')
  }

  function sortChaptersBy(property) {
    chapters.value.sort((a, b) => {
      if (property === 'title') {
        return a.title.localeCompare(b.title)
      } else if (property === 'difficulty') {
        const difficultyOrder = { 'ușor': 1, 'mediu': 2, 'dificil': 3 }
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      } else if (property === 'progress') {
        return b.progress - a.progress
      }
      return 0
    })
    console.log(` Capitole sortate după: ${property}`)
  }

  // ─── ACȚIUNI API NOI (adăugate pentru cerințele proiectului) ─────────────────
  const loading = ref(false)
  const error = ref(null)
  const dbQuestions = ref([])

  // GET - capitole din DB
  async function fetchChaptersFromDB() {
    loading.value = true
    error.value = null
    try {
      const data = await chapterApi.getAll()
      console.log('Capitole din DB:', data)
      return data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // GET - întrebările unui capitol din DB
  async function fetchQuestionsFromDB(chapterId) {
    loading.value = true
    try {
      dbQuestions.value = await chapterApi.getQuestions(chapterId)
      return dbQuestions.value
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // GET - statistici capitol din DB
  async function fetchChapterStats(chapterId) {
    try {
      return await chapterApi.getStats(chapterId)
    } catch (err) {
      error.value = err.message
    }
  }

  // POST - salvează capitol în DB
  async function saveChapterToDB(data) {
    loading.value = true
    try {
      const saved = await chapterApi.create(data)
      console.log('Capitol salvat în DB:', saved)
      return saved
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // POST - adaugă întrebare în DB
  async function saveQuestionToDB(chapterId, data) {
    loading.value = true
    try {
      const saved = await chapterApi.addQuestion(chapterId, data)
      dbQuestions.value.push(saved)
      return saved
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // PUT - actualizează capitol în DB
  async function updateChapterInDB(id, data) {
    loading.value = true
    try {
      const updated = await chapterApi.update(id, data)
      console.log('Capitol actualizat în DB:', updated)
      return updated
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // DELETE - șterge capitol din DB
  async function deleteChapterFromDB(id) {
    loading.value = true
    try {
      await chapterApi.delete(id)
      console.log('Capitol șters din DB:', id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // DELETE - șterge întrebare din DB
  async function deleteQuestionFromDB(chapterId, qId) {
    loading.value = true
    try {
      await chapterApi.deleteQuestion(chapterId, qId)
      dbQuestions.value = dbQuestions.value.filter(q => q.id !== qId)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // ── State existent ──
    chapters,
    currentChapter,
    selectedSubject,

    // ── Getters existente ──
    getAllChapters,
    getCompletedChapters,
    getIncompleteChapters,
    getChapterCount,
    getCompletedCount,
    getProgressPercentage,
    getChaptersBySubject,
    getSubjects,
    getCurrentChapter,
    getChaptersByDifficulty,

    // ── Acțiuni existente ──
    selectChapter,
    markChapterAsCompleted,
    updateChapterProgress,
    addChapter,
    removeChapter,
    updateChapter,
    filterBySubject,
    resetChapterProgress,
    resetAllProgress,
    sortChaptersBy,

    // ── API nou adăugat ──
    loading,
    error,
    dbQuestions,
    fetchChaptersFromDB,
    fetchQuestionsFromDB,
    fetchChapterStats,
    saveChapterToDB,
    saveQuestionToDB,
    updateChapterInDB,
    deleteChapterFromDB,
    deleteQuestionFromDB,
  }
})
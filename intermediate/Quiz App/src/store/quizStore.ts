import { create } from 'zustand'
import quizData from '../data/quiz.json'
import type { QuestionResult, Quiz, QuizPhase } from '../types/quiz'

type QuizState = {
  quiz: Quiz
  phase: QuizPhase
  currentIndex: number
  score: number
  results: QuestionResult[]
  revealed: boolean
  selectedOptionId: string | null
  startQuiz: () => void
  selectAnswer: (optionId: string) => void
  timeoutQuestion: () => void
  goToNextQuestion: () => void
  restartQuiz: () => void
}

const initialPlayState = {
  phase: 'welcome' as QuizPhase,
  currentIndex: 0,
  score: 0,
  results: [] as QuestionResult[],
  revealed: false,
  selectedOptionId: null as string | null,
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quiz: quizData as Quiz,
  ...initialPlayState,

  startQuiz: () => {
    set({
      phase: 'inProgress',
      currentIndex: 0,
      score: 0,
      results: [],
      revealed: false,
      selectedOptionId: null,
    })
  },

  selectAnswer: (optionId: string) => {
    const { revealed, quiz, currentIndex, score, results } = get()
    if (revealed || get().phase !== 'inProgress') return

    const question = quiz.questions[currentIndex]
    if (!question) return

    const isCorrect = optionId === question.correctOptionId
    const result: QuestionResult = {
      questionId: question.id,
      prompt: question.prompt,
      selectedOptionId: optionId,
      correctOptionId: question.correctOptionId,
      isCorrect,
      timedOut: false,
    }

    set({
      revealed: true,
      selectedOptionId: optionId,
      score: isCorrect ? score + 1 : score,
      results: [...results, result],
    })
  },

  timeoutQuestion: () => {
    const { revealed, quiz, currentIndex, score, results } = get()
    if (revealed || get().phase !== 'inProgress') return

    const question = quiz.questions[currentIndex]
    if (!question) return

    const result: QuestionResult = {
      questionId: question.id,
      prompt: question.prompt,
      selectedOptionId: null,
      correctOptionId: question.correctOptionId,
      isCorrect: false,
      timedOut: true,
    }

    set({
      revealed: true,
      selectedOptionId: null,
      score: Math.max(0, score - 1),
      results: [...results, result],
    })
  },

  goToNextQuestion: () => {
    const { revealed, quiz, currentIndex } = get()
    if (!revealed || get().phase !== 'inProgress') return

    const isLast = currentIndex >= quiz.questions.length - 1
    if (isLast) {
      set({ phase: 'finished', revealed: false, selectedOptionId: null })
      return
    }

    set({
      currentIndex: currentIndex + 1,
      revealed: false,
      selectedOptionId: null,
    })
  },

  restartQuiz: () => {
    set({ ...initialPlayState })
  },
}))

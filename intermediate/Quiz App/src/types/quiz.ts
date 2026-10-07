export type QuizOption = {
  id: string
  label: string
}

export type QuizQuestion = {
  id: string
  prompt: string
  options: QuizOption[]
  correctOptionId: string
}

export type Quiz = {
  title: string
  description: string
  questions: QuizQuestion[]
}

export type QuestionResult = {
  questionId: string
  prompt: string
  selectedOptionId: string | null
  correctOptionId: string
  isCorrect: boolean
  timedOut: boolean
}

export type QuizPhase = 'welcome' | 'inProgress' | 'finished'

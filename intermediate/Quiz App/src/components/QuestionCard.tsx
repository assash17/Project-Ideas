import { useEffect } from 'react'
import { FEEDBACK_ADVANCE_MS } from '../constants/quiz'
import { useQuestionTimer } from '../hooks/useQuestionTimer'
import { useQuizStore } from '../store/quizStore'
import { AnswerButton } from './AnswerButton'
import { TimerBar } from './TimerBar'

export const QuestionCard = () => {
  const quiz = useQuizStore(state => state.quiz)
  const currentIndex = useQuizStore(state => state.currentIndex)
  const score = useQuizStore(state => state.score)
  const revealed = useQuizStore(state => state.revealed)
  const selectedOptionId = useQuizStore(state => state.selectedOptionId)
  const selectAnswer = useQuizStore(state => state.selectAnswer)
  const goToNextQuestion = useQuizStore(state => state.goToNextQuestion)

  const question = quiz.questions[currentIndex]
  const { secondsLeft, active } = useQuestionTimer()

  useEffect(() => {
    if (!revealed) return
    const timeoutId = window.setTimeout(() => {
      goToNextQuestion()
    }, FEEDBACK_ADVANCE_MS)
    return () => window.clearTimeout(timeoutId)
  }, [revealed, currentIndex, goToNextQuestion])

  if (!question) return null

  const total = quiz.questions.length
  const timedOut = revealed && selectedOptionId === null

  return (
    <section className="card card--question">
      <header className="question-header">
        <p className="progress">
          Question {currentIndex + 1} of {total}
        </p>
        <p className="score-pill">Score: {score}</p>
      </header>

      <TimerBar secondsLeft={secondsLeft} active={active} />

      <h2 className="question-prompt">{question.prompt}</h2>

      {timedOut && (
        <p className="feedback-banner feedback-banner--timeout" role="status">
          Time’s up! The correct answer is highlighted below.
        </p>
      )}

      <div className="answers">
        {question.options.map(option => {
          const isSelected = selectedOptionId === option.id
          const isCorrect = option.id === question.correctOptionId

          let variant: 'default' | 'correct' | 'wrong' | 'revealCorrect' = 'default'
          if (revealed) {
            if (isSelected && isCorrect) variant = 'correct'
            else if (isSelected && !isCorrect) variant = 'wrong'
            else if (!isSelected && isCorrect) variant = 'revealCorrect'
          }

          return (
            <AnswerButton
              key={option.id}
              label={option.label}
              disabled={revealed}
              variant={variant}
              onClick={() => selectAnswer(option.id)}
            />
          )
        })}
      </div>
    </section>
  )
}

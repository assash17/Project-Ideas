import { useEffect, useState } from 'react'
import { QUESTION_TIME_SECONDS } from '../constants/quiz'
import { useQuizStore } from '../store/quizStore'

export const useQuestionTimer = () => {
  const phase = useQuizStore(state => state.phase)
  const revealed = useQuizStore(state => state.revealed)
  const currentIndex = useQuizStore(state => state.currentIndex)
  const timeoutQuestion = useQuizStore(state => state.timeoutQuestion)

  const [secondsLeft, setSecondsLeft] = useState(QUESTION_TIME_SECONDS)

  useEffect(() => {
    if (phase !== 'inProgress' || revealed) return

    let remaining = QUESTION_TIME_SECONDS
    setSecondsLeft(remaining)

    const intervalId = window.setInterval(() => {
      remaining -= 1
      setSecondsLeft(remaining)
      if (remaining <= 0) {
        window.clearInterval(intervalId)
        timeoutQuestion()
      }
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [phase, revealed, currentIndex, timeoutQuestion])

  const active = phase === 'inProgress' && !revealed

  return {
    secondsLeft: active ? secondsLeft : QUESTION_TIME_SECONDS,
    active,
  }
}

import type { Quiz } from '../types/quiz'
import { QUESTION_TIME_SECONDS } from '../constants/quiz'

type Props = {
  quiz: Quiz
  onStart: () => void
}

export const StartScreen = ({ quiz, onStart }: Props) => {
  const questionCount = quiz.questions.length

  return (
    <section className="card card--welcome">
      <p className="eyebrow">Quiz</p>
      <h1 className="title">{quiz.title}</h1>
      <p className="description">{quiz.description}</p>
      <ul className="meta-list">
        <li>
          <strong>{questionCount}</strong> multiple-choice questions
        </li>
        <li>
          <strong>{QUESTION_TIME_SECONDS}s</strong> per question
        </li>
        <li>
          +1 point for each correct answer; −1 if time runs out (score never below 0)
        </li>
        <li>
          Maximum score: <strong>{questionCount}</strong>
        </li>
      </ul>
      <button type="button" className="btn btn--primary" onClick={onStart}>
        Start
      </button>
    </section>
  )
}

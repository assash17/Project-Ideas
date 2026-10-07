import type { QuestionResult } from '../types/quiz'

type Props = {
  score: number
  maxScore: number
  results: QuestionResult[]
  onRestart: () => void
}

export const ResultsScreen = ({ score, maxScore, results, onRestart }: Props) => {
  return (
    <section className="card card--results">
      <p className="eyebrow">Quiz complete</p>
      <h1 className="title">Your score</h1>
      <p className="score-display">
        <span className="score-display__value">{score}</span>
        <span className="score-display__max">/ {maxScore}</span>
      </p>

      <h2 className="subtitle">All results</h2>
      <ol className="results-list">
        {results.map((result, index) => (
          <li key={result.questionId} className="results-list__item">
            <span className="results-list__index">{index + 1}.</span>
            <div className="results-list__body">
              <p className="results-list__prompt">{result.prompt}</p>
              <p className={`results-list__status results-list__status--${statusKey(result)}`}>
                {statusLabel(result)}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <button type="button" className="btn btn--primary" onClick={onRestart}>
        Restart
      </button>
    </section>
  )
}

const statusKey = (result: QuestionResult) => {
  if (result.timedOut) return 'timeout'
  if (result.isCorrect) return 'correct'
  return 'wrong'
}

const statusLabel = (result: QuestionResult) => {
  if (result.timedOut) return 'Time’s up — no answer (score −1)'
  if (result.isCorrect) return 'Correct'
  return 'Incorrect'
}

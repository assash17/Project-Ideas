import { QuestionCard } from './components/QuestionCard'
import { ResultsScreen } from './components/ResultsScreen'
import { StartScreen } from './components/StartScreen'
import { useQuizStore } from './store/quizStore'

function App() {
  const phase = useQuizStore(state => state.phase)
  const quiz = useQuizStore(state => state.quiz)
  const score = useQuizStore(state => state.score)
  const results = useQuizStore(state => state.results)
  const startQuiz = useQuizStore(state => state.startQuiz)
  const restartQuiz = useQuizStore(state => state.restartQuiz)

  return (
    <div className="app">
      {phase === 'welcome' && <StartScreen quiz={quiz} onStart={startQuiz} />}
      {phase === 'inProgress' && <QuestionCard />}
      {phase === 'finished' && (
        <ResultsScreen
          score={score}
          maxScore={quiz.questions.length}
          results={results}
          onRestart={restartQuiz}
        />
      )}
    </div>
  )
}

export default App

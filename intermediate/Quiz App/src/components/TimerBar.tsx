import { QUESTION_TIME_SECONDS } from '../constants/quiz'

type Props = {
  secondsLeft: number
  active: boolean
}

export const TimerBar = ({ secondsLeft, active }: Props) => {
  const progress = (secondsLeft / QUESTION_TIME_SECONDS) * 100

  return (
    <div className="timer" aria-live="polite">
      <div className="timer__label">
        <span>Time left</span>
        <span className="timer__value">{active ? `${secondsLeft}s` : '—'}</span>
      </div>
      <div className="timer__track" role="progressbar" aria-valuenow={secondsLeft} aria-valuemin={0} aria-valuemax={QUESTION_TIME_SECONDS}>
        <div className="timer__fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

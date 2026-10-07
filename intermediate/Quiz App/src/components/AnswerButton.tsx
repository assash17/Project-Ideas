type Props = {
  label: string
  disabled: boolean
  variant: 'default' | 'correct' | 'wrong' | 'revealCorrect'
  onClick: () => void
}

export const AnswerButton = ({ label, disabled, variant, onClick }: Props) => {
  return (
    <button
      type="button"
      className={`answer-btn answer-btn--${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

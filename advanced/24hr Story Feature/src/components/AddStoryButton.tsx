type AddStoryButtonProps = {
  disabled?: boolean
  onClick: () => void
}

export function AddStoryButton({ disabled, onClick }: AddStoryButtonProps) {
  return (
    <button
      type="button"
      className="story-add"
      onClick={onClick}
      disabled={disabled}
      aria-label="Add story"
    >
      <span className="story-add__ring" aria-hidden>
        <span className="story-add__inner">
          <span className="story-add__icon">+</span>
        </span>
      </span>
      <span className="story-add__label">Your story</span>
    </button>
  )
}

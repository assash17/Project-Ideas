type ErrorBannerProps = {
  message: string
  onDismiss: () => void
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <p>{message}</p>
      <button type="button" className="error-banner__dismiss" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  )
}

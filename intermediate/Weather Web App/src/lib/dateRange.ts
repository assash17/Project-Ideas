function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Yesterday through tomorrow in local calendar dates (covers ±24h hourly). */
export function getTimelineDateRange(reference = new Date()): {
  start: string
  end: string
} {
  const start = new Date(reference)
  start.setDate(start.getDate() - 1)
  const end = new Date(reference)
  end.setDate(end.getDate() + 1)
  return { start: toIsoDate(start), end: toIsoDate(end) }
}

export function formatHourLabel(instant: Date): string {
  return instant.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

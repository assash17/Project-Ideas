const CONDITION_EMOJI: Record<string, string> = {
  clear: '☀️',
  sunny: '☀️',
  'partially cloudy': '⛅',
  cloudy: '☁️',
  overcast: '☁️',
  rain: '🌧️',
  drizzle: '🌦️',
  snow: '❄️',
  fog: '🌫️',
  wind: '💨',
  thunder: '⛈️',
}

export function emojiForConditions(conditions: string, icon?: string): string {
  const lower = conditions.toLowerCase()
  for (const [key, emoji] of Object.entries(CONDITION_EMOJI)) {
    if (lower.includes(key)) return emoji
  }
  if (icon) {
    if (icon.includes('rain')) return '🌧️'
    if (icon.includes('snow')) return '❄️'
    if (icon.includes('cloud')) return '☁️'
    if (icon.includes('clear') || icon.includes('sun')) return '☀️'
    if (icon.includes('fog')) return '🌫️'
    if (icon.includes('wind')) return '💨'
  }
  return '🌡️'
}

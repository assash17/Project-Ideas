import { msUntilExpiry } from '../lib/storyExpiry'
import type { Story } from '../types/story'

type StoryThumbnailProps = {
  story: Story
  index: number
  onOpen: (index: number) => void
}

function formatRemaining(ms: number): string {
  const hours = Math.floor(ms / (60 * 60 * 1000))
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  if (hours > 0) {
    return `${hours}h left`
  }
  return `${minutes}m left`
}

export function StoryThumbnail({ story, index, onOpen }: StoryThumbnailProps) {
  const remaining = formatRemaining(msUntilExpiry(story))

  return (
    <button
      type="button"
      className="story-thumb"
      onClick={() => onOpen(index)}
      aria-label={`Open story, ${remaining}`}
    >
      <span className="story-thumb__ring" aria-hidden>
        <img
          className="story-thumb__image"
          src={story.imageDataUrl}
          alt=""
          width={64}
          height={64}
        />
      </span>
      <span className="story-thumb__label">{remaining}</span>
    </button>
  )
}

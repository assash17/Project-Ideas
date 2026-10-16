import { useEffect, useRef, type PointerEvent } from 'react'
import { SWIPE_THRESHOLD_PX } from '../lib/constants'
import { useStoriesStore } from '../store/storiesStore'

export function StoryViewer() {
  const viewerOpen = useStoriesStore((s) => s.viewerOpen)
  const viewerIndex = useStoriesStore((s) => s.viewerIndex)
  const stories = useStoriesStore((s) => s.stories)
  const closeViewer = useStoriesStore((s) => s.closeViewer)
  const goToNext = useStoriesStore((s) => s.goToNext)
  const goToPrevious = useStoriesStore((s) => s.goToPrevious)

  const pointerStartX = useRef<number | null>(null)
  const pointerStartY = useRef<number | null>(null)

  const story = stories[viewerIndex]

  useEffect(() => {
    if (!viewerOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeViewer()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      } else if (event.key === 'ArrowLeft') {
        goToPrevious()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [viewerOpen, closeViewer, goToNext, goToPrevious])

  useEffect(() => {
    if (!viewerOpen) {
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [viewerOpen])

  if (!viewerOpen || !story) {
    return null
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX
    pointerStartY.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null || pointerStartY.current === null) {
      return
    }

    const dx = event.clientX - pointerStartX.current
    const dy = event.clientY - pointerStartY.current
    pointerStartX.current = null
    pointerStartY.current = null

    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) {
      return
    }

    if (dx < 0) {
      goToNext()
    } else {
      goToPrevious()
    }
  }

  return (
    <div
      className="story-viewer"
      role="dialog"
      aria-modal="true"
      aria-label="Story viewer"
    >
      <div className="story-viewer__backdrop" onClick={closeViewer} aria-hidden />
      <div
        className="story-viewer__stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null
          pointerStartY.current = null
        }}
      >
        <button
          type="button"
          className="story-viewer__close"
          onClick={closeViewer}
          aria-label="Close story"
        >
          ×
        </button>
        <img
          className="story-viewer__image"
          src={story.imageDataUrl}
          alt="Story"
          draggable={false}
        />
        <div className="story-viewer__nav">
          <button
            type="button"
            className="story-viewer__nav-btn"
            onClick={goToPrevious}
            disabled={viewerIndex === 0}
            aria-label="Previous story"
          >
            ‹
          </button>
          <span className="story-viewer__counter">
            {viewerIndex + 1} / {stories.length}
          </span>
          <button
            type="button"
            className="story-viewer__nav-btn"
            onClick={goToNext}
            aria-label="Next story"
          >
            ›
          </button>
        </div>
        <p className="story-viewer__hint">Swipe or use arrow keys</p>
      </div>
    </div>
  )
}

import { useEffect } from 'react'
import { ErrorBanner } from './components/ErrorBanner'
import { StoryRail } from './components/StoryRail'
import { StoryViewer } from './components/StoryViewer'
import { useStoriesStore } from './store/storiesStore'

const PURGE_INTERVAL_MS = 60_000

export default function App() {
  const hydrate = useStoriesStore((s) => s.hydrate)
  const purgeExpired = useStoriesStore((s) => s.purgeExpired)
  const uploadError = useStoriesStore((s) => s.uploadError)
  const clearUploadError = useStoriesStore((s) => s.clearUploadError)
  const storyCount = useStoriesStore((s) => s.stories.length)

  useEffect(() => {
    hydrate()
    purgeExpired()
    const id = window.setInterval(purgeExpired, PURGE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [hydrate, purgeExpired])

  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">roadmap.sh project</p>
        <h1 className="title">24hr Stories</h1>
        <p className="lede">
          Upload an image to add a story. It is saved as base64 in local storage and
          removed after 24 hours.
        </p>
      </header>

      {uploadError ? (
        <ErrorBanner message={uploadError} onDismiss={clearUploadError} />
      ) : null}

      <StoryRail />

      <p className="app-footer">
        {storyCount === 0
          ? 'No stories yet — tap + to add one.'
          : `${storyCount} active ${storyCount === 1 ? 'story' : 'stories'}`}
      </p>

      <StoryViewer />
    </div>
  )
}

import { useRef, type ChangeEvent } from 'react'
import { useStoriesStore } from '../store/storiesStore'
import { AddStoryButton } from './AddStoryButton'
import { StoryThumbnail } from './StoryThumbnail'

export function StoryRail() {
  const inputRef = useRef<HTMLInputElement>(null)
  const stories = useStoriesStore((s) => s.stories)
  const isUploading = useStoriesStore((s) => s.isUploading)
  const addStoryFromFile = useStoriesStore((s) => s.addStoryFromFile)
  const openViewer = useStoriesStore((s) => s.openViewer)

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }
    await addStoryFromFile(file)
  }

  return (
    <section className="story-rail" aria-label="Stories">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={onFileChange}
      />
      <div className="story-rail__track">
        <AddStoryButton disabled={isUploading} onClick={openFilePicker} />
        {stories.map((story, index) => (
          <StoryThumbnail
            key={story.id}
            story={story}
            index={index}
            onOpen={openViewer}
          />
        ))}
      </div>
      {isUploading ? <p className="story-rail__hint">Uploading…</p> : null}
    </section>
  )
}

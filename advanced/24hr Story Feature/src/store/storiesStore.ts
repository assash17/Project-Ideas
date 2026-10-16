import { create } from 'zustand'
import { resizeImageFileToDataUrl } from '../lib/imageResize'
import { filterActiveStories } from '../lib/storyExpiry'
import { loadStoriesFromStorage, saveStoriesToStorage, StorageQuotaError } from '../lib/storage'
import type { Story } from '../types/story'

type StoriesState = {
  stories: Story[]
  viewerOpen: boolean
  viewerIndex: number
  uploadError: string | null
  isUploading: boolean
  hydrate: () => void
  purgeExpired: () => void
  addStoryFromFile: (file: File) => Promise<void>
  openViewer: (index: number) => void
  closeViewer: () => void
  goToNext: () => void
  goToPrevious: () => void
  clearUploadError: () => void
}

function persistStories(stories: Story[]): void {
  saveStoriesToStorage(stories)
}

export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: [],
  viewerOpen: false,
  viewerIndex: 0,
  uploadError: null,
  isUploading: false,

  hydrate: () => {
    const stories = loadStoriesFromStorage()
    set({ stories })
  },

  purgeExpired: () => {
    const active = filterActiveStories(get().stories)
    if (active.length === get().stories.length) {
      return
    }
    persistStories(active)
    const { viewerOpen, viewerIndex } = get()
    set({
      stories: active,
      viewerOpen: viewerOpen && active.length > 0,
      viewerIndex: Math.min(viewerIndex, Math.max(0, active.length - 1)),
    })
  },

  addStoryFromFile: async (file: File) => {
    set({ isUploading: true, uploadError: null })
    try {
      const imageDataUrl = await resizeImageFileToDataUrl(file)
      const story: Story = {
        id: crypto.randomUUID(),
        imageDataUrl,
        createdAt: Date.now(),
      }
      const nextStories = [...get().stories, story]
      persistStories(nextStories)
      set({ stories: nextStories })
    } catch (error) {
      const message =
        error instanceof StorageQuotaError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to add story.'
      set({ uploadError: message })
    } finally {
      set({ isUploading: false })
    }
  },

  openViewer: (index: number) => {
    const { stories } = get()
    if (index < 0 || index >= stories.length) {
      return
    }
    set({ viewerOpen: true, viewerIndex: index })
  },

  closeViewer: () => {
    set({ viewerOpen: false })
  },

  goToNext: () => {
    const { stories, viewerIndex } = get()
    if (viewerIndex < stories.length - 1) {
      set({ viewerIndex: viewerIndex + 1 })
    } else {
      set({ viewerOpen: false })
    }
  },

  goToPrevious: () => {
    const { viewerIndex } = get()
    if (viewerIndex > 0) {
      set({ viewerIndex: viewerIndex - 1 })
    }
  },

  clearUploadError: () => {
    set({ uploadError: null })
  },
}))

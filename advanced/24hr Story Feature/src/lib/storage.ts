import { STORIES_STORAGE_KEY } from './constants'
import { filterActiveStories } from './storyExpiry'
import type { Story } from '../types/story'

export class StorageQuotaError extends Error {
  constructor(message = 'Storage is full. Remove older stories or use a smaller image.') {
    super(message)
    this.name = 'StorageQuotaError'
  }
}

export function loadStoriesFromStorage(): Story[] {
  try {
    const raw = localStorage.getItem(STORIES_STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    const stories = parsed.filter(isValidStory)
    return filterActiveStories(stories)
  } catch {
    return []
  }
}

export function saveStoriesToStorage(stories: Story[]): void {
  try {
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories))
  } catch (error) {
    if (isQuotaError(error)) {
      throw new StorageQuotaError()
    }
    throw error
  }
}

function isValidStory(value: unknown): value is Story {
  if (!value || typeof value !== 'object') {
    return false
  }
  const record = value as Record<string, unknown>
  return (
    typeof record.id === 'string' &&
    typeof record.imageDataUrl === 'string' &&
    typeof record.createdAt === 'number'
  )
}

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' || error.code === 22)
  )
}

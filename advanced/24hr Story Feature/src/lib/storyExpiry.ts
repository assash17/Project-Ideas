import { STORY_TTL_MS } from './constants'
import type { Story } from '../types/story'

export function isStoryExpired(story: Story, now = Date.now()): boolean {
  return now - story.createdAt >= STORY_TTL_MS
}

export function filterActiveStories(stories: Story[], now = Date.now()): Story[] {
  return stories.filter((story) => !isStoryExpired(story, now))
}

export function msUntilExpiry(story: Story, now = Date.now()): number {
  return Math.max(0, story.createdAt + STORY_TTL_MS - now)
}

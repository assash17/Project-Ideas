import { JPEG_QUALITY, MAX_STORY_HEIGHT, MAX_STORY_WIDTH } from './constants'

function loadImageFromObjectUrl(objectUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = objectUrl
  })
}

export async function resizeImageFileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const img = await loadImageFromObjectUrl(objectUrl)
    const scale = Math.min(
      MAX_STORY_WIDTH / img.naturalWidth,
      MAX_STORY_HEIGHT / img.naturalHeight,
      1,
    )
    const width = Math.max(1, Math.round(img.naturalWidth * scale))
    const height = Math.max(1, Math.round(img.naturalHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas is not supported in this browser.')
    }

    ctx.drawImage(img, 0, 0, width, height)

    const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    if (mimeType === 'image/png') {
      return canvas.toDataURL('image/png')
    }
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

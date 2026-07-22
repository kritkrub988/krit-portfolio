import type { BackgroundRemovalSettings, RgbColor } from "../../types/line-sticker.ts"

export function colorDistance(left: RgbColor, right: RgbColor) {
  return Math.sqrt(
    (left.r - right.r) ** 2 +
      (left.g - right.g) ** 2 +
      (left.b - right.b) ** 2,
  )
}

function pixelMatches(
  pixels: Uint8ClampedArray,
  pixelIndex: number,
  color: RgbColor,
  tolerance: number,
) {
  const offset = pixelIndex * 4
  return colorDistance(
    { r: pixels[offset], g: pixels[offset + 1], b: pixels[offset + 2] },
    color,
  ) <= tolerance
}

export function createBackgroundRemovalMask(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  settings: BackgroundRemovalSettings,
) {
  if (pixels.length !== width * height * 4) {
    throw new Error("Pixel buffer size does not match width and height")
  }
  const total = width * height
  const removed = new Uint8Array(total)

  if (!settings.edgeConnected) {
    for (let index = 0; index < total; index += 1) {
      if (pixelMatches(pixels, index, settings.color, settings.tolerance)) removed[index] = 1
    }
    return removed
  }

  const visited = new Uint8Array(total)
  const queue = new Int32Array(total)
  let head = 0
  let tail = 0

  function seed(index: number) {
    if (visited[index]) return
    visited[index] = 1
    if (!pixelMatches(pixels, index, settings.color, settings.tolerance)) return
    removed[index] = 1
    queue[tail] = index
    tail += 1
  }

  for (let x = 0; x < width; x += 1) {
    seed(x)
    seed((height - 1) * width + x)
  }
  for (let y = 1; y < height - 1; y += 1) {
    seed(y * width)
    seed(y * width + width - 1)
  }

  while (head < tail) {
    const index = queue[head]
    head += 1
    const x = index % width
    const y = Math.floor(index / width)
    const neighbors = [
      x > 0 ? index - 1 : -1,
      x < width - 1 ? index + 1 : -1,
      y > 0 ? index - width : -1,
      y < height - 1 ? index + width : -1,
    ]
    neighbors.forEach((neighbor) => {
      if (neighbor >= 0 && !visited[neighbor]) seed(neighbor)
    })
  }

  return removed
}

export function removeSolidBackgroundPixels(
  source: Uint8ClampedArray,
  width: number,
  height: number,
  settings: BackgroundRemovalSettings,
) {
  const output = new Uint8ClampedArray(source)
  const removed = createBackgroundRemovalMask(source, width, height, settings)
  const featherRadius = Math.max(0, Math.min(8, Math.round(settings.feather)))

  for (let index = 0; index < removed.length; index += 1) {
    if (removed[index]) {
      const offset = index * 4
      output[offset] = 0
      output[offset + 1] = 0
      output[offset + 2] = 0
      output[offset + 3] = 0
    }
  }

  if (featherRadius > 0) {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x
        if (removed[index]) continue
        let nearest = featherRadius + 1
        for (let dy = -featherRadius; dy <= featherRadius; dy += 1) {
          for (let dx = -featherRadius; dx <= featherRadius; dx += 1) {
            const nx = x + dx
            const ny = y + dy
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
            if (!removed[ny * width + nx]) continue
            nearest = Math.min(nearest, Math.sqrt(dx * dx + dy * dy))
          }
        }
        if (nearest <= featherRadius) {
          output[index * 4 + 3] = Math.round(
            output[index * 4 + 3] * (nearest / (featherRadius + 1)),
          )
        }
      }
    }
  }

  return output
}

export function sampleCornerColor(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): RgbColor {
  const sampleSize = Math.max(1, Math.floor(Math.min(width, height) * 0.035))
  const samples: RgbColor[] = []
  const corners = [
    [0, 0],
    [width - sampleSize, 0],
    [0, height - sampleSize],
    [width - sampleSize, height - sampleSize],
  ]
  corners.forEach(([startX, startY]) => {
    for (let y = startY; y < startY + sampleSize; y += 1) {
      for (let x = startX; x < startX + sampleSize; x += 1) {
        const offset = (y * width + x) * 4
        samples.push({ r: pixels[offset], g: pixels[offset + 1], b: pixels[offset + 2] })
      }
    }
  })
  const total = samples.reduce(
    (sum, color) => ({ r: sum.r + color.r, g: sum.g + color.g, b: sum.b + color.b }),
    { r: 0, g: 0, b: 0 },
  )
  return {
    r: Math.round(total.r / samples.length),
    g: Math.round(total.g / samples.length),
    b: Math.round(total.b / samples.length),
  }
}

export function hasTransparentPixel(pixels: Uint8ClampedArray) {
  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] < 255) return true
  }
  return false
}

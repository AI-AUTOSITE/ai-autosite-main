import { Filter } from '../../types'

export function getAdvancedFilters(): Filter[] {
  return [
    {
      id: 'vintage',
      name: 'Vintage',
      category: 'advanced',
      params: [
        {
          name: 'intensity',
          type: 'number',
          default: 80,
          min: 0,
          max: 100,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const data = imageData.data
        const intensity = (params.intensity || 80) / 100

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Add warm tone
          data[i] = Math.min(255, r + 30 * intensity)
          data[i + 1] = Math.min(255, g + 10 * intensity)
          data[i + 2] = Math.max(0, b - 20 * intensity)

          // Add slight vignette effect
          const x = (i / 4) % imageData.width
          const y = Math.floor((i / 4) / imageData.width)
          const centerX = imageData.width / 2
          const centerY = imageData.height / 2
          const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
          const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2)
          const vignette = 1 - (distance / maxDistance) * 0.5 * intensity

          data[i] *= vignette
          data[i + 1] *= vignette
          data[i + 2] *= vignette
        }

        return imageData
      },
    },
    {
      id: 'hdr',
      name: 'HDR Effect',
      category: 'advanced',
      params: [
        {
          name: 'strength',
          type: 'number',
          default: 50,
          min: 0,
          max: 100,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const data = imageData.data
        const strength = (params.strength || 50) / 100

        // First pass: Calculate luminance
        const luminance = new Float32Array(data.length / 4)
        for (let i = 0, j = 0; i < data.length; i += 4, j++) {
          luminance[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        }

        // Second pass: Apply tone mapping
        for (let i = 0, j = 0; i < data.length; i += 4, j++) {
          const lum = luminance[j]
          const factor = 1 + strength * (1 - lum / 255)

          data[i] = Math.min(255, data[i] * factor)
          data[i + 1] = Math.min(255, data[i + 1] * factor)
          data[i + 2] = Math.min(255, data[i + 2] * factor)
        }

        return imageData
      },
    },
    {
      id: 'oil_painting',
      name: 'Oil Painting',
      category: 'advanced',
      params: [
        {
          name: 'radius',
          type: 'number',
          default: 3,
          min: 1,
          max: 5,
          step: 1,
        },
        {
          name: 'intensity',
          type: 'number',
          default: 20,
          min: 1,
          max: 50,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const data = imageData.data
        const width = imageData.width
        const height = imageData.height
        const radius = params.radius || 3
        const intensity = params.intensity || 20
        const output = new Uint8ClampedArray(data)

        for (let y = radius; y < height - radius; y++) {
          for (let x = radius; x < width - radius; x++) {
            const intensityCount = new Array(256).fill(0)
            const averageR = new Array(256).fill(0)
            const averageG = new Array(256).fill(0)
            const averageB = new Array(256).fill(0)

            // Calculate intensity distribution in neighborhood
            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const idx = ((y + dy) * width + (x + dx)) * 4
                const currentIntensity = Math.floor(
                  ((data[idx] + data[idx + 1] + data[idx + 2]) / 3) * intensity / 255
                ) * (255 / intensity)

                intensityCount[currentIntensity]++
                averageR[currentIntensity] += data[idx]
                averageG[currentIntensity] += data[idx + 1]
                averageB[currentIntensity] += data[idx + 2]
              }
            }

            // Find most frequent intensity
            let maxCount = 0
            let maxIntensity = 0
            for (let i = 0; i < 256; i++) {
              if (intensityCount[i] > maxCount) {
                maxCount = intensityCount[i]
                maxIntensity = i
              }
            }

            const idx = (y * width + x) * 4
            if (maxCount > 0) {
              output[idx] = averageR[maxIntensity] / maxCount
              output[idx + 1] = averageG[maxIntensity] / maxCount
              output[idx + 2] = averageB[maxIntensity] / maxCount
              output[idx + 3] = data[idx + 3]
            }
          }
        }

        for (let i = 0; i < data.length; i++) {
          data[i] = output[i]
        }

        return imageData
      },
    },
    {
      id: 'cinematic',
      name: 'Cinematic',
      category: 'advanced',
      params: [
        {
          name: 'teal_orange',
          type: 'number',
          default: 50,
          min: 0,
          max: 100,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const data = imageData.data
        const intensity = (params.teal_orange || 50) / 100

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Teal and orange color grading
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b

          if (luminance < 128) {
            // Shadows -> Teal
            data[i] = Math.max(0, r - 20 * intensity)
            data[i + 1] = g + 10 * intensity
            data[i + 2] = Math.min(255, b + 30 * intensity)
          } else {
            // Highlights -> Orange
            data[i] = Math.min(255, r + 30 * intensity)
            data[i + 1] = g + 10 * intensity
            data[i + 2] = Math.max(0, b - 20 * intensity)
          }

          // Add slight contrast
          const factor = 1.1
          data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128))
          data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128))
          data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128))
        }

        return imageData
      },
    },
    {
      id: 'pixelate',
      name: 'Pixelate',
      category: 'advanced',
      params: [
        {
          name: 'size',
          type: 'number',
          default: 10,
          min: 2,
          max: 50,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const data = imageData.data
        const width = imageData.width
        const height = imageData.height
        const pixelSize = params.size || 10

        for (let y = 0; y < height; y += pixelSize) {
          for (let x = 0; x < width; x += pixelSize) {
            // Calculate average color in pixel block
            let r = 0, g = 0, b = 0, a = 0
            let count = 0

            for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
              for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
                const idx = ((y + dy) * width + (x + dx)) * 4
                r += data[idx]
                g += data[idx + 1]
                b += data[idx + 2]
                a += data[idx + 3]
                count++
              }
            }

            // Apply average color to all pixels in block
            if (count > 0) {
              r = r / count
              g = g / count
              b = b / count
              a = a / count

              for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
                for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
                  const idx = ((y + dy) * width + (x + dx)) * 4
                  data[idx] = r
                  data[idx + 1] = g
                  data[idx + 2] = b
                  data[idx + 3] = a
                }
              }
            }
          }
        }

        return imageData
      },
    },
    {
      id: 'glitch',
      name: 'Glitch',
      category: 'advanced',
      params: [
        {
          name: 'intensity',
          type: 'number',
          default: 30,
          min: 0,
          max: 100,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const data = imageData.data
        const width = imageData.width
        const height = imageData.height
        const intensity = (params.intensity || 30) / 100

        // Random RGB channel shift
        for (let y = 0; y < height; y++) {
          if (Math.random() < intensity * 0.1) {
            const shift = Math.floor(Math.random() * 20 * intensity)
            const channel = Math.floor(Math.random() * 3)
            
            for (let x = 0; x < width; x++) {
              const idx = (y * width + x) * 4
              const shiftIdx = (y * width + Math.min(width - 1, x + shift)) * 4
              
              data[idx + channel] = data[shiftIdx + channel]
            }
          }
        }

        // Random line displacement
        for (let i = 0; i < intensity * 10; i++) {
          const y = Math.floor(Math.random() * height)
          const displacement = Math.floor(Math.random() * 50 * intensity) - 25 * intensity
          
          const lineData = new Uint8ClampedArray(width * 4)
          for (let x = 0; x < width; x++) {
            const srcX = (x + displacement + width) % width
            const srcIdx = (y * width + srcX) * 4
            const dstIdx = x * 4
            
            lineData[dstIdx] = data[srcIdx]
            lineData[dstIdx + 1] = data[srcIdx + 1]
            lineData[dstIdx + 2] = data[srcIdx + 2]
            lineData[dstIdx + 3] = data[srcIdx + 3]
          }
          
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4
            const srcIdx = x * 4
            data[idx] = lineData[srcIdx]
            data[idx + 1] = lineData[srcIdx + 1]
            data[idx + 2] = lineData[srcIdx + 2]
            data[idx + 3] = lineData[srcIdx + 3]
          }
        }

        return imageData
      },
    },
  ]
}
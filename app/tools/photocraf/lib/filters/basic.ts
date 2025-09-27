import { Filter } from '../../types'

export function getBasicFilters(): Filter[] {
  return [
    {
      id: 'brightness',
      name: 'Brightness',
      category: 'basic',
      params: [
        {
          name: 'amount',
          type: 'number',
          default: 0,
          min: -100,
          max: 100,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const data = imageData.data
        const amount = params.amount || 0
        const factor = (100 + amount) / 100

        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, data[i] * factor))     // R
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor)) // G
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor)) // B
        }

        return imageData
      },
    },
    {
      id: 'contrast',
      name: 'Contrast',
      category: 'basic',
      params: [
        {
          name: 'amount',
          type: 'number',
          default: 0,
          min: -100,
          max: 100,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const data = imageData.data
        const amount = params.amount || 0
        const factor = (259 * (amount + 255)) / (255 * (259 - amount))

        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128))
          data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128))
          data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128))
        }

        return imageData
      },
    },
    {
      id: 'saturation',
      name: 'Saturation',
      category: 'basic',
      params: [
        {
          name: 'amount',
          type: 'number',
          default: 0,
          min: -100,
          max: 100,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const data = imageData.data
        const amount = (params.amount || 0) / 100

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
          
          data[i] = Math.min(255, Math.max(0, gray + (r - gray) * (1 + amount)))
          data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * (1 + amount)))
          data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * (1 + amount)))
        }

        return imageData
      },
    },
    {
      id: 'grayscale',
      name: 'Grayscale',
      category: 'basic',
      params: [],
      apply: (imageData: ImageData) => {
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
          data[i] = gray     // R
          data[i + 1] = gray // G
          data[i + 2] = gray // B
        }

        return imageData
      },
    },
    {
      id: 'sepia',
      name: 'Sepia',
      category: 'basic',
      params: [
        {
          name: 'intensity',
          type: 'number',
          default: 100,
          min: 0,
          max: 100,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const data = imageData.data
        const intensity = (params.intensity || 100) / 100

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          const tr = (r * 0.393) + (g * 0.769) + (b * 0.189)
          const tg = (r * 0.349) + (g * 0.686) + (b * 0.168)
          const tb = (r * 0.272) + (g * 0.534) + (b * 0.131)

          data[i] = Math.min(255, r + (tr - r) * intensity)
          data[i + 1] = Math.min(255, g + (tg - g) * intensity)
          data[i + 2] = Math.min(255, b + (tb - b) * intensity)
        }

        return imageData
      },
    },
    {
      id: 'invert',
      name: 'Invert',
      category: 'basic',
      params: [],
      apply: (imageData: ImageData) => {
        const data = imageData.data

        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i]         // R
          data[i + 1] = 255 - data[i + 1] // G
          data[i + 2] = 255 - data[i + 2] // B
        }

        return imageData
      },
    },
    {
      id: 'blur',
      name: 'Blur',
      category: 'basic',
      params: [
        {
          name: 'radius',
          type: 'number',
          default: 5,
          min: 1,
          max: 20,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const radius = params.radius || 5
        const data = imageData.data
        const width = imageData.width
        const height = imageData.height
        const output = new Uint8ClampedArray(data)

        // Simple box blur implementation
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0
            let count = 0

            for (let dy = -radius; dy <= radius; dy++) {
              for (let dx = -radius; dx <= radius; dx++) {
                const ny = y + dy
                const nx = x + dx

                if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                  const idx = (ny * width + nx) * 4
                  r += data[idx]
                  g += data[idx + 1]
                  b += data[idx + 2]
                  a += data[idx + 3]
                  count++
                }
              }
            }

            const idx = (y * width + x) * 4
            output[idx] = r / count
            output[idx + 1] = g / count
            output[idx + 2] = b / count
            output[idx + 3] = a / count
          }
        }

        for (let i = 0; i < data.length; i++) {
          data[i] = output[i]
        }

        return imageData
      },
    },
    {
      id: 'sharpen',
      name: 'Sharpen',
      category: 'basic',
      params: [
        {
          name: 'amount',
          type: 'number',
          default: 50,
          min: 0,
          max: 100,
          step: 1,
        },
      ],
      apply: (imageData: ImageData, params: Record<string, any>) => {
        const amount = (params.amount || 50) / 100
        const data = imageData.data
        const width = imageData.width
        const height = imageData.height
        const output = new Uint8ClampedArray(data)

        // Sharpen kernel
        const kernel = [
          0, -1 * amount, 0,
          -1 * amount, 1 + 4 * amount, -1 * amount,
          0, -1 * amount, 0
        ]

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
              let sum = 0
              let kernelIdx = 0

              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  const idx = ((y + dy) * width + (x + dx)) * 4 + c
                  sum += data[idx] * kernel[kernelIdx++]
                }
              }

              const idx = (y * width + x) * 4 + c
              output[idx] = Math.min(255, Math.max(0, sum))
            }
          }
        }

        for (let i = 0; i < data.length; i++) {
          data[i] = output[i]
        }

        return imageData
      },
    },
  ]
}
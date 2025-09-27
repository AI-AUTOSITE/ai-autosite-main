// AI Filter Generator - Creates filter code from natural language prompts

interface FilterTemplate {
  keywords: string[]
  code: string
  name: string
}

// Pre-defined filter templates based on common requests
const filterTemplates: FilterTemplate[] = [
  {
    keywords: ['vintage', 'retro', 'old', 'film', 'analog'],
    name: 'Vintage Film',
    code: `
const data = imageData.data;
const intensity = params.intensity / 100;

for (let i = 0; i < data.length; i += 4) {
  // Add warm tint
  data[i] = Math.min(255, data[i] + 30 * intensity);     // Red
  data[i + 1] = Math.min(255, data[i + 1] + 10 * intensity); // Green
  data[i + 2] = Math.max(0, data[i + 2] - 20 * intensity);   // Blue
  
  // Add slight fade
  const fade = 20 * intensity;
  data[i] = Math.min(255, data[i] + fade);
  data[i + 1] = Math.min(255, data[i + 1] + fade);
  data[i + 2] = Math.min(255, data[i + 2] + fade);
  
  // Add grain
  const grain = (Math.random() - 0.5) * 20 * intensity;
  data[i] = Math.min(255, Math.max(0, data[i] + grain));
  data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
  data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
}

return imageData;`
  },
  {
    keywords: ['dreamy', 'soft', 'glow', 'ethereal', 'magical'],
    name: 'Dreamy Glow',
    code: `
const data = imageData.data;
const width = imageData.width;
const height = imageData.height;
const intensity = params.intensity / 100;

// Create glow effect
const tempData = new Uint8ClampedArray(data);

// Apply soft blur for glow
const radius = 3;
for (let y = radius; y < height - radius; y++) {
  for (let x = radius; x < width - radius; x++) {
    let r = 0, g = 0, b = 0, count = 0;
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const idx = ((y + dy) * width + (x + dx)) * 4;
        r += tempData[idx];
        g += tempData[idx + 1];
        b += tempData[idx + 2];
        count++;
      }
    }
    
    const idx = (y * width + x) * 4;
    // Blend original with blurred version
    data[idx] = data[idx] * (1 - intensity * 0.5) + (r / count) * intensity * 0.5;
    data[idx + 1] = data[idx + 1] * (1 - intensity * 0.5) + (g / count) * intensity * 0.5;
    data[idx + 2] = data[idx + 2] * (1 - intensity * 0.5) + (b / count) * intensity * 0.5;
    
    // Boost brightness in highlights
    const lum = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    if (lum > 128) {
      data[idx] = Math.min(255, data[idx] + 20 * intensity);
      data[idx + 1] = Math.min(255, data[idx + 1] + 20 * intensity);
      data[idx + 2] = Math.min(255, data[idx + 2] + 20 * intensity);
    }
  }
}

return imageData;`
  },
  {
    keywords: ['dramatic', 'contrast', 'shadow', 'highlight', 'moody'],
    name: 'Dramatic Contrast',
    code: `
const data = imageData.data;
const intensity = params.intensity / 100;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  
  // Calculate luminance
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  
  // Apply S-curve for contrast
  let factor;
  if (lum < 128) {
    // Darken shadows
    factor = Math.pow(lum / 128, 1 + intensity);
    data[i] = r * factor;
    data[i + 1] = g * factor;
    data[i + 2] = b * factor;
  } else {
    // Brighten highlights
    factor = 1 + (1 - Math.pow((255 - lum) / 127, 1 + intensity)) * intensity * 0.5;
    data[i] = Math.min(255, r * factor);
    data[i + 1] = Math.min(255, g * factor);
    data[i + 2] = Math.min(255, b * factor);
  }
}

return imageData;`
  },
  {
    keywords: ['vibrant', 'colorful', 'tropical', 'saturated', 'vivid'],
    name: 'Vibrant Colors',
    code: `
const data = imageData.data;
const intensity = params.intensity / 100;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  
  // Calculate gray value
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  
  // Increase saturation
  const saturationBoost = 1 + intensity * 1.5;
  data[i] = Math.min(255, Math.max(0, gray + (r - gray) * saturationBoost));
  data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * saturationBoost));
  data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * saturationBoost));
  
  // Slight vibrance adjustment (protect skin tones)
  const avg = (r + g + b) / 3;
  const maxRGB = Math.max(r, g, b);
  const vibranceFactor = ((maxRGB - avg) * 2 / 255) * intensity * 0.5;
  
  data[i] = Math.min(255, data[i] * (1 + vibranceFactor));
  data[i + 1] = Math.min(255, data[i + 1] * (1 + vibranceFactor));
  data[i + 2] = Math.min(255, data[i + 2] * (1 + vibranceFactor));
}

return imageData;`
  },
  {
    keywords: ['cyberpunk', 'neon', 'futuristic', 'tech', 'digital'],
    name: 'Cyberpunk Neon',
    code: `
const data = imageData.data;
const intensity = params.intensity / 100;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  
  // Convert to cyan-magenta color space
  if (r > g && r > b) {
    // Magenta push
    data[i] = Math.min(255, r + 50 * intensity);
    data[i + 1] = Math.max(0, g - 30 * intensity);
    data[i + 2] = Math.min(255, b + 50 * intensity);
  } else if (b > r && b > g) {
    // Cyan push
    data[i] = Math.max(0, r - 30 * intensity);
    data[i + 1] = Math.min(255, g + 40 * intensity);
    data[i + 2] = Math.min(255, b + 50 * intensity);
  } else {
    // Keep neutral tones darker
    const factor = 0.7 + (0.3 * (1 - intensity));
    data[i] = r * factor;
    data[i + 1] = g * factor;
    data[i + 2] = b * factor;
  }
  
  // Add electric glow to edges (simple edge detection)
  const edgeThreshold = 30;
  if (i > 4 && i < data.length - 4) {
    const diff = Math.abs(data[i] - data[i - 4]) + 
                 Math.abs(data[i + 1] - data[i - 3]) + 
                 Math.abs(data[i + 2] - data[i - 2]);
    
    if (diff > edgeThreshold) {
      data[i] = Math.min(255, data[i] + 30 * intensity);
      data[i + 2] = Math.min(255, data[i + 2] + 30 * intensity);
    }
  }
}

return imageData;`
  },
  {
    keywords: ['watercolor', 'painting', 'artistic', 'paint', 'brush'],
    name: 'Watercolor Effect',
    code: `
const data = imageData.data;
const width = imageData.width;
const height = imageData.height;
const intensity = params.intensity / 100;

// Apply watercolor-like effect
const radius = 2;
const tempData = new Uint8ClampedArray(data);

for (let y = radius; y < height - radius; y++) {
  for (let x = radius; x < width - radius; x++) {
    const idx = (y * width + x) * 4;
    
    // Sample nearby pixels with random weights
    let r = 0, g = 0, b = 0;
    let totalWeight = 0;
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const weight = Math.random() * intensity + (1 - intensity);
        const sampleIdx = ((y + dy) * width + (x + dx)) * 4;
        
        r += tempData[sampleIdx] * weight;
        g += tempData[sampleIdx + 1] * weight;
        b += tempData[sampleIdx + 2] * weight;
        totalWeight += weight;
      }
    }
    
    // Apply with some original color bleeding through
    data[idx] = (r / totalWeight) * 0.8 + tempData[idx] * 0.2;
    data[idx + 1] = (g / totalWeight) * 0.8 + tempData[idx + 1] * 0.2;
    data[idx + 2] = (b / totalWeight) * 0.8 + tempData[idx + 2] * 0.2;
    
    // Reduce color palette (posterize effect)
    const levels = 16 - Math.floor(intensity * 10);
    const factor = 255 / levels;
    data[idx] = Math.round(data[idx] / factor) * factor;
    data[idx + 1] = Math.round(data[idx + 1] / factor) * factor;
    data[idx + 2] = Math.round(data[idx + 2] / factor) * factor;
  }
}

return imageData;`
  },
  {
    keywords: ['golden', 'hour', 'sunset', 'sunrise', 'warm'],
    name: 'Golden Hour',
    code: `
const data = imageData.data;
const intensity = params.intensity / 100;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  
  // Add golden/orange tint
  data[i] = Math.min(255, r + 40 * intensity);     // Boost red
  data[i + 1] = Math.min(255, g + 20 * intensity); // Slight green boost
  data[i + 2] = Math.max(0, b - 30 * intensity);   // Reduce blue
  
  // Increase warmth in midtones
  const lum = (r + g + b) / 3;
  if (lum > 50 && lum < 200) {
    data[i] = Math.min(255, data[i] + 20 * intensity);
    data[i + 1] = Math.min(255, data[i + 1] + 10 * intensity);
  }
  
  // Add subtle glow
  const glowFactor = 1 + (intensity * 0.2);
  if (lum > 180) {
    data[i] = Math.min(255, data[i] * glowFactor);
    data[i + 1] = Math.min(255, data[i + 1] * glowFactor * 0.9);
    data[i + 2] = Math.min(255, data[i + 2] * glowFactor * 0.8);
  }
}

return imageData;`
  },
  {
    keywords: ['grain', 'noise', 'texture', 'film grain', 'grainy'],
    name: 'Film Grain',
    code: `
const data = imageData.data;
const intensity = params.intensity / 100;

for (let i = 0; i < data.length; i += 4) {
  // Generate film-like grain
  const grain = (Math.random() - 0.5) * 30 * intensity;
  const colorGrain = (Math.random() - 0.5) * 10 * intensity;
  
  // Apply grain with slight color variation
  data[i] = Math.min(255, Math.max(0, data[i] + grain + colorGrain));
  data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
  data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain - colorGrain));
  
  // Add occasional dust/scratches
  if (Math.random() < 0.001 * intensity) {
    const scratchIntensity = Math.random() * 50;
    data[i] = Math.min(255, data[i] + scratchIntensity);
    data[i + 1] = Math.min(255, data[i + 1] + scratchIntensity);
    data[i + 2] = Math.min(255, data[i + 2] + scratchIntensity);
  }
}

return imageData;`
  }
]

// Analyze prompt and find best matching template
function findBestTemplate(prompt: string): FilterTemplate | null {
  const promptLower = prompt.toLowerCase()
  let bestMatch: FilterTemplate | null = null
  let bestScore = 0

  for (const template of filterTemplates) {
    let score = 0
    for (const keyword of template.keywords) {
      if (promptLower.includes(keyword)) {
        score += 1
      }
    }
    
    if (score > bestScore) {
      bestScore = score
      bestMatch = template
    }
  }

  return bestMatch
}

// Generate custom code based on prompt analysis
function generateCustomCode(prompt: string): string {
  const promptLower = prompt.toLowerCase()
  
  // Build custom filter based on detected features
  let codeBlocks: string[] = []
  
  // Base structure
  codeBlocks.push(`const data = imageData.data;
const intensity = params.intensity / 100;
`)

  // Color adjustments
  if (promptLower.includes('red') || promptLower.includes('warm')) {
    codeBlocks.push(`// Enhance red tones
for (let i = 0; i < data.length; i += 4) {
  data[i] = Math.min(255, data[i] + 30 * intensity);
}
`)
  }

  if (promptLower.includes('blue') || promptLower.includes('cold') || promptLower.includes('cool')) {
    codeBlocks.push(`// Enhance blue tones
for (let i = 0; i < data.length; i += 4) {
  data[i + 2] = Math.min(255, data[i + 2] + 30 * intensity);
}
`)
  }

  if (promptLower.includes('green') || promptLower.includes('nature')) {
    codeBlocks.push(`// Enhance green tones
for (let i = 0; i < data.length; i += 4) {
  data[i + 1] = Math.min(255, data[i + 1] + 30 * intensity);
}
`)
  }

  // Brightness adjustments
  if (promptLower.includes('bright') || promptLower.includes('light')) {
    codeBlocks.push(`// Increase brightness
for (let i = 0; i < data.length; i += 4) {
  const factor = 1 + (0.5 * intensity);
  data[i] = Math.min(255, data[i] * factor);
  data[i + 1] = Math.min(255, data[i + 1] * factor);
  data[i + 2] = Math.min(255, data[i + 2] * factor);
}
`)
  }

  if (promptLower.includes('dark') || promptLower.includes('shadow')) {
    codeBlocks.push(`// Darken image
for (let i = 0; i < data.length; i += 4) {
  const factor = 1 - (0.3 * intensity);
  data[i] = data[i] * factor;
  data[i + 1] = data[i + 1] * factor;
  data[i + 2] = data[i + 2] * factor;
}
`)
  }

  // If no specific adjustments, add a generic enhancement
  if (codeBlocks.length === 1) {
    codeBlocks.push(`// Generic enhancement
for (let i = 0; i < data.length; i += 4) {
  // Auto contrast
  const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
  const factor = avg < 128 ? 0.9 : 1.1;
  
  data[i] = Math.min(255, Math.max(0, (data[i] - 128) * factor + 128));
  data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * factor + 128));
  data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * factor + 128));
}
`)
  }

  codeBlocks.push(`return imageData;`)
  
  return codeBlocks.join('\n')
}

// Main export function
export async function generateFilterCode(prompt: string): Promise<{
  code: string
  name: string
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Try to find a matching template first
  const template = findBestTemplate(prompt)
  
  if (template) {
    return {
      code: template.code.trim(),
      name: template.name
    }
  }

  // Generate custom code if no template matches
  const customCode = generateCustomCode(prompt)
  
  // Generate a name from the prompt
  const words = prompt.split(' ').slice(0, 3)
  const name = words.map(w => 
    w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  ).join(' ')

  return {
    code: customCode,
    name: name || 'Custom Filter'
  }
}
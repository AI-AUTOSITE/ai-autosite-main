# Image Splitter Tool - Specification Document

## 📋 Overview

### Purpose
Long vertical images (screenshots, infographics, comics) need to be split into manageable parts for:
- Printing on standard paper sizes
- Sharing on platforms with size limits
- Easier viewing and distribution

### Core Features
- **4 Split Modes**: Paper Size, By Height, By Count, Manual
- **Paper Size Support**: A4, A5, B5 with DPI configuration
- **Download Options**: Merged (side-by-side) or Separate files
- **100% Client-side**: No uploads, complete privacy

---

## 🎯 Functional Specifications

### Split Modes

#### 1. Paper Size Mode
**Purpose**: Split for standard paper printing

**Configuration**:
- Paper Size: A4 (210x297mm), A5 (148x210mm), B5 (182x257mm)
- DPI: 72, 96, 150, 300
- Auto-calculation: Paper height (mm) → Pixels based on DPI

**Formula**:
```
pixels = (height_mm / 25.4) * DPI
```

**Example**:
- A4 at 96 DPI = (297 / 25.4) * 96 = 1,122px per page

**Use Cases**:
- Print manga/comics on home printer
- Create physical photo albums
- Print infographics for display

---

#### 2. By Height Mode
**Purpose**: Split at fixed pixel intervals

**Configuration**:
- Height: 100px - 5,000px
- Default: 900px

**Use Cases**:
- Consistent social media posts
- Web article sections
- Custom display requirements

---

#### 3. By Count Mode
**Purpose**: Divide image into N equal parts

**Configuration**:
- Parts: 2 - 100
- Default: 3

**Algorithm**:
```javascript
const partHeight = Math.ceil(totalHeight / count)
```

**Use Cases**:
- Create Instagram carousel (max 10 slides)
- Split for team review (assign 1 part per person)
- Create numbered sequences

---

#### 4. Manual Mode
**Purpose**: User-defined split points

**Interaction**:
- Click on image to add split line
- Split lines show pixel position
- Each line has Remove button
- Lines auto-sort by Y position

**Visual Feedback**:
- Cyan line (2px height)
- Pixel position label
- Remove button on hover

**Use Cases**:
- Split at logical content breaks
- Preserve specific elements intact
- Custom layouts for presentations

---

## 💾 Download Options

### Merged Download
**Format**: Single PNG file
**Layout**: Horizontal (side-by-side)
**Background**: White (#ffffff)

**Algorithm**:
```javascript
totalWidth = originalWidth * numberOfParts
maxHeight = max(allPartHeights)
```

**Use Cases**:
- Compare all parts at once
- Print on wide paper
- Presentation slides

**Filename Format**:
- Paper mode: `split-A4-merged.png`
- Height mode: `split-height-merged.png`
- Count mode: `split-count-merged.png`
- Manual mode: `split-manual-merged.png`

---

### Separate Download
**Format**: Multiple PNG files
**Sequential naming**: `split-part-01.png`, `split-part-02.png`, ...

**Download Behavior**:
- Triggers multiple downloads
- Browser may request download permission
- Files download sequentially

**Use Cases**:
- Share individual parts
- Print one page at a time
- Upload to different platforms

---

## 🎨 UI/UX Specifications

### Layout Structure

```
┌─────────────────────────────────────────┐
│ Split Mode Selection (4 radio buttons) │ 
├─────────────────────────────────────────┤
│ Mode-specific Options + Download       │
├─────────────────────────────────────────┤
│ Drop Zone (file upload)                │
├─────────────────────────────────────────┤
│ Original Image Preview                 │
│ (with split lines overlay)             │
├─────────────────────────────────────────┤
│ Split Result Preview                   │
│ (grid of parts)                        │
└─────────────────────────────────────────┘
```

---

### Responsive Design

#### Mobile (< 640px)
- Mode buttons: 2 columns
- Options: Stack vertically
- Preview: Full width
- Result grid: 2 columns

#### Tablet (640px - 1024px)
- Mode buttons: 4 columns
- Options: Wrap as needed
- Preview: Max 600px
- Result grid: 3 columns

#### Desktop (> 1024px)
- Mode buttons: 4 columns
- Options: Single row
- Preview: Max 800px
- Result grid: 4-5 columns

---

### Tap Target Sizes (Mobile Accessibility)
- Mode buttons: min-h-[64px]
- Input fields: min-h-[44px]
- Dropdown selects: min-h-[44px]
- Download button: min-h-[48px]
- Remove button: min-w-[44px] min-h-[32px]

---

## 🔧 Technical Specifications

### Supported Image Formats
- PNG
- JPEG/JPG
- WebP
- GIF (non-animated)
- BMP
- SVG (converted to raster)

**Browser Support**: All formats supported by HTML5 `<img>` element

---

### File Size Limits
**None** - Processing is client-side only

**Performance Considerations**:
- Images > 10MB may cause lag
- Mobile devices: Recommend < 5MB
- Very large images (> 8000px height): May cause memory issues

---

### Canvas Operations

**Maximum Canvas Size**:
- Chrome: 32,767 x 32,767 px
- Firefox: 32,767 x 32,767 px
- Safari: 16,384 x 16,384 px

**Memory Usage**:
- Each canvas part uses RGBA (4 bytes per pixel)
- Example: 2000x3000px part = 2000 * 3000 * 4 = 24MB

---

### Algorithm Details

#### Split Line Calculation

**Paper Mode**:
```typescript
const paperHeightPx = (paperSizeMM / 25.4) * DPI
let y = paperHeightPx
while (y < imageHeight) {
  splitLines.push(y)
  y += paperHeightPx
}
```

**Height Mode**:
```typescript
let y = heightPx
while (y < imageHeight) {
  splitLines.push(y)
  y += heightPx
}
```

**Count Mode**:
```typescript
const partHeight = Math.ceil(imageHeight / count)
for (let i = 1; i < count; i++) {
  splitLines.push(partHeight * i)
}
```

**Manual Mode**:
```typescript
// User clicks at Y position
const rect = image.getBoundingClientRect()
const scale = image.offsetHeight / actualImageHeight
const y = Math.round((clickY - rect.top) / scale)
splitLines.push(y)
splitLines.sort((a, b) => a - b)
```

---

#### Canvas Splitting

```typescript
const createPart = (startY: number, height: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = imageWidth
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, startY, imageWidth, height, 0, 0, imageWidth, height)
  return canvas
}

splitLines.forEach((y) => {
  const partHeight = y - lastY
  const canvas = createPart(lastY, partHeight)
  parts.push(canvas.toDataURL('image/png'))
  lastY = y
})

// Last part
if (lastY < imageHeight) {
  const partHeight = imageHeight - lastY
  const canvas = createPart(lastY, partHeight)
  parts.push(canvas.toDataURL('image/png'))
}
```

---

## 🐛 Known Limitations

### Browser-Specific Issues

1. **Safari Mobile** (iOS < 15):
   - Canvas size limited to 4096x4096
   - May fail with large images

2. **Chrome Mobile**:
   - Multiple downloads may trigger popup blocker
   - User must allow downloads

3. **Firefox**:
   - Canvas memory warning may appear for large images

---

### Edge Cases

1. **Very Small Images** (< 100px height):
   - Paper mode may not split
   - Manual mode difficult to use

2. **Extremely Large Images** (> 20,000px):
   - May cause browser to freeze
   - Mobile devices may crash

3. **Manual Mode**:
   - Clicking near edges (< 10px) ignored
   - Maximum ~100 split lines (browser performance)

---

## 🚀 Future Improvements

### Planned Features
1. **Overlap Support**
   - Add N pixels of overlap between parts
   - Useful for printing with margins

2. **Custom Paper Sizes**
   - User-defined mm dimensions
   - Save custom presets

3. **Watermark**
   - Add text/image to each part
   - Page numbers

4. **Batch Processing**
   - Upload multiple images
   - Apply same split settings

5. **Preview Zoom**
   - Zoom into split lines
   - Fine-tune manual splits

6. **Export to PDF**
   - Create multi-page PDF
   - Each part = 1 page

---

### Performance Optimizations
1. **Web Workers**
   - Offload canvas operations
   - Prevent UI freezing

2. **Progressive Rendering**
   - Show parts as they're generated
   - Improve perceived performance

3. **Image Compression**
   - Reduce output file sizes
   - Quality slider option

---

## 📱 Mobile Considerations

### Touch Interactions
- **Drop Zone**: Also acts as tap zone (no drag required)
- **Manual Mode**: Tap to add split (no click terminology)
- **Zoom Gesture**: Native browser zoom on preview
- **Scroll**: Smooth scrolling for tall previews

### Mobile-Specific UX
- Larger tap targets (44px minimum)
- Simplified labels ("Remove" → "X" icon on mobile)
- Responsive grid (2 cols → 3 cols → 5 cols)
- Modal-style previews for better focus

---

## 🧪 Testing Checklist

### Functional Tests
- [ ] All 4 split modes work correctly
- [ ] Paper sizes calculate accurate pixel heights
- [ ] Manual split lines can be added/removed
- [ ] Merged download creates correct layout
- [ ] Separate download generates all files
- [ ] Preview updates in real-time

### Edge Case Tests
- [ ] Image smaller than split height
- [ ] Image exactly divisible by split height
- [ ] Very tall image (> 10,000px)
- [ ] Very wide image (> 5,000px)
- [ ] Single pixel height image
- [ ] Manual mode with 50+ split lines

### Browser Tests
- [ ] Chrome (desktop + mobile)
- [ ] Firefox (desktop + mobile)
- [ ] Safari (desktop + iOS)
- [ ] Edge (desktop)

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader announces states
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets ≥ 44x44px

---

## 📊 Usage Analytics (Potential)

### Metrics to Track
- Most popular split mode
- Average number of parts
- Average image size processed
- Download type preference (merged vs separate)
- Paper size popularity (A4 vs A5 vs B5)

### User Insights
- Do users try multiple modes before downloading?
- How many manual split lines on average?
- What DPI settings are most common?

---

## 🔒 Privacy & Security

### Data Handling
- **No Server Uploads**: All processing in browser
- **No Storage**: Files not saved anywhere
- **No Tracking**: No analytics by default
- **No Cookies**: Stateless operation

### User Guarantees
- Images never leave device
- No image data in browser cache
- URLs are object URLs (temporary)
- Memory freed after download

---

## 📚 Code Architecture

### File Structure
```
app/tools/image-splitter/
├── page.tsx                    # Metadata + wrapper
├── components/
│   └── ImageSplitterClient.tsx # Main component
└── SPECIFICATION.md            # This file
```

### State Management
```typescript
// Core State
const [mode, setMode] = useState<'paper' | 'height' | 'count' | 'manual'>('paper')
const [img, setImg] = useState<HTMLImageElement | null>(null)
const [splitParts, setSplitParts] = useState<string[]>([])

// Mode-specific State
const [paperSize, setPaperSize] = useState<'A4' | 'A5' | 'B5'>('A4')
const [dpi, setDpi] = useState(96)
const [heightPx, setHeightPx] = useState(900)
const [count, setCount] = useState(3)
const [manualSplits, setManualSplits] = useState<number[]>([])
```

---

## 📖 User Documentation

### Quick Start Guide
1. Select split mode (Paper Size recommended for printing)
2. Configure options (paper size, DPI, etc.)
3. Drop or select image
4. Review split preview
5. Choose download type
6. Click Download

### Tips for Best Results
- **For Printing**: Use Paper Size mode with 300 DPI
- **For Social Media**: Use By Count mode (10 parts for carousel)
- **For Presentations**: Use Manual mode to split at key sections
- **For Sharing**: Use Separate downloads for easier distribution

---

## 🎓 Educational Content

### What is DPI?
DPI (Dots Per Inch) determines print quality:
- **72 DPI**: Screen viewing only
- **96 DPI**: Standard web images
- **150 DPI**: Good print quality
- **300 DPI**: Professional print quality

Higher DPI = More pixels = Larger file size

### Paper Size Guide
- **A4**: Standard letter size (most common)
- **A5**: Half of A4 (booklets, notes)
- **B5**: Between A4 and A5 (magazines)

---

## 📝 Changelog

### Version 1.0.0 (Current)
- Initial release
- 4 split modes
- Merged and separate downloads
- Mobile-optimized UI
- Client-side processing

---

## 🤝 Contributing Guidelines

### Code Style
- TypeScript strict mode
- Tailwind CSS for styling
- Lucide React for icons
- No external dependencies for canvas operations

### Component Structure
- Client component ('use client')
- Functional components with hooks
- Ref for image manipulation
- Effect hooks for auto-updates

### Naming Conventions
- camelCase for variables/functions
- PascalCase for components
- UPPER_CASE for constants
- Descriptive names (getPaperHeightPx, not getPH)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0  
**Maintainer**: AI AutoSite Team
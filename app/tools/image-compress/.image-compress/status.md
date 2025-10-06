# Image Compress Tool - Complete Package

## 1. STATUS FILE

```markdown
# Image Compress Tool - Status File v1.0

## 📌 Tool Overview

**Name:** Image Compress
**URL:** /tools/image-compress
**Category:** quick-tools
**Target Users:** Everyone (bloggers, web developers, social media users)
**Language Level:** Elementary English (age 10-12)

## 🎯 Core Features (MVP)

1. **Drag & Drop** - Drop images to compress
2. **Auto Compress** - Instant 60-80% size reduction
3. **Quality Slider** - Choose quality (1-100)
4. **Batch Process** - Multiple files at once
5. **Download All** - ZIP download for multiple files

## 📁 File Structure

app/tools/image-compress/
├── page.tsx # Metadata only
├── components/
│ └── ImageCompressClient.tsx # Main component
└── guide.tsx # Help guide (optional)

## 🔧 Technical Requirements

- **Library:** browser-image-compression
- **No server needed** - 100% client-side
- **Max file size:** 20MB per image
- **Supported formats:** JPG, PNG, WebP
- **Output format:** Same as input
- **Default quality:** 80%

## 💭 User Flow (TinyPNG Style)

1. **Drop images** → See them appear
2. **Auto compress** → Watch size reduce
3. **Download** → Save compressed images

## 🎨 UI Design

[Image Compress]
[Drop zone - "Drop images here"]
[Quality slider: 1 ----●---- 100]
[File list with before/after sizes]
[Download All] button

## 📝 Simple English Copy

Title: "Image Compress"
Subtitle: "Make images smaller, keep quality"
Drop zone: "Drop images here or click to choose"
Quality label: "Quality"
Button: "Download All"
Success: "Saved [X]% space!"
Error: "File too large (max 20MB)"

## 🚫 What NOT to Include

- Format conversion
- Image editing
- Watermarks
- Cloud storage
- User accounts
- Advanced settings

## 📊 Success Metrics

- Compression time: < 2s per image
- Average reduction: 60-80%
- Batch support: Up to 20 files
- Quality retention: Visually identical at 80%
- Works offline: Yes
```

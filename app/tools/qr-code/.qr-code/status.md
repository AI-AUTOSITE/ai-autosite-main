# QR Code Generator Tool - Complete Package

## 1. STATUS FILE

```markdown
# QR Code Generator Tool - Status File v1.0

## 📌 Tool Overview

**Name:** QR Code Maker
**URL:** /tools/qr-code
**Category:** quick-tools
**Target Users:** Everyone (restaurants, shops, personal use)
**Language Level:** Elementary English (age 10-12)

## 🎯 Core Features (MVP)

1. **Text to QR** - Type text, get QR code instantly
2. **URL to QR** - Paste link, get QR code
3. **Size Options** - Small (256px), Medium (512px), Large (1024px)
4. **Download** - Save as PNG image
5. **Real-time Preview** - See changes instantly

## 📁 File Structure

app/tools/qr-code/
├── page.tsx # Metadata only
├── components/
│ └── QRCodeClient.tsx # Main component
└── guide.tsx # Help guide (optional)

## 🔧 Technical Requirements

- **Library:** qrcode (npm package - lightweight)
- **No server needed** - 100% client-side
- **Max input:** 2000 characters
- **Output format:** PNG (downloadable)
- **Default size:** 512px

## 💭 User Flow (3-Second Rule)

1. **Land on page** → See input box immediately
2. **Type/Paste** → QR appears instantly
3. **Click Download** → Save to device

## 🎨 UI Design

[QR Code Maker]
[Text input box - "Type or paste here..."]
[Size: S | M | L]
[QR CODE PREVIEW]
[Download] button

## 📝 Simple English Copy

Title: "QR Code Maker"
Subtitle: "Turn text into QR codes"
Input placeholder: "Type or paste here..."
Size labels: "Small | Medium | Large"
Button: "Download"
Success: "QR code ready!"
Error: "Text too long (max 2000)"

## 🚫 What NOT to Include

- Color customization
- Logo embedding
- Multiple formats
- Analytics tracking
- User accounts
- Batch processing

## 📊 Success Metrics

- Input to QR: < 100ms
- Download click: 1 click
- Mobile responsive: Yes
- Works offline: Yes
- Zero explanation needed: Yes
```

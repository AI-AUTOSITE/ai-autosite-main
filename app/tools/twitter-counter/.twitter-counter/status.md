# Twitter Character Counter Tool - Status File v1.0

## 📌 Tool Overview

**Name:** Twitter Counter
**URL:** /tools/twitter-counter
**Category:** quick-tools
**Target Users:** Twitter users, social media managers, writers
**Language Level:** Elementary English (age 10-12)

## 🎯 Core Features (MVP)

1. **Type Tweet** - Text input area
2. **Live Count** - Real-time character count
3. **Visual Bar** - Progress indicator
4. **Thread Split** - Auto-split long text
5. **Copy Tweet** - One-click copy

## 📁 File Structure

app/tools/twitter-counter/
├── page.tsx # Metadata only
├── components/
│ └── TwitterCounterClient.tsx # Main component
└── guide.tsx # Help guide

## 🔧 Technical Requirements

- **No server needed** - 100% client-side
- **Character limit:** 280 (Twitter standard)
- **Special counting:** URLs = 23 chars
- **Thread support:** Auto-split at 280
- **Real-time:** Update as you type

## 💭 User Flow (3-Second Rule)

1. **Type text** → See count instantly
2. **Watch bar** → Visual feedback
3. **Copy/Split** → Use in Twitter

## 🎨 UI Design

[Twitter Counter]
[Text area - type your tweet here...]
[Visual progress bar]
[Character count: 0/280]

[Copy Tweet] [Clear]

If > 280:
[Auto Thread Split]
Tweet 1: [text...]
Tweet 2: [text...]

## 📝 Simple English Copy

Title: "Twitter Counter"
Subtitle: "Count tweet characters"
Placeholder: "Type your tweet..."
Counter: "X/280 characters"
Buttons: "Copy" | "Clear" | "Split Thread"
Warning: "Too long!"

## 🚫 What NOT to Include

- Twitter API
- Post scheduling
- Image attachments
- Hashtag suggestions
- @mention lookup
- Analytics

## 📊 Success Metrics

- Count accuracy: 100%
- Real-time update: < 50ms
- Thread split: Smart breaks
- Mobile: Optimized
- Copy success: Instant

# YouTube Thumbnail Downloader Tool - Status File v1.0

## 📌 Tool Overview
**Name:** YouTube Thumbnail Downloader
**URL:** /tools/youtube-thumbnail
**Category:** quick-tools
**Target Users:** YouTubers, content creators, marketers, designers
**Language Level:** Elementary English (age 10-12)

## 🎯 Core Features (MVP)
1. **Paste URL** - YouTube video link
2. **Get Thumbnails** - All quality versions
3. **Preview** - Show all sizes
4. **Download** - One-click save
5. **Copy URL** - Direct image link

## 📁 File Structure
app/tools/youtube-thumbnail/
├── page.tsx                    # Metadata only
├── components/
│   └── YoutubeThumbnailClient.tsx # Main component
└── guide.tsx                   # Help guide

## 🔧 Technical Requirements
- **No API needed** - URL parsing only
- **Quality options:** maxres, hq, mq, sd, default
- **Formats:** JPG images
- **No server:** 100% client-side
- **URL patterns:** youtube.com, youtu.be, shorts

## 💭 User Flow (3-Second Rule)
1. **Paste URL** → YouTube link
2. **See thumbnails** → All sizes
3. **Download** → Save image

## 🎨 UI Design
[YouTube Thumbnail Downloader]
[URL input: "Paste YouTube URL..."]
[Get Thumbnails button]

Thumbnails:
[HD (1280x720)] [Download]
[SD (640x480)] [Download]
[Normal (480x360)] [Download]

## 📝 Simple English Copy
Title: "YouTube Thumbnail Downloader"
Subtitle: "Save video thumbnails"
Placeholder: "Paste YouTube URL..."
Button: "Get Thumbnails"
Quality: "HD | SD | Normal"

## 🚫 What NOT to Include
- YouTube API
- Video downloading
- Private videos
- Playlist support
- Channel thumbnails
- Video details

## 📊 Success Metrics
- Parse URL: Instant
- Show thumbnails: < 1s
- Download: Direct
- Mobile: Works
- All qualities: Available
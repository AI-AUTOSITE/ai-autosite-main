# JSON to CSV Tool - Status File v1.0

## 📌 Tool Overview
**Name:** JSON to CSV
**URL:** /tools/json-csv
**Category:** dev-tools
**Target Users:** Data analysts, developers, spreadsheet users
**Language Level:** Elementary English (age 10-12)

## 🎯 Core Features (MVP)
1. **Paste JSON** - Input JSON data
2. **Auto Convert** - Instant CSV output
3. **Download CSV** - Save as .csv file
4. **Copy to Clipboard** - Quick copy
5. **Handle Nested** - Flatten nested objects

## 📁 File Structure
app/tools/json-csv/
├── page.tsx                    # Metadata only
├── components/
│   └── JsonCsvClient.tsx      # Main component
└── guide.tsx                   # Help guide

## 🔧 Technical Requirements
- **No server needed** - 100% client-side
- **Max input:** 5MB JSON
- **Nested handling:** Auto-flatten
- **Array support:** Multiple rows
- **Output:** Standard CSV format

## 💭 User Flow (3-Second Rule)
1. **Paste JSON** → See CSV instantly
2. **Check preview** → Verify format
3. **Download** → Get .csv file

## 🎨 UI Design
[JSON to CSV]
[Split view: JSON input | CSV output]
[Download | Copy buttons]

## 📝 Simple English Copy
Title: "JSON to CSV"
Subtitle: "Convert JSON to spreadsheet"
Placeholder: "Paste JSON here..."
Button: "Download CSV"
Success: "✓ Ready to download"
Error: "Invalid JSON"

## 🚫 What NOT to Include
- Complex options
- Custom delimiters
- Excel export (just CSV)
- File upload (paste only)
- Column selection
- Data transformation

## 📊 Success Metrics
- Conversion: < 500ms
- Download: 1 click
- Copy: Instant
- Mobile: Yes
- Offline: Yes
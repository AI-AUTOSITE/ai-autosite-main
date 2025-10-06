# UUID Generator Tool - Status File v1.0

## 📌 Tool Overview

**Name:** UUID Generator
**URL:** /tools/uuid-generator
**Category:** dev-tools
**Target Users:** Developers, database admins, system architects
**Language Level:** Elementary English (age 10-12)

## 🎯 Core Features (MVP)

1. **Generate UUID** - v4 random UUIDs
2. **Bulk Generate** - Multiple at once
3. **Format Options** - Uppercase/lowercase/no dashes
4. **Copy Individual** - One UUID
5. **Copy All** - Bulk copy

## 📁 File Structure

app/tools/uuid-generator/
├── page.tsx # Metadata only
├── components/
│ └── UuidGeneratorClient.tsx # Main component
└── guide.tsx # Help guide

## 🔧 Technical Requirements

- **No server needed** - crypto.randomUUID()
- **Version:** UUID v4 (random)
- **Format:** Standard, no dashes, uppercase
- **Bulk:** Up to 100 at once
- **Validation:** Check format

## 💭 User Flow (3-Second Rule)

1. **Click generate** → Get UUID
2. **Choose amount** → Bulk generate
3. **Copy** → Use in code

## 🎨 UI Design

[UUID Generator]
[Generate button]
[Generated UUID display]
[Copy button]

Bulk Generate:
[Amount: 10] [Generate]
[List of UUIDs]
[Copy All]

## 📝 Simple English Copy

Title: "UUID Generator"
Subtitle: "Unique identifiers"
Button: "Generate UUID"
Options: "Amount | Format"
Copy: "Copy UUID"

## 🚫 What NOT to Include

- UUID versions 1,2,3,5
- Custom namespaces
- Time-based UUIDs
- MAC address options
- UUID parsing
- History storage

## 📊 Success Metrics

- Generation: Instant
- Copy: One-click
- Mobile: Works
- Format: Flexible
- Bulk: Efficient

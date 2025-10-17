# 🚀 AI AutoSite - Instant Tools Collection

<div align="center">
  
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)
  ![Built with Claude](https://img.shields.io/badge/Built%20with-Claude%20AI-blueviolet)
  
  **Free Forever • No Sign-up Required • Zero Ads • 100% Privacy**
  
  [Live Demo](https://ai-autosite.com) • [Report Bug](https://github.com/ai-autosite/issues) • [Request Feature](https://github.com/ai-autosite/issues)

</div>

## 📋 About The Project

AI AutoSite is an open-source collection of instant web tools designed to be:

- **🚀 Instant** - No installation, no sign-up, just use
- **🔒 Private** - All processing happens in your browser
- **⚡ Fast** - Optimized for speed and efficiency
- **🎨 Modern** - Clean, responsive design that works everywhere
- **♾️ Free** - Forever free, no premium tiers, no ads

## ✨ Features

- **45+ Tools** across 6 categories
- **Zero Configuration** - Works out of the box
- **Mobile Responsive** - Perfect on any device
- **Dark Mode** - Easy on the eyes
- **No Tracking** - Your privacy is respected
- **Offline Ready** - Many tools work without internet

## 🛠️ Tool Categories

- ⚡ **Quick Tools** - Instant tools for everyday tasks
- 🔧 **Developer Tools** - Tools for developers and coders
- 📚 **Learning Hub** - Educational and learning resources
- 🎓 **Study Tools** - AI-powered study assistance
- 💼 **Business Tools** - Professional productivity tools
- 🎨 **Creative Tools** - Design and creative tools

## ⚠️ Important Notes

### Date Inconsistencies

Due to Claude's knowledge cutoff date (January 2025), some dates in the codebase may be incorrect. We are actively correcting these:

- **Correct dates**: July 2025 or later
- **If you find**: January 2025 or earlier in publish dates, it's likely incorrect
- **Status**: Ongoing corrections (as of October 17, 2025)

We appreciate your patience as we update these dates throughout the codebase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository

```bash
git clone https://github.com/ai-autosite.git
cd ai-autosite
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
ai-autosite/
├── app/                  # Next.js App Router
│   ├── tools/           # Individual tool pages
│   ├── api/             # API routes
│   └── page.tsx         # Home page
├── components/          # Reusable components
├── lib/                 # Utility functions
│   └── unified-data.ts  # Tool data management
├── public/              # Static assets
├── styles/              # Global styles
└── .ai-autosite-main/   # AI development guides (see below)
```

## 🎯 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

## 🤖 Built with AI

This project is a showcase of **AI-assisted development**:

- **99% Claude AI** - Extended thinking + Claude Sonnet 4, 4.5, Opus 4.1
- **1% Human Developer** - A Japanese developer with minimal programming knowledge

### How It Works

Every tool in this project is created by:

1. Providing Claude AI with comprehensive development guides
2. Claude generates complete, production-ready code
3. Minimal manual adjustments (if any)

**All development guides are included in `.ai-autosite-main/` folder and are freely reusable!**

### Why Share This?

We believe in transparency and want to show that:

- 🌟 **Anyone can build** - You don't need years of programming experience
- 🤝 **AI is a powerful partner** - Not a replacement, but an amplifier
- 📚 **Knowledge sharing matters** - Our guides can help you build your own projects
- 🌏 **Language barriers disappear** - A Japanese developer building with English AI

## 👨‍💻 About the Developer

**Individual Developer from Japan** 🇯🇵

- 💡 **Background**: Minimal coding knowledge
- 🎯 **Goal**: Create niche tools and achieve monetization
- 🤖 **Method**: AI-assisted development with Claude
- 📚 **Experience**: Built entire tool collection using AI
- 🌟 **Philosophy**: If I can do it, anyone can!

### Claude Custom Instructions (as of October 17, 2025)

The developer uses specific Claude settings optimized for stable, beginner-friendly development.

**📋 Complete Custom Instructions:** See [`CLAUDE_INSTRUCTIONS.md`](.ai-autosite-main/CLAUDE_INSTRUCTIONS.md)

#### Core Principles

1. **Stable Versions Only** - No experimental features
2. **Correct Dates** - Never use knowledge cutoff dates
3. **Extensible Code** - Features are added frequently
4. **Functionality First** - Get it working before perfecting

#### Critical Rules

**❌ Never Use:**
- Next.js 15 (use 14.2.3)
- React 19 (use 18.2.0)
- Tailwind CSS v4 (use v3.4)
- Turbopack or experimental features
- Knowledge cutoff dates (January 2025)

**✅ Always Use:**
- Stable versions with explicit version numbers
- Time tools to get current dates
- Extensible code patterns
- Check existing files before modifying

#### Tech Stack (Frozen)

```json
{
  "dependencies": {
    "next": "14.2.3",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
```

#### Development Setup

- **OS**: Windows 11
- **Editor**: VSCode
- **Version Control**: GitHub Desktop (visual interface)
- **Deployment**: Vercel (one-click deploy)
- **Terminal**: PowerShell / Git Bash

This setup proves that modern web development is accessible to beginners with the right AI assistance and structured guidelines!

## 📚 Development Guides

All our AI development guides are located in the `.ai-autosite-main/` folder:

### Getting Started
- **`CLAUDE_INSTRUCTIONS.md`** - Complete Claude custom instructions (start here!)

### Core Guides
- `master-guide.md` - Overall project philosophy and principles
- `tool-properties-guide.md` - How to define new tools
- `metadata-seo-guide.md` - SEO and metadata standards
- `blog-guide.md` - Blog content creation

### Technical Guides
- `api-usage-guide.md` - API integration patterns
- `api-security-guide.md` - Security best practices
- `ai-tools-guide.md` - AI-powered tools management
- `ux-performance-guide.md` - UX and performance optimization
- `mobile-optimization-guide.md` - Mobile-first development
- `privacy-policy-guide.md` - Privacy protection standards

### 🎁 Free to Use

**All guides are freely reusable** - Copy, adapt, and use them for your own projects:

- ✅ No attribution required (but appreciated!)
- ✅ Modify for your needs
- ✅ Use in commercial projects
- ✅ Share with others

Simply provide these guides to Claude AI (or any AI assistant), and start building!

## 💻 Development Environment

This project was built using a **beginner-friendly setup**.

**📋 Complete Configuration:** See [`CLAUDE_INSTRUCTIONS.md`](.ai-autosite-main/CLAUDE_INSTRUCTIONS.md)

### Quick Overview

**Hardware & OS:**
- Windows 11
- Visual Studio Code

**Tools:**
- GitHub Desktop (visual interface)
- Vercel (one-click deploy)
- Claude AI (Extended Thinking)

**Stack (Stable Versions):**
```json
{
  "dependencies": {
    "next": "14.2.3",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0"
  }
}
```

### Why This Setup?

- **No advanced skills needed** - Visual tools replace command-line expertise
- **Stable and reliable** - Avoid experimental features that break
- **AI does the heavy lifting** - Focus on ideas, not syntax
- **Beginner-friendly** - Perfect for starting your development journey

### Common Commands

**PowerShell:**
```powershell
# Delete build folder
Remove-Item -Path ".next" -Recurse -Force

# Install package
npm install [package-name]@[version]
```

**Git Bash:**
```bash
# Delete build folder
rm -rf .next

# Install package
npm install [package-name]@[version]
```

**📖 For detailed troubleshooting:** See `CLAUDE_INSTRUCTIONS.md`

## 📋 License & Usage

This project is open source and available under the **MIT License**.

### You are free to:

- ✅ **Copy** any tools or code you like
- ✅ **Modify** for your specific needs
- ✅ **Use commercially** without restrictions
- ✅ **Distribute** your modified versions
- ✅ **Use privately** for personal projects

### No need to:

- ❌ Ask for permission
- ❌ Give attribution (but it's appreciated! 😊)
- ❌ Share your modifications (but PRs are welcome!)

## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 💡 Tips for Contributors

- **Start here**: Read `CLAUDE_INSTRUCTIONS.md` in `.ai-autosite-main/` folder
- Use Claude AI to help with development (share the guides!)
- Follow stable versions: Next.js 14, React 18, Tailwind v3
- Test on mobile devices
- Ensure privacy standards are maintained
- Never use knowledge cutoff dates (check with time tools)
- Write extensible code (features are added frequently)

## 🌟 Support

If you find this project useful, please consider:

- ⭐ Giving it a star on GitHub
- 🐛 Reporting bugs or requesting features
- 📝 Contributing to the codebase
- 💬 Sharing it with others who might find it useful
- 🤖 Sharing how you used our AI guides

## 📧 Contact

Project Link: [https://github.com/ai-autosite](https://github.com/ai-autosite)

Website: [https://ai-autosite.com](https://ai-autosite.com)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Hosted on [Vercel](https://vercel.com/)
- **Powered by [Claude AI](https://www.anthropic.com/claude)** - The AI assistant that wrote 99% of this code

---

<div align="center">
  <strong>Made with ❤️ and 🤖</strong>
  <br>
  99% Claude AI + 1% Human Developer from Japan 🇯🇵
  <br>
  <strong>Free • Private • Instant</strong>
</div>
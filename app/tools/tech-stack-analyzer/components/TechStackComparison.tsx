// app/tools/tech-stack-analyzer/components/TechStackComparison.tsx
'use client';

import { useState } from 'react';

// Technical term definitions
const termDefinitions = {
  'fullstack': {
    title: 'Full-Stack Framework',
    desc: 'Like having both a front desk AND a back office in one system. You can build the user interface people see AND the database that stores information, all in one place.',
    example: 'Why it matters: No need to learn separate tools for frontend and backend'
  },
  'ssr': {
    title: 'Server-Side Rendering (SSR)',
    desc: 'Your website is prepared and ready BEFORE visitors arrive, like having meals pre-cooked in a restaurant. This makes Google happy (better SEO) and users see content faster.',
    example: 'Why it matters: Better Google rankings + faster first impression'
  },
  'ssg': {
    title: 'Static Site Generation (SSG)',
    desc: 'Like printing out all your website pages in advance. Super fast because everything is ready to serve immediately, but harder to update frequently.',
    example: 'Why it matters: Lightning-fast websites that cost almost nothing to host'
  },
  'api-routes': {
    title: 'API Routes',
    desc: 'Special pages that don\'t show content but handle data operations (like saving form submissions). Think of them as the "back office" functions of your website.',
    example: 'Why useful: Handle contact forms, user registration, payments all in same project'
  },
  'hmr': {
    title: 'Hot Module Replacement (HMR)',
    desc: 'When you change code, you see results instantly WITHOUT refreshing the page. Like editing a Google Doc - changes appear immediately.',
    example: 'Developer benefit: Change button color → see result in 0.5 seconds'
  },
  'component-islands': {
    title: 'Component Islands',
    desc: 'Imagine a mostly static magazine with a few interactive elements. Most content is fast HTML, with small "islands" of interactive features where needed.',
    example: 'Perfect for: Blogs with interactive comments, landing pages with forms'
  },
  'virtual-dom': {
    title: 'Virtual DOM',
    desc: 'Like having a draft version of your webpage in memory. Changes are made to the draft first, then efficiently applied to the real page.',
    example: 'Why it exists: Makes complex apps with lots of updates run smoothly'
  },
  'bundle': {
    title: 'Bundle Size',
    desc: 'Total size of files users must download to use your website. Smaller = faster loading. Think of it as the weight of your website.',
    example: 'Real impact: 10KB loads instantly, 500KB takes several seconds on mobile'
  },
  'on-demand': {
    title: 'On-Demand Generation',
    desc: 'Only creates what you actually use. Like a smart printer that only prints pages you need, not the entire manual.',
    example: 'Benefit: Faster websites because unused styles/code are never generated'
  },
  'postgresql': {
    title: 'PostgreSQL',
    desc: 'A powerful database system for storing your app\'s information (users, posts, orders, etc.). Like having a smart filing cabinet that can quickly find and organize any data.',
    example: 'Why choose it: Handles complex apps, reliable, and completely free to use'
  },
  'realtime': {
    title: 'Real-time Updates',
    desc: 'Changes appear instantly for everyone using your app. Like Google Docs - when someone types, everyone sees it immediately.',
    example: 'Perfect for: Chat apps, collaborative tools, live dashboards'
  },
  'auth': {
    title: 'Authentication',
    desc: 'User login system - handles sign up, sign in, passwords, "forgot password", etc. Like a digital doorman for your app.',
    example: 'Features: Google/Facebook login, email verification, secure sessions'
  },
  'sql-like': {
    title: 'SQL-like Syntax',
    desc: 'A way to ask your database for information using familiar words. Like asking "show me all users named John" in almost plain English.',
    example: 'Why helpful: Easier to write and understand than complex database code'
  },
  'end-to-end': {
    title: 'End-to-End Type Safety',
    desc: 'Your code editor catches mistakes before they become bugs. If you change how data looks in the backend, it immediately warns about frontend issues.',
    example: 'Benefit: Prevents "undefined" errors and data mismatches at build time'
  },
  'edge': {
    title: 'Edge Computing',
    desc: 'Your website runs on servers close to your users worldwide. Like having local stores instead of shipping everything from one warehouse.',
    example: 'User benefit: Faster loading times regardless of location'
  },
  'functions': {
    title: 'Serverless Functions',
    desc: 'Code that runs only when needed, and you only pay for actual usage. Like calling a taxi instead of owning a car - no maintenance, just pay per ride.',
    example: 'Cost effective: Perfect for contact forms, email sending, payment processing'
  }
};

interface TooltipProps {
  term: string;
  children: React.ReactNode;
}

const TechTerm = ({ term, children }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left,
      y: rect.bottom + 10
    });
    setShowTooltip(true);
  };

  const definition = termDefinitions[term as keyof typeof termDefinitions];

  return (
    <>
      <span
        className="text-cyan-400 underline decoration-dotted cursor-pointer hover:text-cyan-300 hover:bg-cyan-400/10 px-1 py-0.5 rounded transition-colors"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        {children}
      </span>
      
      {showTooltip && definition && (
        <div
          className="fixed z-50 bg-gray-900 border border-white/20 text-white p-4 rounded-lg shadow-xl max-w-xs opacity-95 transition-opacity backdrop-blur-xl"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
        >
          <h4 className="text-cyan-300 font-semibold text-sm mb-2">{definition.title}</h4>
          <p className="text-xs leading-relaxed mb-2 text-gray-300">{definition.desc}</p>
          <div className="text-xs bg-gray-800 text-gray-200 p-2 rounded font-mono border border-gray-700">{definition.example}</div>
        </div>
      )}
    </>
  );
};

const TechStackComparison = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tech Stack Comparison Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/20">
                <th className="text-left py-4 px-6 font-semibold text-white min-w-[120px]">Technology</th>
                <th className="text-left py-4 px-6 font-semibold text-white min-w-[200px]">Key Features</th>
                <th className="text-left py-4 px-6 font-semibold text-white min-w-[180px]">Best Use Cases</th>
                <th className="text-left py-4 px-6 font-semibold text-white min-w-[150px]">Learning Curve</th>
                <th className="text-left py-4 px-6 font-semibold text-white min-w-[200px]">Pros & Cons</th>
              </tr>
            </thead>
            <tbody>
              {/* Next.js */}
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium mb-2 border border-blue-500/30">Framework</div>
                  <div className="text-lg font-bold text-blue-400">Next.js</div>
                </td>
                <td className="py-4 px-6 text-sm leading-relaxed text-gray-300">
                  • <TechTerm term="fullstack">Full-stack</TechTerm> React framework<br/>
                  • Built-in <TechTerm term="ssr">SSR</TechTerm>/<TechTerm term="ssg">SSG</TechTerm><br/>
                  • File-based routing<br/>
                  • <TechTerm term="api-routes">API Routes</TechTerm><br/>
                  • Automatic image optimization<br/>
                  • Edge runtime support
                </td>
                <td className="py-4 px-6 text-sm text-green-400 font-medium leading-relaxed">
                  • SEO-critical websites<br/>
                  • E-commerce sites<br/>
                  • Corporate websites<br/>
                  • Full-stack applications<br/>
                  • Content-heavy sites<br/>
                  • Blogs with dynamic features
                </td>
                <td className="py-4 px-6">
                  <span className="text-orange-400 font-medium">Intermediate</span><br/>
                  <small className="text-gray-500">React + framework concepts</small>
                </td>
                <td className="py-4 px-6 text-sm">
                  <div className="text-green-400 mb-1">✅ Best SEO, zero config, rich ecosystem</div>
                  <div className="text-red-400">❌ Steeper learning curve, heavier builds</div>
                </td>
              </tr>

              {/* Astro */}
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium mb-2 border border-blue-500/30">Framework</div>
                  <div className="text-lg font-bold text-blue-400">Astro</div>
                </td>
                <td className="py-4 px-6 text-sm leading-relaxed text-gray-300">
                  • Static-site focused<br/>
                  • Multi-framework support<br/>
                  • Minimal JavaScript<br/>
                  • <TechTerm term="component-islands">Component Islands</TechTerm><br/>
                  • Native Markdown support<br/>
                  • Content collections
                </td>
                <td className="py-4 px-6 text-sm text-green-400 font-medium leading-relaxed">
                  • Documentation sites<br/>
                  • Blogs & content sites<br/>
                  • Landing pages<br/>
                  • Portfolio websites<br/>
                  • Marketing sites<br/>
                  • Performance-critical sites
                </td>
                <td className="py-4 px-6">
                  <span className="text-orange-400 font-medium">Intermediate</span><br/>
                  <small className="text-gray-500">Unique syntax & concepts</small>
                </td>
                <td className="py-4 px-6 text-sm">
                  <div className="text-green-400 mb-1">✅ Fastest performance, great SEO, lightweight</div>
                  <div className="text-red-400">❌ Limited interactivity, smaller ecosystem</div>
                </td>
              </tr>

              {/* SvelteKit */}
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium mb-2 border border-blue-500/30">Framework</div>
                  <div className="text-lg font-bold text-blue-400">SvelteKit</div>
                </td>
                <td className="py-4 px-6 text-sm leading-relaxed text-gray-300">
                  • Compile-time optimization<br/>
                  • No <TechTerm term="virtual-dom">Virtual DOM</TechTerm><br/>
                  • Intuitive syntax<br/>
                  • Small <TechTerm term="bundle">bundle sizes</TechTerm><br/>
                  • Built-in reactivity<br/>
                  • TypeScript support
                </td>
                <td className="py-4 px-6 text-sm text-green-400 font-medium leading-relaxed">
                  • High-performance apps<br/>
                  • Mobile applications<br/>
                  • Interactive dashboards<br/>
                  • Real-time applications<br/>
                  • Animation-heavy sites<br/>
                  • Lightweight SPAs
                </td>
                <td className="py-4 px-6">
                  <span className="text-orange-400 font-medium">Intermediate</span><br/>
                  <small className="text-gray-500">New concepts to learn</small>
                </td>
                <td className="py-4 px-6 text-sm">
                  <div className="text-green-400 mb-1">✅ Fast runtime, small bundles, great DX</div>
                  <div className="text-red-400">❌ Smaller adoption, fewer resources</div>
                </td>
              </tr>

              {/* Vite */}
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="inline-block px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium mb-2 border border-green-500/30">Build Tool</div>
                  <div className="text-lg font-bold text-blue-400">Vite</div>
                </td>
                <td className="py-4 px-6 text-sm leading-relaxed text-gray-300">
                  • Lightning-fast dev server<br/>
                  • ES Modules native<br/>
                  • Instant <TechTerm term="hmr">HMR</TechTerm><br/>
                  • Framework agnostic<br/>
                  • Plugin ecosystem<br/>
                  • Production optimizations
                </td>
                <td className="py-4 px-6 text-sm text-green-400 font-medium leading-relaxed">
                  • SPAs & admin panels<br/>
                  • Rapid prototyping<br/>
                  • Library development<br/>
                  • Learning projects<br/>
                  • Developer tooling<br/>
                  • Multi-page applications
                </td>
                <td className="py-4 px-6">
                  <span className="text-green-400 font-medium">Beginner</span><br/>
                  <small className="text-gray-500">Minimal configuration</small>
                </td>
                <td className="py-4 px-6 text-sm">
                  <div className="text-green-400 mb-1">✅ Best dev experience, fast, simple setup</div>
                  <div className="text-red-400">❌ Weak SEO without SSR setup</div>
                </td>
              </tr>

              {/* Tailwind CSS */}
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium mb-2 border border-yellow-500/30">Styling</div>
                  <div className="text-lg font-bold text-blue-400">Tailwind CSS</div>
                </td>
                <td className="py-4 px-6 text-sm leading-relaxed text-gray-300">
                  • Utility-first CSS<br/>
                  • Highly customizable<br/>
                  • Component-friendly<br/>
                  • Built-in design system<br/>
                  • JIT compilation<br/>
                  • Plugin ecosystem
                </td>
                <td className="py-4 px-6 text-sm text-green-400 font-medium leading-relaxed">
                  • Rapid UI development<br/>
                  • Design system consistency<br/>
                  • Component libraries<br/>
                  • Responsive design<br/>
                  • Team collaboration<br/>
                  • Prototyping
                </td>
                <td className="py-4 px-6">
                  <span className="text-green-400 font-medium">Beginner</span><br/>
                  <small className="text-gray-500">Learn utility classes</small>
                </td>
                <td className="py-4 px-6 text-sm">
                  <div className="text-green-400 mb-1">✅ Fast development, consistent design, great DX</div>
                  <div className="text-red-400">❌ Large HTML classes, learning curve</div>
                </td>
              </tr>

              {/* Supabase */}
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium mb-2 border border-purple-500/30">Database</div>
                  <div className="text-lg font-bold text-blue-400">Supabase</div>
                </td>
                <td className="py-4 px-6 text-sm leading-relaxed text-gray-300">
                  • <TechTerm term="postgresql">PostgreSQL</TechTerm> + auto APIs<br/>
                  • <TechTerm term="realtime">Real-time</TechTerm> subscriptions<br/>
                  • Built-in <TechTerm term="auth">authentication</TechTerm><br/>
                  • File storage<br/>
                  • Edge functions<br/>
                  • Firebase alternative
                </td>
                <td className="py-4 px-6 text-sm text-green-400 font-medium leading-relaxed">
                  • Chat applications<br/>
                  • Real-time dashboards<br/>
                  • User auth systems<br/>
                  • CRUD applications<br/>
                  • Collaborative tools<br/>
                  • MVP development
                </td>
                <td className="py-4 px-6">
                  <span className="text-green-400 font-medium">Beginner</span><br/>
                  <small className="text-gray-500">If familiar with SQL</small>
                </td>
                <td className="py-4 px-6 text-sm">
                  <div className="text-green-400 mb-1">✅ Easy setup, full-featured, generous free tier</div>
                  <div className="text-red-400">❌ PostgreSQL-only, vendor lock-in</div>
                </td>
              </tr>

              {/* Vercel */}
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6">
                  <div className="inline-block px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium mb-2 border border-red-500/30">Hosting</div>
                  <div className="text-lg font-bold text-blue-400">Vercel</div>
                </td>
                <td className="py-4 px-6 text-sm leading-relaxed text-gray-300">
                  • Zero-config deployment<br/>
                  • <TechTerm term="edge">Edge</TechTerm> functions<br/>
                  • Preview deployments<br/>
                  • Analytics included<br/>
                  • Next.js optimized<br/>
                  • Custom domains
                </td>
                <td className="py-4 px-6 text-sm text-green-400 font-medium leading-relaxed">
                  • Next.js applications<br/>
                  • Frontend projects<br/>
                  • Team collaboration<br/>
                  • Preview environments<br/>
                  • Jamstack sites<br/>
                  • Rapid deployment
                </td>
                <td className="py-4 px-6">
                  <span className="text-green-400 font-medium">Beginner</span><br/>
                  <small className="text-gray-500">Git integration</small>
                </td>
                <td className="py-4 px-6 text-sm">
                  <div className="text-green-400 mb-1">✅ Easy deployment, great performance, excellent DX</div>
                  <div className="text-red-400">❌ Can get expensive, vendor lock-in</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Use Case Recommendations */}
      <div className="mt-16 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Recommended Stacks by Use Case</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <div className="text-xl font-bold mb-3 text-white">E-commerce Platform</div>
            <div className="text-green-400 font-semibold mb-3">Next.js + Tailwind + Supabase + Stripe + Vercel</div>
            <div className="text-sm text-gray-400 leading-relaxed">
              Perfect SEO for product pages, built-in API routes for payments, 
              real-time inventory updates, and seamless checkout experience.
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <div className="text-xl font-bold mb-3 text-white">SaaS Dashboard</div>
            <div className="text-green-400 font-semibold mb-3">Vite + React + Zustand + tRPC + shadcn/ui + Vercel</div>
            <div className="text-sm text-gray-400 leading-relaxed">
              Fast development cycle, complex state management, type-safe APIs, 
              and professional UI components for data visualization.
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <div className="text-xl font-bold mb-3 text-white">Marketing Website</div>
            <div className="text-green-400 font-semibold mb-3">Astro + Tailwind + Markdown + Cloudflare Pages</div>
            <div className="text-sm text-gray-400 leading-relaxed">
              Maximum performance, excellent SEO, easy content management, 
              and cost-effective global distribution.
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <div className="text-xl font-bold mb-3 text-white">Real-time Chat App</div>
            <div className="text-green-400 font-semibold mb-3">Next.js + Supabase + Tailwind + shadcn/ui + Vercel</div>
            <div className="text-sm text-gray-400 leading-relaxed">
              Real-time database subscriptions, user authentication, 
              responsive design, and scalable infrastructure.
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <div className="text-xl font-bold mb-3 text-white">Portfolio/Blog</div>
            <div className="text-green-400 font-semibold mb-3">Astro + Tailwind + Markdown + Cloudflare Pages</div>
            <div className="text-sm text-gray-400 leading-relaxed">
              Fastest loading times, great SEO, easy content updates, 
              and minimal maintenance requirements.
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
            <div className="text-xl font-bold mb-3 text-white">Mobile-First PWA</div>
            <div className="text-green-400 font-semibold mb-3">SvelteKit + Tailwind + Supabase + Vercel</div>
            <div className="text-sm text-gray-400 leading-relaxed">
              Minimal bundle size, smooth animations, offline capability, 
              and native-like performance on mobile devices.
            </div>
          </div>
        </div>
      </div>

      {/* Selection Guidelines */}
      <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h3 className="text-2xl font-bold mb-6 text-white">Selection Guidelines</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-bold text-white mb-2">🚀 Development Speed Priority</div>
            <div className="text-green-400">Vite + React, Supabase</div>
          </div>
          <div>
            <div className="font-bold text-white mb-2">🔍 SEO Critical</div>
            <div className="text-green-400">Next.js, Astro</div>
          </div>
          <div>
            <div className="font-bold text-white mb-2">⚡ Performance Critical</div>
            <div className="text-green-400">SvelteKit, UnoCSS, Bun</div>
          </div>
          <div>
            <div className="font-bold text-white mb-2">🛡️ Type Safety Priority</div>
            <div className="text-green-400">Drizzle ORM, tRPC</div>
          </div>
          <div>
            <div className="font-bold text-white mb-2">👶 Beginner Friendly</div>
            <div className="text-green-400">Next.js, Tailwind, Supabase</div>
          </div>
          <div>
            <div className="font-bold text-white mb-2">💰 Cost Optimization</div>
            <div className="text-green-400">Astro, Cloudflare Pages</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStackComparison;
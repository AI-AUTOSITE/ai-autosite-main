'use client';

import { useState } from 'react';
import { Zap, Code, Database, Cloud, DollarSign, Clock, Rocket, Copy, Check } from 'lucide-react';

interface Recommendation {
  primaryStack: string[];
  database: string[];
  hosting: string[];
  additionalTools: string[];
  estimatedCost: string;
  learningTime: string;
  setupCommands?: string[];
}

const AIStackRecommender = () => {
  const [projectDescription, setProjectDescription] = useState('');
  const [budget, setBudget] = useState('under-20');
  const [timeline, setTimeline] = useState('1-week');
  const [experience, setExperience] = useState('beginner');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [copied, setCopied] = useState(false);

  // Project templates for quick start
  const projectTemplates = [
    {
      title: "Voice to Text",
      description: "I want to build an app that converts audio files to text with editing features",
      icon: <Zap className="w-4 h-4" />
    },
    {
      title: "AI Chat App", 
      description: "Create a chatbot with AI responses and conversation history",
      icon: <Zap className="w-4 h-4" />
    },
    {
      title: "E-commerce",
      description: "Build an online store with payment processing and inventory management",
      icon: <Zap className="w-4 h-4" />
    },
    {
      title: "Dashboard",
      description: "Create a data visualization dashboard with user authentication",
      icon: <Zap className="w-4 h-4" />
    },
    {
      title: "Blog/Portfolio",
      description: "Build a personal website with blog posts and project showcase",
      icon: <Zap className="w-4 h-4" />
    },
    {
      title: "Mobile PWA",
      description: "Create a mobile-first progressive web application",
      icon: <Zap className="w-4 h-4" />
    }
  ];

  const handleAnalyze = async () => {
    if (!projectDescription) return;
    
    setIsAnalyzing(true);
    
    // Mock AI analysis - Replace with actual API call
    setTimeout(() => {
      const isEcommerce = projectDescription.toLowerCase().includes('store') || 
                         projectDescription.toLowerCase().includes('commerce');
      const isAI = projectDescription.toLowerCase().includes('ai') || 
                   projectDescription.toLowerCase().includes('chat');
      const isBlog = projectDescription.toLowerCase().includes('blog') || 
                     projectDescription.toLowerCase().includes('portfolio');
      
      let stack: Recommendation = {
        primaryStack: ["Next.js 14", "TypeScript", "Tailwind CSS"],
        database: ["Supabase"],
        hosting: ["Vercel"],
        additionalTools: [],
        estimatedCost: "$0-20/month",
        learningTime: "2-3 weeks",
        setupCommands: [
          "npx create-next-app@latest my-app --typescript --tailwind --app",
          "cd my-app",
          "npm install @supabase/supabase-js",
          "npm run dev"
        ]
      };

      // Customize based on project type
      if (isEcommerce) {
        stack.additionalTools = ["Stripe", "Resend"];
        stack.estimatedCost = "$25-40/month";
      } else if (isAI) {
        stack.additionalTools = ["OpenAI API", "Pinecone"];
        stack.estimatedCost = "$20-50/month (usage-based)";
      } else if (isBlog) {
        stack.primaryStack = ["Astro", "Markdown", "Tailwind CSS"];
        stack.database = [];
        stack.hosting = ["Cloudflare Pages"];
        stack.estimatedCost = "$0/month";
        stack.learningTime = "1 week";
      }

      // Adjust for experience level
      if (experience === 'advanced') {
        stack.learningTime = "3-5 days";
      } else if (experience === 'intermediate') {
        stack.learningTime = "1-2 weeks";
      }

      setRecommendation(stack);
      setIsAnalyzing(false);
    }, 2000);
  };

  const copySetupCommands = () => {
    if (recommendation?.setupCommands) {
      navigator.clipboard.writeText(recommendation.setupCommands.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Step 1: Describe Project */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">
            1
          </div>
          <h2 className="text-lg font-medium text-white">Describe Your Project</h2>
        </div>

        {/* Quick Templates */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {projectTemplates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => setProjectDescription(template.description)}
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 
                       text-gray-300 rounded-lg text-sm transition-all border border-white/10
                       text-left"
            >
              {template.title}
            </button>
          ))}
        </div>

        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="w-full p-4 bg-white/5 border border-white/10 rounded-xl 
                   text-white placeholder-gray-500 focus:outline-none 
                   focus:border-cyan-400 resize-none transition-colors"
          rows={3}
          placeholder="Example: I want to build an app that converts voice recordings to text..."
        />
      </div>

      {/* Step 2: Quick Settings */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">
            2
          </div>
          <h2 className="text-lg font-medium text-white">Set Your Constraints</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Budget</label>
            <select 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white 
                       focus:outline-none focus:border-cyan-400 transition-colors
                       [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="free">Free</option>
              <option value="under-20">Under $20/month</option>
              <option value="20-100">$20-100/month</option>
              <option value="100-plus">$100+/month</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Timeline</label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white 
                       focus:outline-none focus:border-cyan-400 transition-colors
                       [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="weekend">Weekend project</option>
              <option value="1-week">1 week MVP</option>
              <option value="1-month">1 month</option>
              <option value="3-months">3+ months</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white 
                       focus:outline-none focus:border-cyan-400 transition-colors
                       [&>option]:bg-gray-800 [&>option]:text-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Step 3: Get Recommendation */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-cyan-600/20 rounded-full flex items-center justify-center text-cyan-400 font-bold">
            3
          </div>
          <h2 className="text-lg font-medium text-white">Get Your Stack</h2>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!projectDescription || isAnalyzing}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 
                   text-white font-medium rounded-xl hover:opacity-90 
                   transition-all disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" 
                        stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Get AI Recommendation
            </>
          )}
        </button>
      </div>

      {/* Recommendation Results */}
      {recommendation && (
        <>
          {/* Quick Summary */}
          <div className="bg-green-500/10 rounded-xl border border-green-500/20 p-6 mb-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Your Recommended Stack
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-400">Estimated Cost:</span>
                <p className="text-lg font-semibold text-green-400">
                  {recommendation.estimatedCost}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Time to Learn:</span>
                <p className="text-lg font-semibold text-cyan-400">
                  {recommendation.learningTime}
                </p>
              </div>
            </div>
          </div>

          {/* Tech Stack Details */}
          <div className="space-y-4 mb-6">
            <div className="bg-white/5 rounded-xl border border-white/10 p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" /> Core Framework
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendation.primaryStack.map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-cyan-600/20 
                                             text-cyan-300 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {recommendation.database.length > 0 && (
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4" /> Database
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recommendation.database.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-green-500/20 
                                               text-green-300 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white/5 rounded-xl border border-white/10 p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <Cloud className="w-4 h-4" /> Hosting
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendation.hosting.map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-purple-500/20 
                                             text-purple-300 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {recommendation.additionalTools.length > 0 && (
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Additional Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendation.additionalTools.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-orange-500/20 
                                               text-orange-300 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Start Commands */}
          {recommendation.setupCommands && (
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white">Quick Start Commands</h4>
                <button
                  onClick={copySetupCommands}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all 
                            flex items-center gap-2 ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm text-gray-300">
                {recommendation.setupCommands.map((cmd, idx) => (
                  <div key={idx} className="mb-1">
                    <span className="text-gray-500 mr-2">$</span>
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIStackRecommender;
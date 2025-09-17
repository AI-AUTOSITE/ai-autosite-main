// components/AppConfigManager.tsx
'use client'

import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react'
import { 
  Settings, 
  User, 
  Sparkles, 
  Moon, 
  Sun, 
  Globe,
  Save,
  Check,
  AlertCircle
} from 'lucide-react'

// Configuration Types
export interface AppConfig {
  userLevel: 'beginner' | 'intermediate' | 'advanced'
  preferredAI: 'chatgpt' | 'claude' | 'copilot'
  theme: 'dark' | 'light'
  language: 'en' | 'ja'
  autoSave: boolean
  tokenLimit: number
  showTips: boolean
  compactMode: boolean
  analyticsEnabled: boolean
  features: {
    aiAnalysis: boolean
    advancedMetrics: boolean
    teamSharing: boolean
    exportTemplates: boolean
  }
}

// Default configuration
const defaultConfig: AppConfig = {
  userLevel: 'beginner',
  preferredAI: 'chatgpt',
  theme: 'dark',
  language: 'en',
  autoSave: true,
  tokenLimit: 4000,
  showTips: true,
  compactMode: false,
  analyticsEnabled: true,
  features: {
    aiAnalysis: true,
    advancedMetrics: false,
    teamSharing: false,
    exportTemplates: true
  }
}

// Action types
type ConfigAction = 
  | { type: 'SET_USER_LEVEL'; payload: AppConfig['userLevel'] }
  | { type: 'SET_AI_PLATFORM'; payload: AppConfig['preferredAI'] }
  | { type: 'SET_THEME'; payload: AppConfig['theme'] }
  | { type: 'SET_LANGUAGE'; payload: AppConfig['language'] }
  | { type: 'TOGGLE_AUTO_SAVE' }
  | { type: 'SET_TOKEN_LIMIT'; payload: number }
  | { type: 'TOGGLE_TIPS' }
  | { type: 'TOGGLE_COMPACT_MODE' }
  | { type: 'TOGGLE_ANALYTICS' }
  | { type: 'TOGGLE_FEATURE'; payload: keyof AppConfig['features'] }
  | { type: 'RESET_CONFIG' }
  | { type: 'LOAD_CONFIG'; payload: AppConfig }

// Reducer
function configReducer(state: AppConfig, action: ConfigAction): AppConfig {
  switch (action.type) {
    case 'SET_USER_LEVEL':
      // Auto-adjust features based on user level
      const features = { ...state.features }
      if (action.payload === 'beginner') {
        features.advancedMetrics = false
        features.teamSharing = false
      } else if (action.payload === 'advanced') {
        features.advancedMetrics = true
        features.teamSharing = true
      }
      return { ...state, userLevel: action.payload, features }
    
    case 'SET_AI_PLATFORM':
      return { ...state, preferredAI: action.payload }
    
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    
    case 'TOGGLE_AUTO_SAVE':
      return { ...state, autoSave: !state.autoSave }
    
    case 'SET_TOKEN_LIMIT':
      return { ...state, tokenLimit: action.payload }
    
    case 'TOGGLE_TIPS':
      return { ...state, showTips: !state.showTips }
    
    case 'TOGGLE_COMPACT_MODE':
      return { ...state, compactMode: !state.compactMode }
    
    case 'TOGGLE_ANALYTICS':
      return { ...state, analyticsEnabled: !state.analyticsEnabled }
    
    case 'TOGGLE_FEATURE':
      return {
        ...state,
        features: {
          ...state.features,
          [action.payload]: !state.features[action.payload]
        }
      }
    
    case 'RESET_CONFIG':
      return defaultConfig
    
    case 'LOAD_CONFIG':
      return action.payload
    
    default:
      return state
  }
}

// Context
interface ConfigContextType {
  config: AppConfig
  dispatch: React.Dispatch<ConfigAction>
  saveConfig: () => void
  resetConfig: () => void
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

// Provider Component
export function AppConfigProvider({ children }: { children: ReactNode }) {
  const [config, dispatch] = useReducer(configReducer, defaultConfig)

  // Load config from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('app_config')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        dispatch({ type: 'LOAD_CONFIG', payload: parsed })
      } catch (err) {
        console.error('Failed to load config:', err)
      }
    }
  }, [])

  // Auto-save config changes
  useEffect(() => {
    if (config.autoSave) {
      localStorage.setItem('app_config', JSON.stringify(config))
    }
  }, [config])

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', config.theme === 'dark')
  }, [config.theme])

  const saveConfig = () => {
    localStorage.setItem('app_config', JSON.stringify(config))
  }

  const resetConfig = () => {
    dispatch({ type: 'RESET_CONFIG' })
    localStorage.removeItem('app_config')
  }

  return (
    <ConfigContext.Provider value={{ config, dispatch, saveConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

// Hook to use config
export function useAppConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useAppConfig must be used within AppConfigProvider')
  }
  return context
}

// Settings Panel Component
export function SettingsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { config, dispatch, saveConfig, resetConfig } = useAppConfig()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveConfig()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="text-purple-400" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            ✕
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* User Level */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
              <User size={16} />
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => dispatch({ type: 'SET_USER_LEVEL', payload: level })}
                  className={`p-3 rounded-lg border transition-all capitalize ${
                    config.userLevel === level
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                      : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/30'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Adjusts UI complexity and available features
            </p>
          </div>

          {/* Preferred AI Platform */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
              <Sparkles size={16} />
              Preferred AI Platform
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['chatgpt', 'claude', 'copilot'] as const).map(platform => (
                <button
                  key={platform}
                  onClick={() => dispatch({ type: 'SET_AI_PLATFORM', payload: platform })}
                  className={`p-3 rounded-lg border transition-all capitalize ${
                    config.preferredAI === platform
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                      : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/30'
                  }`}
                >
                  {platform === 'chatgpt' ? 'ChatGPT' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Theme
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: 'SET_THEME', payload: 'dark' })}
                className={`flex-1 p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  config.theme === 'dark'
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                    : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/30'
                }`}
              >
                <Moon size={16} />
                Dark
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_THEME', payload: 'light' })}
                className={`flex-1 p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  config.theme === 'light'
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                    : 'bg-black/20 border-white/10 text-gray-400 hover:bg-black/30'
                }`}
              >
                <Sun size={16} />
                Light
              </button>
            </div>
          </div>

          {/* Token Limit */}
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              AI Token Limit
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1000"
                max="8000"
                step="500"
                value={config.tokenLimit}
                onChange={(e) => dispatch({ type: 'SET_TOKEN_LIMIT', payload: Number(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm text-gray-400 w-16 text-right">
                {config.tokenLimit}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Maximum tokens to send to AI (affects cost)
            </p>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-white">Auto-save settings</span>
              <input
                type="checkbox"
                checked={config.autoSave}
                onChange={() => dispatch({ type: 'TOGGLE_AUTO_SAVE' })}
                className="rounded text-purple-500"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-white">Show helpful tips</span>
              <input
                type="checkbox"
                checked={config.showTips}
                onChange={() => dispatch({ type: 'TOGGLE_TIPS' })}
                className="rounded text-purple-500"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-white">Compact mode</span>
              <input
                type="checkbox"
                checked={config.compactMode}
                onChange={() => dispatch({ type: 'TOGGLE_COMPACT_MODE' })}
                className="rounded text-purple-500"
              />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-white">Analytics & improvements</span>
              <input
                type="checkbox"
                checked={config.analyticsEnabled}
                onChange={() => dispatch({ type: 'TOGGLE_ANALYTICS' })}
                className="rounded text-purple-500"
              />
            </label>
          </div>

          {/* Advanced Features */}
          {config.userLevel !== 'beginner' && (
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Advanced Features</h3>
              <div className="space-y-3">
                {Object.entries(config.features).map(([key, enabled]) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => dispatch({ type: 'TOGGLE_FEATURE', payload: key as keyof AppConfig['features'] })}
                      className="rounded text-purple-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 p-6 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={resetConfig}
            className="px-4 py-2 text-gray-400 hover:text-white transition-all"
          >
            Reset to defaults
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
            >
              {saved ? (
                <>
                  <Check size={16} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
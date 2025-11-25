import { useHotkeys } from 'react-hotkeys-hook'

interface KeyboardShortcutsHandlers {
  onGenerate: () => void
  onCopy: () => void
  onDownload?: () => void
  onClear?: () => void
  onToggleTheme?: () => void
}

export function useKeyboardShortcuts({
  onGenerate,
  onCopy,
  onDownload,
  onClear,
  onToggleTheme,
}: KeyboardShortcutsHandlers) {
  // Generate: Ctrl/Cmd + Enter
  useHotkeys('ctrl+enter, cmd+enter', (e) => {
    e.preventDefault()
    onGenerate()
  }, { enableOnFormTags: true })

  // Copy: Ctrl/Cmd + Shift + C (avoid conflict with browser Ctrl+C)
  useHotkeys('ctrl+shift+c, cmd+shift+c', (e) => {
    e.preventDefault()
    onCopy()
  })

  // Download: Ctrl/Cmd + D
  useHotkeys('ctrl+d, cmd+d', (e) => {
    e.preventDefault()
    onDownload?.()
  })

  // Clear: Escape
  useHotkeys('escape', (e) => {
    e.preventDefault()
    onClear?.()
  })

  // Toggle theme: Ctrl/Cmd + /
  useHotkeys('ctrl+/, cmd+/', (e) => {
    e.preventDefault()
    onToggleTheme?.()
  })
}

export const KEYBOARD_SHORTCUTS = [
  { keys: ['Ctrl', 'Enter'], action: 'Generate Lorem Ipsum', mac: ['Cmd', 'Enter'] },
  { keys: ['Ctrl', 'Shift', 'C'], action: 'Copy to clipboard', mac: ['Cmd', 'Shift', 'C'] },
  { keys: ['Ctrl', 'D'], action: 'Download', mac: ['Cmd', 'D'] },
  { keys: ['Escape'], action: 'Clear output', mac: ['Escape'] },
  { keys: ['Ctrl', '/'], action: 'Toggle dark mode', mac: ['Cmd', '/'] },
]
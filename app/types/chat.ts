export interface ChatMessage {
  id: string
  sender: 'bot' | 'user' | 'system'
  type: 'text' | 'button' | 'error' | 'info'
  content: string
  timestamp: Date
  buttons?: ChatButton[]
}

export interface ChatButton {
  id: string
  label: string
  value: string
  action: string
  nextStep?: string  // Optional: Navigate to specific step
  ariaLabel?: string
  isPrimary?: boolean
  isEscalation?: boolean
  disabled?: boolean
}

export interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  currentStep: string
  userData: UserData
  errorCount: number
  isEscalated: boolean
  conversationStartTime: Date
}

export interface UserData {
  conversationPath: string[]
  [key: string]: any
}

export interface BotScenarioData {
  [key: string]: any
}
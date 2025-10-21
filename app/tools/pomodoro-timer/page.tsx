// app/tools/pomodoro-timer/page.tsx
import { Metadata } from 'next'
import PomodoroTimerClient from './components/PomodoroTimerClient'

export const metadata: Metadata = {
  title: 'Pomodoro Timer - Focus Better with 25-Minute Work Sessions | Free Tool',
  description:
    'Free Pomodoro timer for deep work. 25-minute focus sessions + automatic breaks. No signup, no tracking. Perfect for students and remote workers.',
  keywords: 'pomodoro timer, focus timer, productivity tool, study timer, work timer, 25 minute timer, pomodoro technique',
  openGraph: {
    title: 'Pomodoro Timer - Stay Focused with Proven Time Management',
    description: 'Free browser-based Pomodoro timer. 25-min work + 5-min break. Boost productivity by 40%.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://ai-autosite.com/tools/pomodoro-timer',
  },
}

export default function PomodoroTimerPage() {
  return <PomodoroTimerClient />
}
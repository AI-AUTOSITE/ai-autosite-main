import { Metadata } from 'next'
import AIResumeGenerator from './components/AIResumeGenerator'

export const metadata: Metadata = {
  title: 'AI Resume & Cover Letter Generator - Create Professional Documents | AI AutoSite',
  description: 'Generate tailored resumes and cover letters instantly. No sign-up required. Professional formatting with AI-powered customization for your job applications.',
  keywords: 'resume generator, cover letter generator, AI resume, job application, career tools, CV maker, professional resume',
  openGraph: {
    title: 'AI Resume & Cover Letter Generator - Free Online Tool',
    description: 'Create professional resumes and cover letters instantly with AI assistance.',
    type: 'website',
  }
}

export default function AIResumePage() {
  return <AIResumeGenerator />
}
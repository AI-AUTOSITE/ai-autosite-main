// app/api/ai-resume/route.ts
import Anthropic from '@anthropic-ai/sdk'

// Claude client initialization
const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const name = String(form.get('name') || '').trim()
    const jobTitle = String(form.get('job_title') || '').trim()
    const experience = String(form.get('experience') || '').trim()
    const skills = String(form.get('skills') || '').trim()
    const coverDraft = String(form.get('cover_letter') || '').trim()

    if (!name || !jobTitle || !experience || !skills) {
      return Response.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    // Claude APIが利用可能な場合
    if (anthropic) {
      try {
        const prompt = `Create a professional resume and cover letter for the following person:

Name: ${name}
Target Job Title: ${jobTitle}
Experience: ${experience}
Skills: ${skills}
Cover Letter Notes: ${coverDraft || 'Create a compelling cover letter highlighting their experience and skills'}

Please generate:
1. A well-formatted, ATS-friendly resume that highlights achievements with metrics where possible
2. A compelling cover letter that connects their experience to the target role

Format the output with clear sections using lines and headers. Make it professional and ready to use.`

        const response = await anthropic.messages.create({
          model: 'claude-opus-4-1-20250805', // Claude Opus 4.1最新モデル
          max_tokens: 2000,
          temperature: 0.7,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })

        const result = response.content[0].type === 'text' 
          ? response.content[0].text 
          : 'Failed to generate content'

        return Response.json({ result, aiPowered: true })
        
      } catch (aiError) {
        console.error('Claude API error:', aiError)
        // AIエラーの場合はフォールバック処理へ
      }
    }

    // フォールバック：Claude APIが利用できない場合の基本的なテンプレート生成
    const resume = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                    ${name.toUpperCase()}
                    ${jobTitle}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROFESSIONAL SUMMARY
────────────────────
Experienced ${jobTitle} with expertise in ${skills.split(',').slice(0, 3).join(', ')}. 
Proven track record of delivering high-quality results and driving business success.

PROFESSIONAL EXPERIENCE
────────────────────
${experience}

CORE COMPETENCIES
────────────────────
${skills.split(',').map(skill => `• ${skill.trim()}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

    const coverLetter = `
${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at your organization. With my comprehensive experience and proven expertise in ${skills.split(',').slice(0, 3).join(', ')}, I am confident in my ability to contribute effectively to your team.

${coverDraft || `Throughout my career, I have demonstrated exceptional capabilities in delivering results. My experience includes:

${experience.split('\n').slice(0, 3).map(exp => `• ${exp.trim()}`).join('\n')}`}

I would welcome the opportunity to discuss how my background and skills can contribute to your organization's success.

Sincerely,
${name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

    const result = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    RESUME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${resume}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 COVER LETTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${coverLetter}`

    return Response.json({ result, aiPowered: false })
    
  } catch (error) {
    console.error('Error generating documents:', error)
    return Response.json({ error: 'Failed to generate documents' }, { status: 500 })
  }
}

export async function GET() {
  const hasAI = !!process.env.ANTHROPIC_API_KEY
  return Response.json({ 
    ok: true, 
    service: 'AI Resume Generator API',
    aiEnabled: hasAI,
    model: hasAI ? 'claude-opus-4.1' : 'template-based'
  })
}
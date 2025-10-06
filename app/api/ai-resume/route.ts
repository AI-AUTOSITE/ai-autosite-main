// app/api/ai-resume/route.ts
import Anthropic from '@anthropic-ai/sdk'

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

    // Claude API available
    if (anthropic) {
      try {
        const prompt = `Create a professional resume and cover letter for the following person:

Name: ${name}
Target Job Title: ${jobTitle}
Experience: ${experience}
Skills: ${skills}
${coverDraft ? `Cover Letter Notes: ${coverDraft}` : ''}

Generate a complete, professional package with:

**RESUME**
- Clean, ATS-friendly format
- Professional summary highlighting key strengths
- Experience section with bullet points
- Skills section organized by category
- Use metrics and achievements where possible

**COVER LETTER**
- Professional business format with today's date
- Compelling opening that connects experience to the role
- 2-3 body paragraphs highlighting relevant achievements
- Strong closing with call to action
- Professional signature

Format both documents with clear headers and sections. Make them ready to use immediately.`

        const response = await anthropic.messages.create({
          model: 'claude-3-5-haiku-20241022', // ✅ Haiku使用
          max_tokens: 4000, // ✅ より長い出力用
          temperature: 0.7,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        })

        const result =
          response.content[0].type === 'text'
            ? response.content[0].text
            : 'Failed to generate content'

        return Response.json({
          result,
          aiPowered: true,
          tokens: {
            input: response.usage.input_tokens,
            output: response.usage.output_tokens,
          },
        })
      } catch (aiError) {
        console.error('Claude API error:', aiError)
        // Fallback to template
      }
    }

    // Fallback: Template-based generation
    const resume = `
╔═══════════════════════════════════════════════════╗

                    ${name.toUpperCase()}
                    ${jobTitle}

╚═══════════════════════════════════════════════════╝

PROFESSIONAL SUMMARY
────────────────────────────────────────────────────
Experienced ${jobTitle} with expertise in ${skills.split(',').slice(0, 3).join(', ')}. 
Proven track record of delivering high-quality results and driving business success.

PROFESSIONAL EXPERIENCE
────────────────────────────────────────────────────
${experience}

CORE COMPETENCIES
────────────────────────────────────────────────────
${skills
  .split(',')
  .map((skill) => `• ${skill.trim()}`)
  .join('\n')}

╚═══════════════════════════════════════════════════╝
`

    const coverLetter = `
${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at your organization. With my comprehensive experience and proven expertise in ${skills.split(',').slice(0, 3).join(', ')}, I am confident in my ability to contribute effectively to your team.

${
  coverDraft ||
  `Throughout my career, I have demonstrated exceptional capabilities in delivering results. My experience includes:

${experience
  .split('\n')
  .slice(0, 3)
  .map((exp) => `• ${exp.trim()}`)
  .join('\n')}`
}

I would welcome the opportunity to discuss how my background and skills can contribute to your organization's success.

Sincerely,
${name}

╚═══════════════════════════════════════════════════╝
`

    const result = `╔═══════════════════════════════════════════════════╗
                    RESUME
╚═══════════════════════════════════════════════════╝
${resume}

╔═══════════════════════════════════════════════════╗
                 COVER LETTER
╚═══════════════════════════════════════════════════╝
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
    model: hasAI ? 'claude-3-5-haiku' : 'template-based',
  })
}

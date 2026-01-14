import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export async function generateContentIdeas(params: {
  niche: string
  targetAudience: string
  offer: string
  primaryGoal: string
}) {
  const { niche, targetAudience, offer, primaryGoal } = params

  const prompt = `You are a content strategist for Instagram. Generate 10 short-form educational content ideas for a ${niche} expert targeting ${targetAudience}. 

Their offer is: ${offer}
Their primary goal is: ${primaryGoal}

For each content idea, provide:
- Hook: A compelling opening line (under 15 words)
- Key Teaching: 1-2 clear educational points
- CTA: A call-to-action that drives ${primaryGoal}

Format your response as a JSON array with this exact structure:
[
  {
    "hook": "Your hook here",
    "keyTeaching": "Your teaching points here",
    "cta": "Your CTA here"
  }
]

Make the hooks scroll-stopping and educational. Make the teachings actionable and specific. Make the CTAs clear and compelling.`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert Instagram content strategist who specializes in creating educational content that converts."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("No content generated")
    }

    const parsed = JSON.parse(content)
    return parsed.ideas || []
  } catch (error) {
    console.error("AI generation error:", error)
    // Fallback to mock data if AI fails
    return generateMockContentIdeas(params)
  }
}

function generateMockContentIdeas(params: {
  niche: string
  targetAudience: string
  offer: string
  primaryGoal: string
}) {
  return [
    {
      hook: `The #1 mistake ${params.targetAudience.toLowerCase()} make with ${params.niche.toLowerCase()}`,
      keyTeaching: `Most ${params.targetAudience.toLowerCase()} focus on the wrong metrics. Instead, prioritize these 3 elements: 1) Strategy, 2) Execution, 3) Measurement. This shifts focus from vanity to value.`,
      cta: `Want to master this? DM me "STRATEGY" and I'll show you how.`
    },
    {
      hook: `I wasted 2 years before learning this about ${params.niche.toLowerCase()}`,
      keyTeaching: `The traditional approach to ${params.niche.toLowerCase()} is outdated. Here's what works now: Start with outcomes, not activities. Build systems, not just goals. Measure what matters.`,
      cta: `Ready to fast-track your results? Comment "FAST" below.`
    },
    {
      hook: `Why ${params.targetAudience.toLowerCase()} keep failing at ${params.niche.toLowerCase()}`,
      keyTeaching: `It's not lack of effort. It's lack of clarity. The key is understanding your ideal outcome first, then reverse-engineering the path. Most skip this crucial step.`,
      cta: `Book a call with me and I'll help you get clear. Link in bio.`
    },
    {
      hook: `3 things I wish I knew about ${params.niche.toLowerCase()} starting out`,
      keyTeaching: `1) It's not about the tools, it's about the system. 2) Consistency beats intensity every time. 3) Your network is your biggest asset. These principles never change.`,
      cta: `Follow for more ${params.niche.toLowerCase()} tips!`
    },
    {
      hook: `Stop doing this if you want to grow in ${params.niche.toLowerCase()}`,
      keyTeaching: `Most ${params.targetAudience.toLowerCase()} unknowingly sabotage their progress by: 1) Chasing trends, 2) Comparing to others, 3) Skipping fundamentals. Focus on mastery instead.`,
      cta: `DM me "FOCUS" and I'll send you my foundation checklist.`
    },
    {
      hook: `The ${params.niche.toLowerCase()} secret nobody talks about`,
      keyTeaching: `Success isn't about knowing more. It's about doing more with what you know. The gap between information and implementation is where ${params.targetAudience.toLowerCase()} get stuck.`,
      cta: `Want help bridging that gap? Click the link in my bio.`
    },
    {
      hook: `${params.targetAudience.toLowerCase()}: You're overcomplicating this`,
      keyTeaching: `Simpler approach to ${params.niche.toLowerCase()}: 1) Define your outcome, 2) Identify the critical path, 3) Execute daily. Complexity is the enemy of progress.`,
      cta: `Save this post for later and share it with someone who needs it!`
    },
    {
      hook: `This changed everything for my ${params.niche.toLowerCase()} journey`,
      keyTeaching: `I stopped asking "what should I do?" and started asking "who do I need to become?" The shift in identity drove all my ${params.niche.toLowerCase()} progress.`,
      cta: `DM me "IDENTITY" to learn more about this mindset shift.`
    },
    {
      hook: `The truth about ${params.niche.toLowerCase()} ${params.targetAudience.toLowerCase()} won't tell you`,
      keyTeaching: `Most overnight successes are 10 years in the making. The ${params.offer} results you want come from: 1) Showing up daily, 2) Learning from failure, 3) Adapting quickly.`,
      cta: `Book a call and I'll show you the exact roadmap.`
    },
    {
      hook: `My ${params.niche.toLowerCase()} framework in 60 seconds`,
      keyTeaching: `Step 1: Research deeply. Step 2: Test small. Step 3: Scale what works. Step 4: Document everything. Step 5: Repeat and refine. Simple but not easy.`,
      cta: `Want the detailed version? Comment "FRAMEWORK" and I'll send it to you.`
    }
  ]
}

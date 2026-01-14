import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { generateContentIdeas } from "@/lib/ai"
import { generateLeads } from "@/lib/leads"

export async function POST() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        niche: true,
        targetAudience: true,
        offer: true,
        primaryGoal: true,
      }
    })

    if (!user?.niche || !user?.targetAudience || !user?.offer || !user?.primaryGoal) {
      return NextResponse.json(
        { error: "Please complete onboarding first" },
        { status: 400 }
      )
    }

    // Generate content ideas
    const ideas = await generateContentIdeas({
      niche: user.niche,
      targetAudience: user.targetAudience,
      offer: user.offer,
      primaryGoal: user.primaryGoal,
    })

    // Save content ideas to database
    const savedIdeas = await Promise.all(
      ideas.map((idea: { hook: string; keyTeaching: string; cta: string }) =>
        prisma.contentIdea.create({
          data: {
            userId: session.user.id,
            hook: idea.hook,
            keyTeaching: idea.keyTeaching,
            cta: idea.cta,
          }
        })
      )
    )

    // Generate simulated leads and conversations
    const leads = await generateLeads(
      session.user.id,
      savedIdeas.map(idea => idea.id),
      user.primaryGoal
    )

    return NextResponse.json({
      ideas: savedIdeas,
      leads,
      message: `Generated ${savedIdeas.length} content ideas and ${leads.length} simulated leads`
    })
  } catch (err) {
    console.error("Content generation error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const ideas = await prisma.contentIdea.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ ideas })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const [totalIdeas, totalConversations, totalQualified] = await Promise.all([
      prisma.contentIdea.count({
        where: { userId: session.user.id }
      }),
      prisma.conversation.count({
        where: {
          lead: {
            userId: session.user.id
          }
        }
      }),
      prisma.lead.count({
        where: {
          userId: session.user.id,
          state: "QUALIFIED"
        }
      })
    ])

    return NextResponse.json({
      totalIdeas,
      totalConversations,
      totalQualified,
    })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

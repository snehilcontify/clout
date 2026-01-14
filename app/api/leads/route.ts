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

    const leads = await prisma.lead.findMany({
      where: { userId: session.user.id },
      include: {
        contentIdea: true,
        conversations: {
          orderBy: { timestamp: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ leads })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

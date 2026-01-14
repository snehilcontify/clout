import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const onboardingSchema = z.object({
  niche: z.string().min(1),
  targetAudience: z.string().min(1),
  offer: z.string().min(1),
  primaryGoal: z.enum(["leads", "calls"]),
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = onboardingSchema.parse(body)

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...data,
        onboardedAt: new Date(),
      }
    })

    return NextResponse.json({ user })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: err.issues },
        { status: 400 }
      )
    }

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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        niche: true,
        targetAudience: true,
        offer: true,
        primaryGoal: true,
        onboardedAt: true,
      }
    })

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

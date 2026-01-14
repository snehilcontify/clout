import { prisma } from "./prisma"

const firstNames = ["Sarah", "Mike", "Emma", "David", "Lisa", "James", "Anna", "Robert", "Jennifer", "Michael"]
const lastNames = ["Johnson", "Smith", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]

export async function generateLeads(userId: string, contentIdeaIds: string[], primaryGoal: string) {
  const leads: Array<{
    id: string
    name: string
    state: string
    conversations: unknown[]
  }> = []
  const numLeads = Math.min(contentIdeaIds.length, 10)

  for (let i = 0; i < numLeads; i++) {
    const contentIdeaId = contentIdeaIds[i]
    const leadState = getRandomLeadState()
    const leadName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`

    const lead = await prisma.lead.create({
      data: {
        userId,
        contentIdeaId,
        name: leadName,
        state: leadState,
      }
    })

    // Generate conversations based on lead state
    const conversations = await generateConversations(lead.id, leadState, leadName, primaryGoal)
    
    leads.push({
      ...lead,
      conversations,
    })
  }

  return leads
}

function getRandomLeadState() {
  const states = ["NEW", "ENGAGED", "QUALIFIED"]
  const weights = [0.4, 0.4, 0.2] // 40% new, 40% engaged, 20% qualified
  
  const random = Math.random()
  let cumulative = 0
  
  for (let i = 0; i < states.length; i++) {
    cumulative += weights[i]
    if (random <= cumulative) {
      return states[i]
    }
  }
  
  return "NEW"
}

async function generateConversations(leadId: string, leadState: string, leadName: string, primaryGoal: string) {
  const conversations: Array<{
    sender: string
    message: string
    timestamp: Date
  }> = []
  
  // Base conversation - lead DMs first
  const initialMessages = [
    "Hey! Loved your post, really resonated with me.",
    "This is exactly what I needed to see today. Thanks for sharing!",
    "Can you tell me more about your offer?",
    "I've been struggling with this for a while. How do I get started?",
  ]

  const aiResponses = [
    "Hey {name}! Thanks for reaching out! So glad it resonated with you. What's your current situation?",
    "You're welcome! I'd love to help you. Tell me a bit about your goals.",
    "Absolutely! I have a program that helps with exactly that. Would you be open to a quick chat?",
    "I feel you! Most people struggle there. The good news is there's a proven path. Interested in learning more?",
  ]

  const engagedMessages = [
    "Yes, that would be great! I've been trying to figure this out for months.",
    "I'd love to learn more about your program. How does it work?",
    "That sounds exactly like what I need! What's the next step?",
  ]

  const qualifiedMessages = [
    "Perfect! Let's book a call. I'm excited to work with you!",
    "This is exactly what I've been looking for. How do we get started?",
    "I'm ready to move forward. What do you need from me?",
  ]

  // Add lead's initial message
  conversations.push({
    sender: "lead",
    message: initialMessages[Math.floor(Math.random() * initialMessages.length)],
    timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
  })

  // Add AI response
  conversations.push({
    sender: "ai",
    message: aiResponses[Math.floor(Math.random() * aiResponses.length)].replace("{name}", leadName),
    timestamp: new Date(Date.now() - Math.random() * 86400000 + 3600000),
  })

  // Add more messages based on state
  if (leadState === "ENGAGED" || leadState === "QUALIFIED") {
    conversations.push({
      sender: "lead",
      message: engagedMessages[Math.floor(Math.random() * engagedMessages.length)],
      timestamp: new Date(Date.now() - Math.random() * 43200000),
    })

    conversations.push({
      sender: "ai",
      message: "That's great to hear! Based on what you've shared, I think you'd be a perfect fit for my program. Would you like to hop on a call?",
      timestamp: new Date(Date.now() - Math.random() * 3600000),
    })
  }

  if (leadState === "QUALIFIED") {
    conversations.push({
      sender: "lead",
      message: qualifiedMessages[Math.floor(Math.random() * qualifiedMessages.length)],
      timestamp: new Date(Date.now() - Math.random() * 1800000),
    })

    conversations.push({
      sender: "ai",
      message: primaryGoal === "calls" 
        ? "Awesome! Here's my calendar link: [calendly-link]. Pick a time that works for you. Looking forward to connecting!"
        : "Fantastic! I'll send you some resources to your DM. Feel free to reach out anytime if you have questions!",
      timestamp: new Date(),
    })
  }

  // Save conversations to database
  await prisma.conversation.createMany({
    data: conversations.map(conv => ({
      leadId,
      sender: conv.sender,
      message: conv.message,
      timestamp: conv.timestamp,
    }))
  })

  return await prisma.conversation.findMany({
    where: { leadId },
    orderBy: { timestamp: "asc" },
  })
}

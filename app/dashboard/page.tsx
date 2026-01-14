"use client"

import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ContentIdea {
  id: string
  hook: string
  keyTeaching: string
  cta: string
  createdAt: string
}

interface Lead {
  id: string
  name: string
  state: string
  contentIdea: ContentIdea
  conversations: Array<{
    sender: string
    message: string
    timestamp: string
  }>
}

interface Stats {
  totalIdeas: number
  totalConversations: number
  totalQualified: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "leads">("overview")
  const [stats, setStats] = useState<Stats | null>(null)
  const [ideas, setIdeas] = useState<ContentIdea[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      loadDashboard()
    }
  }, [session, activeTab])

  const loadDashboard = async () => {
    try {
      const [statsRes, ideasRes, leadsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/content/generate"),
        fetch("/api/leads"),
      ])

      const [statsData, ideasData, leadsData] = await Promise.all([
        statsRes.json(),
        ideasRes.json(),
        leadsRes.json(),
      ])

      if (statsData.stats) setStats(statsData.stats)
      if (ideasData.ideas) setIdeas(ideasData.ideas)
      if (leadsData.leads) setLeads(leadsData.leads)
    } catch (err) {
      console.error("Failed to load dashboard:", err)
    }
  }

  const generateContent = async () => {
    setGenerating(true)
    setError("")

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate content")
      }

      await loadDashboard()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setGenerating(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-black dark:text-white">cloutAI</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {session?.user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Tab navigation */}
          <div className="flex gap-2 mb-8 border-b border-zinc-200 dark:border-zinc-800">
            {[
              { id: "overview" as const, label: "Overview" },
              { id: "content" as const, label: "Content Ideas" },
              { id: "leads" as const, label: "Leads" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 dark:border-blue-400 text-black dark:text-white"
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                  Welcome back! 👋
                </h2>

                {/* Stats cards */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        Content Ideas Generated
                      </div>
                      <div className="text-4xl font-bold text-black dark:text-white">
                        {stats.totalIdeas}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        Conversations Started
                      </div>
                      <div className="text-4xl font-bold text-black dark:text-white">
                        {stats.totalConversations}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        Leads Qualified
                      </div>
                      <div className="text-4xl font-bold text-black dark:text-white">
                        {stats.totalQualified}
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate content CTA */}
                <div className="mt-8 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 p-8 rounded-2xl text-white">
                  <h3 className="text-xl font-bold mb-2">Generate New Content</h3>
                  <p className="text-blue-100 mb-6">
                    Get 10 new educational content ideas tailored to your niche and target audience
                  </p>
                  <button
                    onClick={generateContent}
                    disabled={generating}
                    className="bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating ? "Generating..." : "Generate Content Ideas"}
                  </button>
                  {error && (
                    <p className="mt-4 text-sm text-red-200">{error}</p>
                  )}
                </div>

                {/* Recent leads preview */}
                {leads.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                      Recent Leads
                    </h3>
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                      {leads.slice(0, 5).map((lead) => (
                        <div
                          key={lead.id}
                          className="p-4 border-b border-zinc-200 dark:border-zinc-800 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-black dark:text-white">
                                {lead.name}
                              </div>
                              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                {lead.conversations.length} messages
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                lead.state === "QUALIFIED"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                  : lead.state === "ENGAGED"
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400"
                              }`}
                            >
                              {lead.state}
                            </span>
                          </div>
                        </div>
                      ))}
                      {leads.length > 5 && (
                        <button
                          onClick={() => setActiveTab("leads")}
                          className="w-full p-4 text-center text-sm text-blue-600 dark:text-blue-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        >
                          View all {leads.length} leads →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content ideas tab */}
          {activeTab === "content" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Content Ideas
                </h2>
                <button
                  onClick={generateContent}
                  disabled={generating}
                  className="bg-black dark:bg-white text-white dark:text-black font-medium px-4 py-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 text-sm"
                >
                  {generating ? "Generating..." : "Generate New Ideas"}
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {ideas.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 p-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center">
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    No content ideas yet
                  </p>
                  <button
                    onClick={generateContent}
                    disabled={generating}
                    className="bg-black dark:bg-white text-white dark:text-black font-medium px-6 py-3 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    Generate Your First Ideas
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">
                            Hook
                          </div>
                          <p className="text-lg font-semibold text-black dark:text-white">
                            {idea.hook}
                          </p>
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1 uppercase tracking-wider">
                            Key Teaching
                          </div>
                          <p className="text-zinc-700 dark:text-zinc-300">
                            {idea.keyTeaching}
                          </p>
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1 uppercase tracking-wider">
                            CTA
                          </div>
                          <p className="text-zinc-700 dark:text-zinc-300">
                            {idea.cta}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Leads tab */}
          {activeTab === "leads" && (
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                Leads & Conversations
              </h2>

              {leads.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 p-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center">
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    No leads yet. Generate content to start getting leads!
                  </p>
                  <button
                    onClick={() => setActiveTab("content")}
                    className="bg-black dark:bg-white text-white dark:text-black font-medium px-6 py-3 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                  >
                    Generate Content
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                    >
                      {/* Lead header */}
                      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-black dark:text-white">
                              {lead.name}
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                              Generated from: {lead.contentIdea.hook}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              lead.state === "QUALIFIED"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : lead.state === "ENGAGED"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400"
                            }`}
                          >
                            {lead.state}
                          </span>
                        </div>
                      </div>

                      {/* Conversations */}
                      <div className="p-4 space-y-3 bg-zinc-50 dark:bg-zinc-950 max-h-80 overflow-y-auto">
                        {lead.conversations.map((conv, idx) => (
                          <div
                            key={idx}
                            className={`flex ${conv.sender === "ai" ? "justify-start" : "justify-end"}`}
                          >
                            <div
                              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                                conv.sender === "ai"
                                  ? "bg-white dark:bg-zinc-800 text-black dark:text-white border border-zinc-200 dark:border-zinc-700"
                                  : "bg-blue-600 dark:bg-blue-500 text-white"
                              }`}
                            >
                              <p className="text-sm">{conv.message}</p>
                              <p className="text-xs mt-1 opacity-60">
                                {new Date(conv.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

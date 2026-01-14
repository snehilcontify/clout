import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-black dark:text-white">cloutAI</h1>
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/signin"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup"
              className="text-sm font-medium bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-full text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Turn Content Into Leads
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-6 leading-tight">
            Generate Educational Content
            <br />
            <span className="text-blue-600 dark:text-blue-400">That Actually Converts</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            cloutAI uses AI to create 10 scroll-stopping content ideas and simulates 
            real DM conversations so you can see how your content drives leads.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link 
              href="/auth/signup"
              className="w-full sm:w-auto text-base font-semibold bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Start Free Trial
            </Link>
            <button className="w-full sm:w-auto text-base font-semibold border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-8 py-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
              See How It Works
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">AI-Powered Content</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Generate 10 educational content ideas with hooks, teachings, and CTAs tailored to your niche.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Simulated Lead Flow</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                See how your content drives real conversations with mock DMs and lead tracking.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Clear Dashboard</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Track your content ideas, conversations, and qualified leads in one simple dashboard.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

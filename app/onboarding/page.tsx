"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth"
import type { Session } from "next-auth"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    niche: "",
    targetAudience: "",
    offer: "",
    primaryGoal: "leads",
  })

  useEffect(() => {
    // Check if user is authenticated and already onboarded
    auth().then((session: Session | null) => {
      if (!session?.user) {
        router.push("/auth/signin")
      }
    })
  }, [router])

  const handleNext = () => {
    setError("")
    if (step === 1 && !formData.niche.trim()) {
      setError("Please enter your niche")
      return
    }
    if (step === 2 && !formData.targetAudience.trim()) {
      setError("Please enter your target audience")
      return
    }
    if (step === 3 && !formData.offer.trim()) {
      setError("Please enter your offer")
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setError("")
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to save onboarding")
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    {
      title: "What's your niche?",
      subtitle: "This helps us generate content tailored to your expertise",
      field: "niche",
      placeholder: "e.g., Fitness coaching, Marketing consultant, Career coach",
    },
    {
      title: "Who's your target audience?",
      subtitle: "Be specific about who you help",
      field: "targetAudience",
      placeholder: "e.g., Busy professionals aged 30-45, Small business owners",
    },
    {
      title: "What's your offer?",
      subtitle: "What product or service do you sell?",
      field: "offer",
      placeholder: "e.g., 12-week coaching program, $997 consulting package",
    },
    {
      title: "What's your primary goal?",
      subtitle: "What do you want to generate from your content?",
      field: "primaryGoal",
      isRadio: true,
    },
  ]

  const currentStep = steps[step - 1]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black px-4 py-8">
      <div className="max-w-xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
            {currentStep.title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            {currentStep.subtitle}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            {currentStep.isRadio ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, primaryGoal: "leads" })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                    formData.primaryGoal === "leads"
                      ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        formData.primaryGoal === "leads"
                          ? "border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-400"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      {formData.primaryGoal === "leads" && (
                        <div className="w-2 h-2 rounded-full bg-white mx-auto mt-1" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-black dark:text-white">Generate Leads</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Collect email addresses and contact info
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, primaryGoal: "calls" })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                    formData.primaryGoal === "calls"
                      ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        formData.primaryGoal === "calls"
                          ? "border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-400"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      {formData.primaryGoal === "calls" && (
                        <div className="w-2 h-2 rounded-full bg-white mx-auto mt-1" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-black dark:text-white">Book Calls</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Get people to book discovery calls
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <input
                type="text"
                value={formData[currentStep.field as keyof typeof formData] as string}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [currentStep.field]: e.target.value,
                  })
                }
                placeholder={currentStep.placeholder}
                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            )}
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="flex-1 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex-1 bg-black dark:bg-white text-white dark:text-black font-medium py-3 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-black dark:bg-white text-white dark:text-black font-medium py-3 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Complete Setup"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

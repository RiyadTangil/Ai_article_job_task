"use server"

import { generateSummary } from "@/lib/ai/openai"

export async function summarizeArticle(content: string) {
  try {
    const summary = await generateSummary(content)
    return { success: true, summary }
  } catch (error) {
    console.error("Summarization error:", error)
    return {
      success: false,
      error: "Failed to generate summary. Please try again.",
    }
  }
}

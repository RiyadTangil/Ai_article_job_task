interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export async function generateSummary(content: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    // Fallback to mock summary if no API key
    return generateMockSummary(content)
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that creates concise summaries of articles. Provide a clear, informative summary in 2-3 sentences.",
          },
          {
            role: "user",
            content: `Please summarize this article: ${content}`,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data: OpenAIResponse = await response.json()
    return data.choices[0]?.message?.content || generateMockSummary(content)
  } catch (error) {
    console.error("OpenAI API error:", error)
    // Fallback to mock summary on error
    return generateMockSummary(content)
  }
}

function generateMockSummary(content: string): string {
  const sentences = content.split(".").filter((s) => s.trim().length > 0)
  const firstSentence = sentences[0]?.trim() || "This article discusses important topics."
  const wordCount = content.split(" ").length

  return `${firstSentence}. This comprehensive article contains approximately ${wordCount} words and covers key concepts that provide valuable insights for readers interested in the subject matter.`
}

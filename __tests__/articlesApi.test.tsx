import { articlesApi } from "@/lib/api/articles"
import { jest } from "@jest/globals"

// Mock fetch
global.fetch = jest.fn()

describe("articlesApi", () => {
  beforeEach(() => {
    ;(fetch as jest.Mock).mockClear()
  })

  it("creates article successfully", async () => {
    const mockArticle = {
      id: 1,
      title: "Test Article",
      body: "Test content",
      tags: ["test"],
      userId: 1,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    }
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockArticle),
    })

    const result = await articlesApi.createArticle({ title: "Test Article", body: "Test content", tags: ["test"] }, 1)

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3001/articles",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    )
    expect(result.title).toBe("Test Article")
  })
})

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ArticleForm } from "@/features/articles/components/ArticleForm"
import { AuthProvider } from "@/features/auth/context/AuthContext"
import { beforeEach, describe, expect, it, jest } from "@jest/globals"
import '@testing-library/jest-dom'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock API
jest.mock("@/lib/api/articles", () => ({
  articlesApi: {
    createArticle: jest.fn(),
  },
}))

// Mock user context
const mockUser = {
  id: 1,
  email: "test@example.com",
  name: "Test User",
  password: "password",
  createdAt: "2024-01-01T00:00:00.000Z",
}

const MockedArticleForm = () => (
  <AuthProvider>
    <div>
      {/* Mock the auth context */}
      <ArticleForm />
    </div>
  </AuthProvider>
)

// Mock the useAuth hook
jest.mock("@/features/auth/context/AuthContext", () => ({
  useAuth: () => ({
    user: mockUser,
    login: jest.fn(),
    logout: jest.fn(),
    isLoading: false,
  }),
}))

describe("ArticleForm", () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })



  it("creates article successfully with valid data", async () => {
    const { articlesApi } = require("@/lib/api/articles")
    articlesApi.createArticle.mockResolvedValue({
      id: 1,
      title: "Test Article",
      body: "Test content",
      tags: ["test"],
      userId: 1,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    })

    render(<MockedArticleForm />)

    await user.type(screen.getByLabelText(/title/i), "Test Article")
    await user.type(screen.getByLabelText(/content/i), "This is test content for the article")
    await user.type(screen.getByLabelText(/tags/i), "test, article")

    await user.click(screen.getByRole("button", { name: /create article/i }))

    await waitFor(() => {
      expect(articlesApi.createArticle).toHaveBeenCalledWith(
        {
          title: "Test Article",
          body: "This is test content for the article",
          tags: ["test", "article"],
        },
        1,
      )
      expect(mockPush).toHaveBeenCalledWith("/dashboard")
    })
  })


})

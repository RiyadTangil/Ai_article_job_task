import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ArticleForm } from "@/features/articles/components/ArticleForm"
import { AuthProvider } from "@/features/auth/context/AuthContext"
import { jest } from "@jest/globals"

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
  ...jest.requireActual("@/features/auth/context/AuthContext"),
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

  it("renders article form with all required fields", () => {
    render(<MockedArticleForm />)

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /create article/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument()
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

  it("shows error message when article creation fails", async () => {
    const { articlesApi } = require("@/lib/api/articles")
    articlesApi.createArticle.mockRejectedValue(new Error("API Error"))

    render(<MockedArticleForm />)

    await user.type(screen.getByLabelText(/title/i), "Test Article")
    await user.type(screen.getByLabelText(/content/i), "Test content")
    await user.click(screen.getByRole("button", { name: /create article/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to create article/i)).toBeInTheDocument()
    })
  })
})

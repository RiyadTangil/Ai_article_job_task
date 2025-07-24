import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { AuthProvider } from "@/features/auth/context/AuthContext"
import jest from "jest" // Declare the jest variable

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock API
jest.mock("@/lib/api/auth", () => ({
  authApi: {
    login: jest.fn(),
  },
}))

const MockedLoginForm = () => (
  <AuthProvider>
    <LoginForm />
  </AuthProvider>
)

describe("LoginForm", () => {
  it("renders login form with email and password fields", () => {
    render(<MockedLoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
  })

  it("shows error message for invalid credentials", async () => {
    const { authApi } = require("@/lib/api/auth")
    authApi.login.mockResolvedValue(null)

    render(<MockedLoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
  })
})

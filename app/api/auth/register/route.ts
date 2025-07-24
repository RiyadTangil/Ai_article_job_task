import { type NextRequest, NextResponse } from "next/server"
import { registerSchema } from "@/lib/validations/auth"
import { getUserByEmail, createUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    const user = await createUser({ name, email, password })
    const token = await createSession(user.id)

    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    }

    return NextResponse.json({
      user: authUser,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "./db"
import type { User } from "@prisma/client"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken(userId)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })

  return token
}

export async function validateSession(token: string): Promise<AuthUser | null> {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } })
      }
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      avatar: session.user.avatar,
      role: session.user.role,
    }
  } catch {
    return null
  }
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  })
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function createUser(data: {
  email: string
  password: string
  name: string
}): Promise<User> {
  const hashedPassword = await hashPassword(data.password)

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  })
}

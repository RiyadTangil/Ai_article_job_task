// import { apiRequest } from "./client"

import { apiRequest } from "./client"
import type { User, LoginData, SignupData } from "./types"

export const authApi = {
  async login(data: LoginData): Promise<User | null> {
    const users = await apiRequest<User[]>("/users")
    const user = users.find((u) => u.email === data.email && u.password === data.password)
    return user || null
  },

  async signup(data: SignupData): Promise<User> {
    const users = await apiRequest<User[]>("/users")
    const existingUser = users.find((u) => u.email === data.email)

    if (existingUser) {
      throw new Error("User already exists")
    }

    const newUser = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    }

    return apiRequest<User>("/users", {
      method: "POST",
      body: JSON.stringify(newUser),
    })
  },
}

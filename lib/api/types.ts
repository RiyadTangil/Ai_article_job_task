export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

export interface Article {
  id: string
  title: string
  body: string
  tags: string[]
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateArticleData {
  title: string
  body: string
  tags: string[]
}

export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  name: string
}

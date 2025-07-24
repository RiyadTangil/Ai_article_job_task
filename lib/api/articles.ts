import { apiRequest } from "./client"
import type { Article, CreateArticleData } from "./types"

export const articlesApi = {
  async getArticles(userId: string): Promise<Article[]> {
    const articles = await apiRequest<Article[]>("/articles")
    return articles.filter((article) => article.userId === userId)
  },

  async createArticle(data: CreateArticleData, userId: number): Promise<Article> {
    const newArticle = {
      id: Date.now(),
      ...data,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return apiRequest<Article>("/articles", {
      method: "POST",
      body: JSON.stringify(newArticle),
    })
  },

  async deleteArticle(id: string): Promise<void> {
    await apiRequest(`/articles/${id}`, {
      method: "DELETE",
    })
  },

  async getArticle(id: string): Promise<Article> {
    return apiRequest<Article>(`/articles/${id}`)
  },
}

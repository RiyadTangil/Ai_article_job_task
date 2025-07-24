import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Header } from "@/components/Header"
import { ArticleView } from "@/features/articles/components/ArticleView"
import { articlesApi } from "@/lib/api/articles"
import { notFound } from "next/navigation"

interface ArticlePageProps {
  params: {
    id: string
  }
}

// Enable static generation for article pages
export async function generateStaticParams() {
  try {
    // In a real app, you'd fetch all article IDs
    // For now, return empty array to enable ISR
    return []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: ArticlePageProps) {
  try {
    const article = await articlesApi.getArticle(params.id)

    return {
      title: `${article.title} | AI Knowledgebase`,
      description: article.body.substring(0, 160) + "...",
      keywords: article.tags.join(", "),
    }
  } catch {
    return {
      title: "Article Not Found | AI Knowledgebase",
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const articleId = params.id

  if (!articleId) {
    notFound()
  }

  return (
    <ProtectedRoute>
      <Header />
      <ArticleView articleId={articleId} />
    </ProtectedRoute>
  )
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600 // Revalidate every hour

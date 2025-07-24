import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Header } from "@/components/Header"
import { ArticleForm } from "@/features/articles/components/ArticleForm"

export default function NewArticlePage() {
  return (
    <ProtectedRoute>
      <Header />
      <ArticleForm />
    </ProtectedRoute>
  )
}

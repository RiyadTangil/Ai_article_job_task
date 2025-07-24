import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Header } from "@/components/Header"
import { ArticleList } from "@/features/articles/components/ArticleList"

export default function DashboardPage() {
  return (
    <div className="min-h-screen   flex flex-col">
      <ProtectedRoute>
        <Header />
        <ArticleList />
      </ProtectedRoute>
    </div>
  )
}

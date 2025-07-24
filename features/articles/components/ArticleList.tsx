"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/features/auth/context/AuthContext"
import { articlesApi } from "@/lib/api/articles"
import type { Article } from "@/lib/api/types"
import { formatDate, formatReadingTime, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Search, Tag, Plus, BookOpen, Clock, Calendar, Eye, Filter, Grid3X3, List, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { user } = useAuth()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadArticles()
    }
  }, [user])

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm, selectedTag])

  const loadArticles = async () => {
    if (!user) return

    try {
      const userArticles = await articlesApi.getArticles(user.id)
      setArticles(userArticles)
    } catch (err) {
      setError("Failed to load articles")
    } finally {
      setIsLoading(false)
    }
  }

  const filterArticles = () => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.body.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedTag) {
      filtered = filtered.filter((article) =>
        article.tags.some((tag) => tag.toLowerCase().includes(selectedTag.toLowerCase())),
      )
    }

    setFilteredArticles(filtered)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await articlesApi.deleteArticle(id)
      setArticles(articles.filter((article) => article.id !== id))
      setDeleteDialogOpen(false)
      setArticleToDelete(null)
    } catch (err) {
      setError("Failed to delete article")
    } finally {
      setDeletingId(null)
    }
  }

  const getAllTags = () => {
    const tags = new Set<string>()
    articles.forEach((article) => {
      article.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Articles</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <Button onClick={loadArticles} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Knowledge Base</h1>
            <p className="text-gray-600">Organize and manage your articles with AI-powered insights</p>
          </div>
          <Button
            asChild
            className="mt-4 md:mt-0 bg-[#e21b70] hover:bg-pink-700 text-white font-semibold"
          >
            <Link href="/articles/new">
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
                <p className="text-sm text-gray-600">Total Articles</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getAllTags().length}</p>
                <p className="text-sm text-gray-600">Unique Tags</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12.5K</p>
                <p className="text-sm text-gray-600"></p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(articles.reduce((acc, article) => acc + article.body.split(" ").length, 0) / 200)}
                </p>
                <p className="text-sm text-gray-600">Total Read Time (min)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All tags</option>
                  {getAllTags().map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              <Separator orientation="vertical" className="h-8" />

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Articles */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-gray-300 text-8xl mb-6">📚</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {articles.length === 0 ? "No articles yet" : "No articles match your search"}
              </h3>
              <p className="text-gray-600 mb-8">
                {articles.length === 0
                  ? "Create your first article to get started with your knowledge base!"
                  : "Try adjusting your search terms or filters to find what you're looking for."}
              </p>
              {articles.length === 0 && (
                <Button
                  asChild
                  className="bg-[#e21b70] hover:bg-pink-700 text-white font-semibold"
                >
                  <Link href="/articles/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Article
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div
            className={cn(viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4")}
          >
            {filteredArticles.map((article) => {
              const wordCount = article.body.split(" ").length
              const readingTime = formatReadingTime(wordCount)
              const isDeleting = deletingId === article.id

              return viewMode === "grid" ? (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Link href={`/articles/${article.id}`} className="flex-1">
                        <h3 className="text-xl font-bold group-hover:text-[#e21b70] text-[#e21b70] transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                      </Link>
                      <AlertDialog open={deleteDialogOpen && articleToDelete === article.id} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setArticleToDelete(null) }}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setDeleteDialogOpen(true); setArticleToDelete(article.id) }}
                            className="text-gray-400 hover:text-red-600"
                            disabled={isDeleting}
                          >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Article</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this article? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(article.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">{article.body.substring(0, 150)}...</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.tags.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{readingTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={article.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/articles/${article.id}`}>
                        <h3 className="text-xl font-bold group-hover:text-[#e21b70] text-[#e21b70] transition-colors mb-2">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-4 line-clamp-2">{article.body.substring(0, 200)}...</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{readingTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{wordCount} words</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-6">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <AlertDialog open={deleteDialogOpen && articleToDelete === article.id} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setArticleToDelete(null) }}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setDeleteDialogOpen(true); setArticleToDelete(article.id) }}
                            className="text-gray-400 hover:text-red-600"
                            disabled={isDeleting}
                          >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Article</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this article? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(article.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

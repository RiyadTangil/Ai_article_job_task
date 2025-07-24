"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { articlesApi } from "@/lib/api/articles"
import { summarizeArticle } from "@/app/actions/summarize"
import type { Article } from "@/lib/api/types"
import { formatDate, formatReadingTime, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  Clock,
  Calendar,
  BookOpen,
  Share2,
  Bookmark,
  Eye,
  ThumbsUp,
  MessageCircle,
} from "lucide-react"

interface ArticleViewProps {
  articleId: string
}

export function ArticleView({ articleId }: ArticleViewProps) {
  const [article, setArticle] = useState<Article | null>(null)
  const [summary, setSummary] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(42)
  const [views, setViews] = useState(1234)
  const router = useRouter()

  useEffect(() => {
    loadArticle()
  }, [articleId])

  const loadArticle = async () => {
    try {
      const articleData = await articlesApi.getArticle(articleId)
      setArticle(articleData)
      // Simulate view increment
      setViews((prev) => prev + 1)
    } catch (err) {
      setError("Failed to load article")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSummarize = async () => {
    if (!article) return

    setIsSummarizing(true)
    setError("")

    try {
      const result = await summarizeArticle(article.body)
      if (result.success) {
        setSummary(result.summary || "")
      } else {
        setError(result.error || "Failed to generate summary")
      }
    } catch (err) {
      setError("Failed to generate summary. Please try again.")
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleCopySummary = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.body.substring(0, 200) + "...",
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleLike = () => {
    setLikes((prev) => (isBookmarked ? prev - 1 : prev + 1))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-8"></div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="h-12 bg-gray-200 rounded-md w-3/4 mb-4"></div>
              <div className="flex gap-2 mb-6">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-14"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
            <div className="text-red-600 text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const wordCount = article.body.split(" ").length
  const readingTime = formatReadingTime(wordCount)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Button>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share article</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBookmark}
                      className={cn(isBookmarked && "text-yellow-600")}
                    >
                      <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bookmark article</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Article Header */}
            <div className="p-8 pb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold mb-6 leading-tight">{article.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{readingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">{wordCount} words</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{views.toLocaleString()} views</span>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                  {article.body}
                </div>
              </div>

              {/* Article Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleLike} className="text-gray-600 hover:text-red-600">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      12 Comments
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500">Last updated: {formatDate(article.updatedAt)}</div>
                </div>
              </div>
            </div>
          </article>

          {/* AI Summary Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">AI Summary</h3>
                    <p className="text-white/80 text-sm">Get a quick overview powered by AI</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {summary && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCopySummary}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{copied ? "Copied!" : "Copy summary"}</TooltipContent>
                    </Tooltip>
                  )}

                  <Button
                    onClick={handleSummarize}
                    disabled={isSummarizing}
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isSummarizing ? "Generating..." : "Summarize"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {isSummarizing && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-purple-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent"></div>
                    <span className="text-sm font-medium">Analyzing content with AI...</span>
                  </div>
                  <div className="space-y-3">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-3/4"></div>
                    </div>
                    <div className="animate-pulse delay-100">
                      <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-1/2"></div>
                    </div>
                    <div className="animate-pulse delay-200">
                      <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <div className="text-red-500">⚠️</div>
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              )}

              {summary && !isSummarizing && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900 mb-2">AI-Generated Summary</h4>
                      <p className="text-gray-800 leading-relaxed">{summary}</p>
                      <div className="mt-3 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full inline-block">
                        ✨ Generated by AI
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!summary && !isSummarizing && !error && (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Ready to summarize</p>
                  <p className="text-sm">
                    Click the "Summarize" button to generate an AI-powered summary of this article.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Articles Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <h4 className="font-medium text-gray-900 mb-2">Sample Related Article {i}</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    This is a sample related article that would appear here based on similar tags or content...
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>5 min read</span>
                    <span>•</span>
                    <span>2 days ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

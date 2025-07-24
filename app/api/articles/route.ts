import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const articles = await prisma.article.findMany()
    return NextResponse.json(articles)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    const { title, body, excerpt, tags, published, userId } = requestBody

    // Basic validation
    if (!title || !body || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const article = await prisma.article.create({
      data: {
        title,
        body,
        excerpt,
        tags: tags || [],
        published: published || false,
        readingTime: Math.ceil(body.split(' ').length / 200), // Rough estimate
        userId,
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
} 
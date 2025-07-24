import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({ where: { id: params.id } })
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(article)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.article.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
} 
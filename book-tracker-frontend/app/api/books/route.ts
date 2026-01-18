import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { Book } from "@/lib/types"

export async function GET() {
  try {
    const db = await getDatabase()
    const books = await db
      .collection<Book>("books")
      .find({})
      .sort({ dateAdded: -1 })
      .toArray()

    // Convert ObjectId to string for each book
    const serializedBooks = books.map((book) => ({
      ...book,
      _id: book._id.toString(),
    }))

    return NextResponse.json(serializedBooks)
  } catch (error) {
    console.error("Failed to fetch books:", error)
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()

    const newBook = {
      ...body,
      dateAdded: new Date().toISOString(),
      currentPage: body.currentPage || 0,
      status: body.status || "not-started",
      quotes: body.quotes || [],
    }

    const result = await db.collection("books").insertOne(newBook)

    return NextResponse.json({
      ...newBook,
      _id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Failed to create book:", error)
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    )
  }
}

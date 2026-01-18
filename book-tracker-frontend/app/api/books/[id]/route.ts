import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const book = await db
      .collection("books")
      .findOne({ _id: new ObjectId(id) })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...book,
      _id: book._id.toString(),
    })
  } catch (error) {
    console.error("Failed to fetch book:", error)
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const body = await request.json()

    // Remove _id from body if present
    const { _id, ...updateData } = body

    // If status changed to completed, set dateFinished
    if (updateData.status === "completed" && !updateData.dateFinished) {
      updateData.dateFinished = new Date().toISOString()
    }

    // If status changed to reading and no dateStarted, set it
    if (updateData.status === "reading" && !updateData.dateStarted) {
      updateData.dateStarted = new Date().toISOString()
    }

    const result = await db
      .collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update book:", error)
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const result = await db
      .collection("books")
      .deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete book:", error)
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    )
  }
}

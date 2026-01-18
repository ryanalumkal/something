"use client"

import { useState, useEffect, useMemo } from "react"
import useSWR from "swr"
import { Book, BookFormData, ReadingStatus } from "@/lib/types"
import { BookGrid } from "@/components/book-grid"
import { StatusFilter } from "@/components/status-filter"
import { BookDetailModal } from "@/components/book-detail-modal"
import { AddBookModal } from "@/components/add-book-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, BookOpen, Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Loading = () => null

export default function HomePage() {
  const searchParams = useSearchParams()
  const {
    data: books = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Book[]>("/api/books", fetcher)

  const [selectedStatus, setSelectedStatus] = useState<ReadingStatus | "all">(
    "all"
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Calculate book counts per status
  const bookCounts = useMemo(() => {
    const counts: Record<ReadingStatus | "all", number> = {
      all: books.length,
      "not-started": 0,
      reading: 0,
      completed: 0,
      "on-hold": 0,
      dnf: 0,
    }

    books.forEach((book) => {
      counts[book.status]++
    })

    return counts
  }, [books])

  // Filter books based on status and search
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesStatus =
        selectedStatus === "all" || book.status === selectedStatus
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [books, selectedStatus, searchQuery])

  const handleBookClick = (book: Book) => {
    setSelectedBook(book)
    setIsDetailOpen(true)
  }

  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      await fetch(`/api/books/${updatedBook._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      })
      mutate()
      setIsDetailOpen(false)
    } catch (err) {
      console.error("Failed to update book:", err)
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    try {
      await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      })
      mutate()
    } catch (err) {
      console.error("Failed to delete book:", err)
    }
  }

  const handleAddBook = async (bookData: BookFormData) => {
    try {
      await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      })
      mutate()
    } catch (err) {
      console.error("Failed to add book:", err)
    }
  }

  // Sync selected book with latest data
  useEffect(() => {
    if (selectedBook && books.length > 0) {
      const updated = books.find((b) => b._id === selectedBook._id)
      if (updated) {
        setSelectedBook(updated)
      }
    }
  }, [books, selectedBook])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Book Tracker
                </h1>
                <p className="text-sm text-muted-foreground">
                  {books.length} books in your library
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Book
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Status Filters */}
        <div className="mb-6">
          <StatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            bookCounts={bookCounts}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">
              Loading your library...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-destructive/10 p-4 mb-4">
              <BookOpen className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              Failed to load books
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Please check your database connection and try again.
            </p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => mutate()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Book Grid */}
        {!isLoading && !error && (
          <BookGrid books={filteredBooks} onBookClick={handleBookClick} />
        )}

        {/* No Search Results */}
        {!isLoading &&
          !error &&
          filteredBooks.length === 0 &&
          books.length > 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">
                No books found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
      </div>

      {/* Modals */}
      <Suspense fallback={<Loading />}>
        <BookDetailModal
          book={selectedBook}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onUpdate={handleUpdateBook}
          onDelete={handleDeleteBook}
        />

        <AddBookModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onAdd={handleAddBook}
        />
      </Suspense>
    </main>
  )
}

"use client"

import { Book, STATUS_LABELS, STATUS_COLORS } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, BookOpen } from "lucide-react"

interface BookCardProps {
  book: Book
  onClick: (book: Book) => void
}

export function BookCard({ book, onClick }: BookCardProps) {
  const progressPercent =
    book.totalPages > 0
      ? Math.round((book.currentPage / book.totalPages) * 100)
      : 0

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={() => onClick(book)}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {book.coverImage ? (
          <img
            src={book.coverImage || "/placeholder.svg"}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <BookOpen className="h-16 w-16 text-primary/40" />
          </div>
        )}
        <Badge
          className={`absolute top-2 right-2 ${STATUS_COLORS[book.status]}`}
        >
          {STATUS_LABELS[book.status]}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1 text-balance">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
          {book.author}
        </p>

        {book.genre && (
          <p className="mt-1 text-xs text-muted-foreground">{book.genre}</p>
        )}

        {book.rating && (
          <div className="mt-2 flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= book.rating!
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        )}

        {book.status === "reading" && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1.5" />
            <p className="mt-1 text-xs text-muted-foreground">
              {book.currentPage} of {book.totalPages} pages
            </p>
          </div>
        )}

        {book.status === "completed" && book.totalPages > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {book.totalPages} pages
          </p>
        )}
      </CardContent>
    </Card>
  )
}

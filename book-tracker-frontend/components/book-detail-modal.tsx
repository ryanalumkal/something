"use client"

import { useState, useEffect } from "react"
import { Book, ReadingStatus, STATUS_LABELS } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, BookOpen, Trash2, Plus, X } from "lucide-react"

interface BookDetailModalProps {
  book: Book | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (book: Book) => void
  onDelete: (bookId: string) => void
}

export function BookDetailModal({
  book,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: BookDetailModalProps) {
  const [editedBook, setEditedBook] = useState<Book | null>(null)
  const [newQuote, setNewQuote] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Sync editedBook with book prop when it changes
  useEffect(() => {
    if (book) {
      setEditedBook({ ...book })
    }
  }, [book])

  if (!book || !editedBook) return null

  const progressPercent =
    editedBook.totalPages > 0
      ? Math.round((editedBook.currentPage / editedBook.totalPages) * 100)
      : 0

  const handleUpdate = (field: keyof Book, value: unknown) => {
    setEditedBook((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleSave = () => {
    if (editedBook) {
      onUpdate(editedBook)
    }
  }

  const handleAddQuote = () => {
    if (newQuote.trim()) {
      const quotes = [...(editedBook.quotes || []), newQuote.trim()]
      handleUpdate("quotes", quotes)
      setNewQuote("")
    }
  }

  const handleRemoveQuote = (index: number) => {
    const quotes = (editedBook.quotes || []).filter((_, i) => i !== index)
    handleUpdate("quotes", quotes)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(book._id)
    setIsDeleting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{book.title}</DialogTitle>
          <p className="text-muted-foreground">{book.author}</p>
        </DialogHeader>

        <Tabs defaultValue="progress" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes">Notes & Quotes</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6 pt-4">
            {/* Reading Status */}
            <div className="space-y-2">
              <Label>Reading Status</Label>
              <Select
                value={editedBook.status}
                onValueChange={(value) =>
                  handleUpdate("status", value as ReadingStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABELS) as ReadingStatus[]).map(
                    (status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Page Progress */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Reading Progress</Label>
                <span className="text-sm text-muted-foreground">
                  {progressPercent}% complete
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">
                    Current Page
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={editedBook.totalPages}
                    value={editedBook.currentPage}
                    onChange={(e) =>
                      handleUpdate(
                        "currentPage",
                        Math.min(
                          Number(e.target.value),
                          editedBook.totalPages
                        )
                      )
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">
                    Total Pages
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={editedBook.totalPages}
                    onChange={(e) =>
                      handleUpdate("totalPages", Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <Slider
                value={[editedBook.currentPage]}
                max={editedBook.totalPages || 100}
                step={1}
                onValueChange={([value]) => handleUpdate("currentPage", value)}
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      handleUpdate(
                        "rating",
                        editedBook.rating === star ? undefined : star
                      )
                    }
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (editedBook.rating || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30 hover:text-amber-400/50"
                      }`}
                    />
                  </button>
                ))}
                {editedBook.rating && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {editedBook.rating}/5
                  </span>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedBook.title}
                  onChange={(e) => handleUpdate("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={editedBook.author}
                  onChange={(e) => handleUpdate("author", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={editedBook.genre || ""}
                  onChange={(e) => handleUpdate("genre", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={editedBook.coverImage || ""}
                  onChange={(e) => handleUpdate("coverImage", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Book Cover Preview */}
            <div className="flex justify-center">
              <div className="relative aspect-[2/3] w-32 overflow-hidden rounded-md bg-muted">
                {editedBook.coverImage ? (
                  <img
                    src={editedBook.coverImage || "/placeholder.svg"}
                    alt={`Cover of ${editedBook.title}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Review */}
            <div className="space-y-2">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                value={editedBook.review || ""}
                onChange={(e) => handleUpdate("review", e.target.value)}
                placeholder="Write your thoughts about this book..."
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6 pt-4">
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Personal Notes</Label>
              <Textarea
                id="notes"
                value={editedBook.notes || ""}
                onChange={(e) => handleUpdate("notes", e.target.value)}
                placeholder="Add your reading notes, thoughts, or reminders..."
                rows={4}
              />
            </div>

            {/* Quotes */}
            <div className="space-y-3">
              <Label>Favorite Quotes</Label>
              <div className="flex gap-2">
                <Input
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  placeholder="Add a memorable quote..."
                  onKeyDown={(e) => e.key === "Enter" && handleAddQuote()}
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleAddQuote}
                  disabled={!newQuote.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {(editedBook.quotes || []).length > 0 && (
                <div className="space-y-2 mt-3">
                  {editedBook.quotes?.map((quote, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-2 rounded-md border border-border bg-muted/50 p-3"
                    >
                      <p className="flex-1 text-sm italic text-foreground">
                        "{quote}"
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuote(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? "Deleting..." : "Delete Book"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

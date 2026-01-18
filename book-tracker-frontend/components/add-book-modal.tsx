"use client"

import React from "react"

import { useState } from "react"
import { BookFormData, ReadingStatus, STATUS_LABELS } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (book: BookFormData) => void
}

export function AddBookModal({ isOpen, onClose, onAdd }: AddBookModalProps) {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    coverImage: "",
    genre: "",
    totalPages: 0,
    currentPage: 0,
    status: "not-started",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.author) return

    setIsSubmitting(true)
    await onAdd(formData)
    setIsSubmitting(false)

    // Reset form
    setFormData({
      title: "",
      author: "",
      coverImage: "",
      genre: "",
      totalPages: 0,
      currentPage: 0,
      status: "not-started",
    })
    onClose()
  }

  const handleChange = (field: keyof BookFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="new-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="new-title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-author">
              Author <span className="text-destructive">*</span>
            </Label>
            <Input
              id="new-author"
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-genre">Genre</Label>
              <Input
                id="new-genre"
                value={formData.genre}
                onChange={(e) => handleChange("genre", e.target.value)}
                placeholder="e.g., Fiction, Sci-Fi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pages">Total Pages</Label>
              <Input
                id="new-pages"
                type="number"
                min={0}
                value={formData.totalPages || ""}
                onChange={(e) =>
                  handleChange("totalPages", Number(e.target.value))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-cover">Cover Image URL</Label>
            <Input
              id="new-cover"
              value={formData.coverImage}
              onChange={(e) => handleChange("coverImage", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Reading Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleChange("status", value as ReadingStatus)
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title || !formData.author || isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

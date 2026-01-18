"use client"

import { ReadingStatus, STATUS_LABELS } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface StatusFilterProps {
  selectedStatus: ReadingStatus | "all"
  onStatusChange: (status: ReadingStatus | "all") => void
  bookCounts: Record<ReadingStatus | "all", number>
}

export function StatusFilter({
  selectedStatus,
  onStatusChange,
  bookCounts,
}: StatusFilterProps) {
  const statuses: (ReadingStatus | "all")[] = [
    "all",
    "reading",
    "not-started",
    "completed",
    "on-hold",
    "dnf",
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Button
          key={status}
          variant={selectedStatus === status ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange(status)}
          className="rounded-full"
        >
          {status === "all" ? "All" : STATUS_LABELS[status]}
          <span className="ml-1.5 rounded-full bg-background/20 px-1.5 py-0.5 text-xs">
            {bookCounts[status]}
          </span>
        </Button>
      ))}
    </div>
  )
}

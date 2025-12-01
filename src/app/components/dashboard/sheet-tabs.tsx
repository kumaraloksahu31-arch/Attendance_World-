'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function SheetTabs() {
  return (
    <div className="flex items-center border-t -mx-8 px-4 py-2 bg-background">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Plus className="h-4 w-4" />
        </Button>
        <div className="flex items-center">
            <Button variant="ghost" size="sm" className="h-8 px-4 bg-muted">Sheet1</Button>
        </div>
      </div>
    </div>
  )
}
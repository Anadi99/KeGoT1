'use client'

import type { RecoveryChecklistItem } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle2, ListTodo } from 'lucide-react'
import { useState } from 'react'

interface RecoveryChecklistProps {
  items: RecoveryChecklistItem[]
}

export function RecoveryChecklist({ items }: RecoveryChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    new Set(items.filter(i => i.completed).map(i => i.id))
  )

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(id)) {
      newChecked.delete(id)
    } else {
      newChecked.add(id)
    }
    setCheckedItems(newChecked)
  }

  if (!items || items.length === 0) {
    return null
  }

  const completedCount = checkedItems.size
  const percentComplete = Math.round((completedCount / items.length) * 100)

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="size-5 text-primary" />
          Recovery Checklist
        </CardTitle>
        <CardDescription>
          {completedCount} of {items.length} steps completed · {percentComplete}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-primary whitespace-nowrap">{percentComplete}%</p>
          </div>

          {/* Checklist items */}
          <div className="space-y-2 pt-2">
            {items
              .sort((a, b) => a.order - b.order)
              .map((item) => {
                const isChecked = checkedItems.has(item.id)
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground/30 group-hover:border-primary/50'
                        }`}
                      >
                        {isChecked && (
                          <CheckCircle2 className="size-4 text-primary-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium transition-all ${
                          isChecked
                            ? 'text-muted-foreground line-through'
                            : 'text-foreground'
                        }`}
                      >
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>

          {/* Completion message */}
          {percentComplete === 100 && (
            <div className="pt-2 mt-4 border-t border-primary/20">
              <p className="text-sm font-semibold text-primary text-center">
                Recovery ready! Start resuming your project.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

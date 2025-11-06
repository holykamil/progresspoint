"use client"

import * as React from "react"
import { Calendar } from "./ui/calendar"

export function HomeCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="p-4 bg-card rounded-lg border shadow-sm">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md"
        captionLayout="dropdown"
      />
    </div>
  )
}
import { useState } from 'react'
import { useFetch } from './useFetch'
import { buildMonthGrid } from '../utils/calendar'
import { dateKey, formatMonth, formatTime, formatWeekdayShort, startOfToday } from '../utils/dates'

const toParam = (date) => encodeURIComponent(date.toISOString())

// Data for the calendar widget: this month's grid and the next few events.
export function useCalendar() {
  const [today] = useState(startOfToday)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)

  const { data: monthEvents } = useFetch(`/events?from=${toParam(monthStart)}&to=${toParam(nextMonthStart)}`)
  const { data: upcomingEvents } = useFetch(`/events/upcoming?from=${toParam(today)}`)

  // Turn raw events into exactly what the "Coming up" list shows
  const upcoming = (upcomingEvents ?? []).map((event) => {
    const start = new Date(event.starts_at)
    return {
      id: event.id,
      title: event.title,
      color: event.stage_color,
      dayLabel: dateKey(start) === dateKey(today) ? 'TODAY' : formatWeekdayShort(start),
      dayNumber: start.getDate(),
      meta: [formatTime(start), event.stage_name].filter(Boolean).join(' · '),
    }
  })

  return {
    monthLabel: formatMonth(monthStart),
    cells: buildMonthGrid(monthStart, monthEvents ?? [], today),
    upcoming,
  }
}

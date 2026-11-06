import { dateKey } from './dates'

// Builds the cells for a month grid where weeks start on Monday.
//
// Returns one entry per grid square:
//   - null for the empty squares before the 1st of the month
//   - { day, key, isToday, isPast, colors } for each real day,
//     where colors are the stage colours of that day's events (shown as dots)
export function buildMonthGrid(monthStart, events, today) {
  const year = monthStart.getFullYear()
  const month = monthStart.getMonth()
  // Day 0 of next month is the last day of this month
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // getDay() gives Sunday = 0, Monday = 1... Shift it so Monday = 0, Sunday = 6.
  // That's how many empty squares come before the 1st.
  const emptySquares = (monthStart.getDay() + 6) % 7

  // Group event colours by day, e.g. { '2026-11-09': ['#e8590c'] }
  const colorsByDay = {}
  for (const event of events) {
    const key = dateKey(new Date(event.starts_at))
    colorsByDay[key] = [...(colorsByDay[key] ?? []), event.stage_color]
  }

  const todayKey = dateKey(today)
  const cells = Array(emptySquares).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(new Date(year, month, day))
    cells.push({
      day,
      key,
      isToday: key === todayKey,
      isPast: key < todayKey, // 'YYYY-MM-DD' strings sort in date order
      colors: (colorsByDay[key] ?? []).slice(0, 3), // max 3 dots per day
    })
  }

  return cells
}

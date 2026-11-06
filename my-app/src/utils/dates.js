// Date helpers. All of these use the browser's local time.

// 'YYYY-MM-DD', handy for checking if two dates are the same day
export function dateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

// "Friday, 6 November"
export const formatLongDate = (date) =>
  `${date.toLocaleDateString('en-GB', { weekday: 'long' })}, ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`

// "November 2026"
export const formatMonth = (date) => date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

// "14:00"
export const formatTime = (date) => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

// "MON"
export const formatWeekdayShort = (date) => date.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()

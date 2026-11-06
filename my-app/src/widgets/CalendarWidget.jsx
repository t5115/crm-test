import { useCalendar } from '../hooks/useCalendar'
import './CalendarWidget.css'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function CalendarWidget() {
  const { monthLabel, cells, upcoming } = useCalendar()

  return (
    <section className="card widget">
      <header className="widget-header">
        <h3>Calendar</h3>
        <span className="calendar-month">{monthLabel}</span>
      </header>

      <div className="calendar-grid">
        {WEEKDAYS.map((name) => <span key={name} className="calendar-weekday">{name}</span>)}

        {cells.map((cell, index) =>
          cell ? (
            <div key={cell.key} className={`calendar-day ${cell.isToday ? 'today' : ''} ${cell.isPast ? 'past' : ''}`}>
              <span className="calendar-number">{cell.day}</span>
              <span className="calendar-dots">
                {cell.colors.map((color, i) => <i key={i} style={{ background: color }} />)}
              </span>
            </div>
          ) : (
            <div key={`empty-${index}`} />
          ),
        )}
      </div>

      <h4 className="calendar-subheading">Coming up</h4>
      {upcoming.length === 0 && <p className="calendar-empty">Nothing coming up</p>}
      <ul className="upcoming">
        {upcoming.map((event) => (
          <li key={event.id} className="upcoming-item">
            <span className="upcoming-date">
              {event.dayLabel}
              <strong>{event.dayNumber}</strong>
            </span>
            <span className="upcoming-bar" style={{ background: event.color }} />
            <span>
              <span className="upcoming-title">{event.title}</span>
              <span className="upcoming-meta">{event.meta}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CalendarWidget

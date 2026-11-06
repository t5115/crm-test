import TodoWidget from './TodoWidget'
import CalendarWidget from './CalendarWidget'

// Every widget that can go on the home screen, keyed by user_widgets.widget_key.
// To add a widget: build the component, add it here, then add a user_widgets row for it.
export const WIDGETS = {
  todo: { label: 'To-do', Component: TodoWidget },
  calendar: { label: 'Calendar', Component: CalendarWidget },
}

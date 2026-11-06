import { useState } from 'react'
import Icon from '../components/Icon'
import StageTag from '../components/StageTag'
import { useTasks } from '../hooks/useTasks'
import './TodoWidget.css'

function TodoWidget() {
  const { tasks, openCount, addTask, toggleTask, deleteTask } = useTasks()
  const [draft, setDraft] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!draft.trim()) return
    addTask(draft)
    setDraft('')
  }

  return (
    <section className="card widget">
      <header className="widget-header">
        <h3>To-do</h3>
        <span className="pill">{openCount} open</span>
      </header>

      <ul className="todo-list">
        {tasks.map((task) => (
          <li key={task.id} className={`todo-item ${task.done ? 'done' : ''}`}>
            <label className="todo-check">
              <input type="checkbox" checked={task.done} onChange={() => toggleTask(task)} />
              <span>{task.title}</span>
            </label>
            {task.stage_name && <StageTag name={task.stage_name} color={task.stage_color} />}
            <button className="icon-button" onClick={() => deleteTask(task)} aria-label="Delete task">
              <Icon name="x" size={14} />
            </button>
          </li>
        ))}
      </ul>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a task..."
        />
        <button className="button-dark">Add</button>
      </form>
    </section>
  )
}

export default TodoWidget

import { api } from '../api/client'
import { useFetch } from './useFetch'

// The current user's to-do list.
// Each change is saved to the server, then we re-fetch so the list always matches the database.
export function useTasks() {
  const { data, reload } = useFetch('/tasks')
  const tasks = data ?? []

  async function addTask(title) {
    await api.post('/tasks', { title })
    reload()
  }

  async function toggleTask(task) {
    await api.patch(`/tasks/${task.id}`, { done: !task.done })
    reload()
  }

  async function deleteTask(task) {
    await api.delete(`/tasks/${task.id}`)
    reload()
  }

  const openCount = tasks.filter((task) => !task.done).length

  return { tasks, openCount, addTask, toggleTask, deleteTask }
}

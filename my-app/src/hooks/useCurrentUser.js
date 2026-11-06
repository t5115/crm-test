import { api } from '../api/client'
import { useFetch } from './useFetch'

// The logged-in user (for now always user 1, see server/currentUser.js)
export function useCurrentUser() {
  const { data, setData } = useFetch('/me')

  async function updateUser(fields) {
    setData(await api.patch('/me', fields))
  }

  return { user: data, updateUser }
}

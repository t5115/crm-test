import { api } from '../api/client'
import { useFetch } from './useFetch'

// Which home widgets the user has switched on, in order
export function useWidgets() {
  const { data, reload } = useFetch('/widgets')

  async function setVisible(widgetKey, visible) {
    await api.patch(`/widgets/${widgetKey}`, { visible })
    reload()
  }

  return { widgets: data ?? [], setVisible }
}

import { useFetch } from './useFetch'

// The pipeline stages with their ticket counts (sidebar badges + home cards)
export function useStages() {
  const { data, reload } = useFetch('/stages')
  return { stages: data ?? [], reloadStages: reload }
}

import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'

// Loads JSON from the API and keeps it in state.
// Call reload() to fetch it again after something changes.
export function useFetch(url) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    // If the url changes before the request finishes, ignore the old response
    let ignore = false
    api.get(url)
      .then((result) => { if (!ignore) setData(result) })
      .catch((err) => { if (!ignore) setError(err.message) })
    return () => { ignore = true }
  }, [url, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return { data, setData, error, reload }
}

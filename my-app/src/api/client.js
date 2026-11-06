// Small wrapper around fetch for talking to our API (server/index.js).
// Vite forwards /api/* to the Express server, see vite.config.js.
async function request(method, url, body) {
  const response = await fetch(`/api${url}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!response.ok) throw new Error(`${method} ${url} failed (${response.status})`)

  // Some routes reply with no body (status 201/204 with .end())
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  patch: (url, body) => request('PATCH', url, body),
  delete: (url) => request('DELETE', url),
}

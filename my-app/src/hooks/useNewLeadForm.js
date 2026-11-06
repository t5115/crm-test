import { useState } from 'react'
import { api } from '../api/client'

// Form state for the "New lead" popup. Calls onCreated after the lead is saved.
export function useNewLeadForm(onCreated) {
  const [title, setTitle] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    try {
      await api.post('/tickets', { title, customerName })
      onCreated()
    } finally {
      setSaving(false)
    }
  }

  return { title, setTitle, customerName, setCustomerName, saving, submit }
}

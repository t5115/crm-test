import { useState } from 'react'

// Form state for the profile section on the Settings page
export function useProfileForm(user, onSave) {
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role })
  const [saved, setSaved] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  async function submit(event) {
    event.preventDefault()
    await onSave(form)
    setSaved(true)
  }

  return { form, updateField, saved, submit }
}

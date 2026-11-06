import { useProfileForm } from '../hooks/useProfileForm'
import './Settings.css'

// Opened by clicking your name at the bottom of the sidebar
function Settings({ user, onSave }) {
  return (
    <main className="page">
      <p className="page-eyebrow">Account</p>
      <h1>Settings</h1>
      {/* key resets the form if a different user is loaded */}
      {user && <ProfileForm key={user.id} user={user} onSave={onSave} />}
    </main>
  )
}

function ProfileForm({ user, onSave }) {
  const { form, updateField, saved, submit } = useProfileForm(user, onSave)

  return (
    <form className="card settings-card" onSubmit={submit}>
      <h3>Profile</h3>

      <label className="form-field">
        Name
        <input className="input" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
      </label>

      <label className="form-field">
        Email
        <input className="input" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
      </label>

      <label className="form-field">
        Role
        <input className="input" value={form.role} onChange={(e) => updateField('role', e.target.value)} required />
      </label>

      <div className="settings-actions">
        {saved && <span className="settings-saved">Saved</span>}
        <button className="button-primary">Save changes</button>
      </div>
    </form>
  )
}

export default Settings

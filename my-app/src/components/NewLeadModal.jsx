import { useNewLeadForm } from '../hooks/useNewLeadForm'
import './NewLeadModal.css'

// Popup for adding a lead. Clicking the dark background closes it.
function NewLeadModal({ onClose, onCreated }) {
  const form = useNewLeadForm(() => {
    onCreated()
    onClose()
  })

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* stopPropagation so clicks inside the box don't close it */}
      <form className="card modal" onSubmit={form.submit} onClick={(e) => e.stopPropagation()}>
        <h3>New lead</h3>

        <label className="form-field">
          What's the job?
          <input
            className="input"
            value={form.title}
            onChange={(e) => form.setTitle(e.target.value)}
            placeholder="e.g. Kitchen refit"
            required
            autoFocus
          />
        </label>

        <label className="form-field">
          Customer
          <input
            className="input"
            value={form.customerName}
            onChange={(e) => form.setCustomerName(e.target.value)}
            placeholder="e.g. Patel family"
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="button-outline" onClick={onClose}>Cancel</button>
          <button className="button-primary" disabled={form.saving}>Create lead</button>
        </div>
      </form>
    </div>
  )
}

export default NewLeadModal

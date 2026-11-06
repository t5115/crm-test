import { useState } from 'react'
import Icon from './Icon'
import { WIDGETS } from '../widgets'
import './CustomiseMenu.css'

// The "Customise" button on Home. Opens a list of widgets to switch on/off.
function CustomiseMenu({ widgets, onToggle }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="customise">
      <button className="button-outline" onClick={() => setOpen(!open)}>
        <Icon name="layoutGrid" /> Customise
      </button>

      {open && (
        <div className="card customise-menu">
          <p>Show on home</p>
          {widgets.map((widget) => (
            <label key={widget.widget_key}>
              <input
                type="checkbox"
                checked={widget.visible}
                onChange={() => onToggle(widget.widget_key, !widget.visible)}
              />
              {WIDGETS[widget.widget_key]?.label ?? widget.widget_key}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomiseMenu

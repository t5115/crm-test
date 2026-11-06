import { useState } from 'react'
import Icon from '../components/Icon'
import StatCard from '../components/StatCard'
import CustomiseMenu from '../components/CustomiseMenu'
import NewLeadModal from '../components/NewLeadModal'
import { useWidgets } from '../hooks/useWidgets'
import { formatLongDate } from '../utils/dates'
import { WIDGETS } from '../widgets'
import './Home.css'

function Home({ stages, onNavigate, onLeadCreated }) {
  const { widgets, setVisible } = useWidgets()
  const [showNewLead, setShowNewLead] = useState(false)
  const [todayLabel] = useState(() => formatLongDate(new Date()))

  // Only widgets that are switched on and that the app knows how to draw
  const visibleWidgets = widgets.filter((widget) => widget.visible && WIDGETS[widget.widget_key])

  return (
    <main className="page">
      <header className="home-header">
        <div>
          <p className="page-eyebrow">{todayLabel}</p>
          <h1>Home</h1>
        </div>
        <div className="home-actions">
          <label className="search">
            <Icon name="search" />
            <input placeholder="Search leads, quotes, customers..." />
          </label>
          <button className="button-primary" onClick={() => setShowNewLead(true)}>
            <Icon name="plus" /> New lead
          </button>
        </div>
      </header>

      <div className="stat-grid">
        {stages.map((stage) => (
          <StatCard key={stage.key} stage={stage} onViewAll={() => onNavigate(stage.key)} />
        ))}
      </div>

      <div className="home-section-header">
        <div>
          <h2>Your widgets</h2>
          <p>Pick what you want to see on your home screen.</p>
        </div>
        <CustomiseMenu widgets={widgets} onToggle={setVisible} />
      </div>

      <div className="widget-grid">
        {visibleWidgets.map((widget) => {
          const { Component } = WIDGETS[widget.widget_key]
          return <Component key={widget.widget_key} />
        })}
      </div>

      {showNewLead && <NewLeadModal onClose={() => setShowNewLead(false)} onCreated={onLeadCreated} />}
    </main>
  )
}

export default Home

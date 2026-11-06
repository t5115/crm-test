import Icon from './Icon'
import { stageNote } from '../utils/stageNotes'
import './StatCard.css'

// One of the four summary cards at the top of Home
function StatCard({ stage, onViewAll }) {
  return (
    <div className="card stat-card" style={{ '--stage-color': stage.color }}>
      <div className="stat-card-top">
        <span>{stage.name}</span>
        <span className="stat-card-icon"><Icon name={stage.icon} size={18} /></span>
      </div>
      <p className="stat-card-count">{stage.count}</p>
      <div className="stat-card-bottom">
        <span>{stageNote(stage)}</span>
        <button className="link-button" onClick={onViewAll}>View all →</button>
      </div>
    </div>
  )
}

export default StatCard

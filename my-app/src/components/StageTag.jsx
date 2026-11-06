import './StageTag.css'

// Small coloured label showing a stage name, e.g. "Quote"
function StageTag({ name, color }) {
  return <span className="stage-tag" style={{ '--stage-color': color }}>{name}</span>
}

export default StageTag

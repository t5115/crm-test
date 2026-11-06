import Icon from './Icon'
import './Navbar.css'

function Navbar({ page, onNavigate, stages, user }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">M</span>
        My CRM
      </div>

      <NavItem icon="home" label="Home" active={page === 'home'} onClick={() => onNavigate('home')} />

      <p className="navbar-section">Pipeline</p>
      {stages.map((stage) => (
        <NavItem
          key={stage.key}
          icon={stage.icon}
          label={stage.name}
          count={stage.count}
          color={stage.color}
          active={page === stage.key}
          onClick={() => onNavigate(stage.key)}
        />
      ))}

      <p className="navbar-section">Planning</p>
      <NavItem icon="calendar" label="Calendar" active={page === 'calendar'} onClick={() => onNavigate('calendar')} />

      {/* Clicking your name opens Settings */}
      {user && (
        <button
          className={`navbar-user ${page === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
          title="Settings"
        >
          <span className="navbar-avatar">{user.name[0]}</span>
          <span>
            <strong>{user.name}</strong>
            <small>{user.role}</small>
          </span>
        </button>
      )}
    </nav>
  )
}

function NavItem({ icon, label, count, color, active, onClick }) {
  return (
    <button className={`navbar-link ${active ? 'active' : ''}`} onClick={onClick}>
      <Icon name={icon} />
      {label}
      {count !== undefined && (
        <span className="navbar-count" style={{ '--stage-color': color }}>{count}</span>
      )}
    </button>
  )
}

export default Navbar

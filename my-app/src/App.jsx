import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Settings from './pages/Settings'
import ComingSoon from './pages/ComingSoon'
import { useStages } from './hooks/useStages'
import { useCurrentUser } from './hooks/useCurrentUser'

function App() {
  // Which page is showing: 'home', 'settings', 'calendar', or a stage key like 'lead'
  const [page, setPage] = useState('home')
  const { stages, reloadStages } = useStages()
  const { user, updateUser } = useCurrentUser()

  const currentStage = stages.find((stage) => stage.key === page)

  return (
    <div className="app">
      <Navbar page={page} onNavigate={setPage} stages={stages} user={user} />

      {page === 'home' && <Home stages={stages} onNavigate={setPage} onLeadCreated={reloadStages} />}
      {page === 'settings' && <Settings user={user} onSave={updateUser} />}
      {page === 'calendar' && <ComingSoon title="Calendar" />}
      {currentStage && <ComingSoon title={currentStage.name} />}
    </div>
  )
}

export default App

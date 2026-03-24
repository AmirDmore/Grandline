import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useGameStore } from './store/gameStore'
import Login from './pages/Login'
import Register from './pages/Register'
import GameLayout from './components/GameLayout'
import Town from './pages/Town'
import Campaign from './pages/Campaign'
import Crew from './pages/Crew'
import Formation from './pages/Formation'
import Summon from './pages/Summon'
import Ships from './pages/Ships'
import Tasks from './pages/Tasks'
import Mail from './pages/Mail'
import Leaderboard from './pages/Leaderboard'
import Battle from './pages/Battle'
import Toast from './components/Toast'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useGameStore(s => s.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><GameLayout /></PrivateRoute>}>
          <Route index element={<Town />} />
          <Route path="campaign" element={<Campaign />} />
          <Route path="battle/:stageId" element={<Battle />} />
          <Route path="crew" element={<Crew />} />
          <Route path="formation" element={<Formation />} />
          <Route path="summon" element={<Summon />} />
          <Route path="ships" element={<Ships />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="mail" element={<Mail />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function GameLayout() {
  const { player, user, logout, refreshPlayer } = useGameStore()
  const navigate = useNavigate()
  const [mailCount, setMailCount] = useState(0)
  // const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    refreshPlayer()
    fetchMailCount()
    const interval = setInterval(() => { refreshPlayer(); fetchMailCount() }, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMailCount = async () => {
    try {
      const res = await axios.get('/api/mail')
      setMailCount(res.data.filter((m: any) => !m.is_read).length)
    } catch {}
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const navItems = [
    { to: '/', label: 'Town', icon: '🏘️', exact: true },
    { to: '/campaign', label: 'Campaign', icon: '⚔️' },
    { to: '/crew', label: 'Crew', icon: '👥' },
    { to: '/formation', label: 'Formation', icon: '🛡️' },
    { to: '/summon', label: 'Summon', icon: '✨' },
    { to: '/ships', label: 'Ships', icon: '⛵' },
    { to: '/tasks', label: 'Tasks', icon: '📋' },
    { to: '/mail', label: 'Mail', icon: '📬', badge: mailCount },
    { to: '/leaderboard', label: 'Ranking', icon: '🏆' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top HUD */}
      <header style={{
        background: 'linear-gradient(180deg, #0d0d18 0%, #12121a 100%)',
        borderBottom: '1px solid #2a2a45',
        padding: '8px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 20px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#f5c842', fontWeight: 700 }}>
            ☠ THE GRAND LINE
          </span>
          {player && (
            <span style={{ fontSize: 13, color: '#8888aa', borderLeft: '1px solid #2a2a45', paddingLeft: 12 }}>
              Lv.{player.level} {player.name}
            </span>
          )}
        </div>

        {player && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, fontWeight: 600 }}>
            <span title="Gold">💰 {player.gold?.toLocaleString()}</span>
            <span title="Gems">💎 {player.gems}</span>
            <span title="Tickets">🎫 {player.tickets}</span>
            <span title="Vitality" style={{ color: player.vitality < 10 ? '#e63946' : '#22c55e' }}>
              ⚡ {player.vitality}/{player.max_vitality}
            </span>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
          </div>
        )}
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Nav */}
        <nav style={{
          width: 180, background: '#0d0d18',
          borderRight: '1px solid #2a2a45',
          padding: '16px 0',
          display: 'flex', flexDirection: 'column', gap: 2,
          position: 'sticky', top: 49, height: 'calc(100vh - 49px)',
          overflowY: 'auto'
        }}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', textDecoration: 'none',
                color: isActive ? '#f5c842' : '#8888aa',
                background: isActive ? 'rgba(245,200,66,0.08)' : 'transparent',
                borderLeft: isActive ? '3px solid #f5c842' : '3px solid transparent',
                fontSize: 14, fontWeight: 600, transition: 'all 0.15s',
                position: 'relative'
              })}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
              {item.badge ? (
                <span style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: '#e63946', color: 'white', borderRadius: '50%',
                  width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700
                }}>{item.badge}</span>
              ) : null}
            </NavLink>
          ))}

          {user?.is_admin && (
            <div style={{ marginTop: 'auto', padding: '8px 16px', borderTop: '1px solid #2a2a45' }}>
              <span style={{ fontSize: 11, color: '#f5c842', fontWeight: 700 }}>ADMIN</span>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: 24, overflowY: 'auto', maxHeight: 'calc(100vh - 49px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { useGameStore } from '../store/gameStore'

export default function Toast() {
  const { toasts, removeToast } = useGameStore()
  const colors: Record<string, string> = {
    success: '#22c55e', error: '#e63946', info: '#48cae4', reward: '#f5c842'
  }
  const icons: Record<string, string> = {
    success: '✅', error: '❌', info: 'ℹ️', reward: '🎁'
  }
  return (
    <div style={{ position: 'fixed', top: 70, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} onClick={() => removeToast(t.id)} style={{
          background: '#1a1a28', border: `1px solid ${colors[t.type] || '#2a2a45'}`,
          borderLeft: `4px solid ${colors[t.type] || '#2a2a45'}`,
          padding: '10px 16px', borderRadius: 8, cursor: 'pointer',
          maxWidth: 320, fontSize: 14, fontWeight: 600,
          animation: 'fadeIn 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          color: '#e8e8f0', display: 'flex', alignItems: 'center', gap: 8
        }}>
          <span>{icons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

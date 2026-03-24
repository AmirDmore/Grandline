import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

interface Player {
  id: number; name: string; class: string; level: number; exp: number; exp_to_next: number
  gold: number; gems: number; tickets: number; vitality: number; max_vitality: number
  power: number; wins: number; total_battles: number
}
interface User { id: number; username: string; email: string; is_admin: boolean }
interface Toast { id: string; message: string; type: 'success' | 'error' | 'info' | 'reward' }

interface GameState {
  token: string | null; user: User | null; player: Player | null; toasts: Toast[]
  setAuth: (token: string, user: User, player: Player) => void
  logout: () => void; setPlayer: (p: Player) => void; refreshPlayer: () => Promise<void>
  addToast: (msg: string, type?: Toast['type']) => void; removeToast: (id: string) => void
}

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('grandline_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      token: null, user: null, player: null, toasts: [],
      setAuth: (token, user, player) => { localStorage.setItem('grandline_token', token); set({ token, user, player }) },
      logout: () => { localStorage.removeItem('grandline_token'); set({ token: null, user: null, player: null }) },
      setPlayer: (player) => set({ player }),
      refreshPlayer: async () => { try { const res = await axios.get('/api/player/me'); set({ player: res.data }) } catch {} },
      addToast: (message, type = 'info') => {
        const id = Date.now().toString()
        set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
        setTimeout(() => get().removeToast(id), 4000)
      },
      removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
    }),
    { name: 'grandline_store', partialize: (s) => ({ token: s.token, user: s.user, player: s.player }) }
  )
)

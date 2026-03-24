import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useGameStore } from '../store/gameStore'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth, addToast } = useGameStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await axios.post('/api/auth/login', form)
      setAuth(res.data.token, res.data.user, res.data.player)
      addToast(`Welcome back, ${res.data.user.username}!`, 'success')
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'radial-gradient(ellipse at center, #0d0d1a 0%, #0a0a0f 100%)'}}>
      <div style={{background:'#12121a',border:'1px solid rgba(245,200,66,0.2)',borderRadius:16,padding:40,width:'100%',maxWidth:420,boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:8}}>☠️</div>
          <h1 style={{fontFamily:'Cinzel,serif',fontSize:28,color:'#f5c842',marginBottom:4}}>THE GRAND LINE</h1>
          <p style={{color:'#8888aa',fontSize:14}}>Your pirate adventure awaits</p>
        </div>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <div>
            <label>Username or Email</label>
            <input type="text" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="Enter username" required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter password" required />
          </div>
          {error && <div style={{color:'#e63946',fontSize:13,padding:'8px 12px',background:'rgba(230,57,70,0.1)',borderRadius:6,border:'1px solid rgba(230,57,70,0.3)'}}>{error}</div>}
          <button type="submit" className="btn btn-gold btn-lg w-full" disabled={loading} style={{marginTop:8}}>
            {loading ? 'Setting Sail...' : '⚓ Set Sail'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:20,color:'#8888aa',fontSize:14}}>
          New pirate? <Link to="/register" style={{color:'#f5c842',textDecoration:'none',fontWeight:700}}>Join the crew</Link>
        </p>
      </div>
    </div>
  )
}
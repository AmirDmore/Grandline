import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useGameStore } from '../store/gameStore'

const CLASSES = [
  { id:'Fighter', label:'Fighter', desc:'Balanced physical attacker', icon:'⚔️' },
  { id:'Swordsman', label:'Swordsman', desc:'High ATK, critical strikes', icon:'🗡️' },
  { id:'Magician', label:'Magician', desc:'Magic damage & debuffs', icon:'🔮' },
  { id:'Archer', label:'Archer', desc:'Ranged, high speed', icon:'🏹' },
  { id:'Summoner', label:'Summoner', desc:'Crew power bonus', icon:'✨' },
]

export default function Register() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ username:'', email:'', password:'', class:'Fighter' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth, addToast } = useGameStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await axios.post('/api/auth/register', form)
      setAuth(res.data.token, res.data.user, res.data.player)
      addToast('Welcome to The Grand Line, ' + res.data.user.username + '!', 'reward')
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'radial-gradient(ellipse at center, #0d0d1a 0%, #0a0a0f 100%)'}}>
      <div style={{background:'#12121a',border:'1px solid rgba(245,200,66,0.2)',borderRadius:16,padding:40,width:'100%',maxWidth:480,boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:40,marginBottom:6}}>🏴‍☠️</div>
          <h1 style={{fontFamily:'Cinzel,serif',fontSize:24,color:'#f5c842',marginBottom:4}}>Join The Grand Line</h1>
          <p style={{color:'#8888aa',fontSize:13}}>Step {step} of 2</p>
        </div>

        {step === 1 && (
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div><label>Username</label><input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="Your pirate name" /></div>
            <div><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" /></div>
            <div><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 6 characters" /></div>
            <button className="btn btn-gold btn-lg w-full" style={{marginTop:8}}
              onClick={()=>{if(!form.username||!form.email||!form.password){setError('Fill all fields');return}if(form.password.length<6){setError('Password too short');return}setError('');setStep(2)}}>
              Next: Choose Class →
            </button>
            {error && <div style={{color:'#e63946',fontSize:13}}>{error}</div>}
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
            <p style={{color:'#8888aa',fontSize:13,marginBottom:4}}>Choose your captain class:</p>
            {CLASSES.map(c => (
              <div key={c.id} onClick={()=>setForm({...form,class:c.id})} style={{
                display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:8,cursor:'pointer',
                border:`2px solid ${form.class===c.id?'#f5c842':'rgba(42,42,69,0.8)'}`,
                background:form.class===c.id?'rgba(245,200,66,0.08)':'transparent',transition:'all 0.15s'
              }}>
                <span style={{fontSize:24}}>{c.icon}</span>
                <div><div style={{fontWeight:700,color:'#e8e8f0'}}>{c.label}</div><div style={{fontSize:12,color:'#8888aa'}}>{c.desc}</div></div>
              </div>
            ))}
            {error && <div style={{color:'#e63946',fontSize:13,padding:'8px 12px',background:'rgba(230,57,70,0.1)',borderRadius:6}}>{error}</div>}
            <div style={{display:'flex',gap:12,marginTop:8}}>
              <button type="button" className="btn btn-ghost" onClick={()=>setStep(1)}>← Back</button>
              <button type="submit" className="btn btn-gold btn-lg" style={{flex:1}} disabled={loading}>
                {loading ? 'Creating...' : '🏴‍☠️ Begin Adventure'}
              </button>
            </div>
          </form>
        )}

        <p style={{textAlign:'center',marginTop:20,color:'#8888aa',fontSize:14}}>
          Already a pirate? <Link to="/login" style={{color:'#f5c842',textDecoration:'none',fontWeight:700}}>Login</Link>
        </p>
      </div>
    </div>
  )
}
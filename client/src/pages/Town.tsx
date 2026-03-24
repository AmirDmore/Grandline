import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useGameStore } from '../store/gameStore'
const BUILDINGS = [
  {id:'campaign',label:'Campaign',icon:'⚔️',desc:'Battle through the Grand Line',color:'#e63946',path:'/campaign'},
  {id:'crew',label:'Crew',icon:'👥',desc:'Manage your pirate crew',color:'#3b82f6',path:'/crew'},
  {id:'formation',label:'Formation',icon:'🛡️',desc:'Set your battle formation',color:'#22c55e',path:'/formation'},
  {id:'summon',label:'Summon',icon:'✨',desc:'Recruit new crew members',color:'#a855f7',path:'/summon'},
  {id:'ships',label:'Shipyard',icon:'⛵',desc:'Upgrade your ships',color:'#f59e0b',path:'/ships'},
  {id:'tasks',label:'Daily Tasks',icon:'📋',desc:'Complete tasks for rewards',color:'#06b6d4',path:'/tasks'},
  {id:'mail',label:'Mail',icon:'📬',desc:'Check your messages',color:'#84cc16',path:'/mail'},
  {id:'leaderboard',label:'Ranking',icon:'🏆',desc:'Top pirates worldwide',color:'#f5c842',path:'/leaderboard'},
]
export default function Town() {
  const { player, refreshPlayer } = useGameStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  useEffect(() => { refreshPlayer(); axios.get('/api/player/stats').then(r=>setStats(r.data)).catch(()=>{}) }, [])
  const expPct = player ? Math.min(100,Math.floor((player.exp/player.exp_to_next)*100)) : 0
  return (
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <div style={{background:'linear-gradient(135deg,#0d0d18,#1a1a2e,#0d0d18)',border:'1px solid rgba(245,200,66,0.2)',borderRadius:12,padding:'24px 28px',marginBottom:24}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
          <div>
            <h1 style={{fontFamily:'Cinzel,serif',fontSize:22,color:'#f5c842',marginBottom:4}}>☠ The Grand Line</h1>
            <p style={{color:'#8888aa',fontSize:14}}>Welcome back, <strong style={{color:'#e8e8f0'}}>{player?.name}</strong>!</p>
          </div>
          {player && (
            <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
              {[{label:'Level',value:player.level,icon:'⭐'},{label:'Power',value:stats?.power||0,icon:'💪'},{label:'Heroes',value:stats?.hero_count||0,icon:'👥'},{label:'Wins',value:player.wins,icon:'🏆'}].map(s=>(
                <div key={s.label} style={{textAlign:'center'}}>
                  <div style={{fontSize:18,fontWeight:700,color:'#f5c842'}}>{s.icon} {String(s.value)}</div>
                  <div style={{fontSize:11,color:'#8888aa',textTransform:'uppercase'}}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {player && (
          <div style={{marginTop:16}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#8888aa',marginBottom:4}}>
              <span>EXP</span><span>{player.exp} / {player.exp_to_next}</span>
            </div>
            <div className="progress-bar"><div className="progress-fill gold" style={{width:expPct+'%'}} /></div>
          </div>
        )}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:16}}>
        {BUILDINGS.map(b=>(
          <div key={b.id} onClick={()=>navigate(b.path)} style={{background:'#12121a',border:'1px solid #2a2a45',borderRadius:12,padding:'20px 16px',cursor:'pointer',transition:'all 0.2s',display:'flex',flexDirection:'column',alignItems:'center',gap:10,textAlign:'center'}}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLDivElement;el.style.transform='translateY(-4px)';el.style.borderColor=b.color+'66';el.style.boxShadow='0 8px 25px '+b.color+'22'}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLDivElement;el.style.transform='translateY(0)';el.style.borderColor='#2a2a45';el.style.boxShadow='none'}}>
            <div style={{fontSize:36}}>{b.icon}</div>
            <div style={{fontFamily:'Cinzel,serif',fontSize:14,fontWeight:700,color:'#e8e8f0'}}>{b.label}</div>
            <div style={{fontSize:12,color:'#8888aa',lineHeight:1.4}}>{b.desc}</div>
          </div>
        ))}
      </div>
      {player && (
        <div style={{marginTop:24,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:12}}>
          {[{label:'Gold',value:String(player.gold),icon:'💰',color:'#f5c842'},{label:'Gems',value:String(player.gems),icon:'💎',color:'#48cae4'},{label:'Tickets',value:String(player.tickets),icon:'🎫',color:'#a855f7'},{label:'Vitality',value:player.vitality+'/'+player.max_vitality,icon:'⚡',color:'#22c55e'}].map(r=>(
            <div key={r.label} style={{background:'#12121a',border:'1px solid #2a2a45',borderRadius:8,padding:'12px 16px',display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:20}}>{r.icon}</span>
              <div><div style={{fontSize:16,fontWeight:700,color:r.color}}>{r.value}</div><div style={{fontSize:11,color:'#8888aa'}}>{r.label}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
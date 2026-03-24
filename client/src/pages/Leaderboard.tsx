import { useEffect, useState } from 'react'
import axios from 'axios'
import { useGameStore } from '../store/gameStore'

export default function Leaderboard() {
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { player } = useGameStore()

  useEffect(() => { axios.get('/api/social/leaderboard').then(r=>{setPlayers(r.data);setLoading(false)}).catch(()=>setLoading(false)) }, [])

  if (loading) return <div className="loading"><div className="spinner"/><span>Loading rankings...</span></div>

  return (
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <h1 className="page-title">🏆 Pirate Rankings</h1>
      <div style={{background:'#12121a',border:'1px solid #2a2a45',borderRadius:12,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'50px 1fr 80px 80px 80px 80px',gap:0,padding:'12px 16px',background:'#1a1a28',borderBottom:'1px solid #2a2a45',fontSize:12,color:'#8888aa',fontWeight:700,textTransform:'uppercase'}}>
          <span>#</span><span>Pirate</span><span style={{textAlign:'center'}}>Level</span><span style={{textAlign:'center'}}>Power</span><span style={{textAlign:'center'}}>Heroes</span><span style={{textAlign:'center'}}>Wins</span>
        </div>
        {players.map((p,i)=>{
          const isMe = p.id === player?.id
          const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':null
          return (
            <div key={p.id} style={{
              display:'grid',gridTemplateColumns:'50px 1fr 80px 80px 80px 80px',gap:0,
              padding:'12px 16px',borderBottom:'1px solid #2a2a45',
              background:isMe?'rgba(245,200,66,0.05)':'transparent',
              transition:'background 0.15s'
            }}>
              <span style={{fontWeight:700,color:i<3?'#f5c842':'#8888aa'}}>{medal||i+1}</span>
              <div>
                <div style={{fontWeight:700,color:isMe?'#f5c842':'#e8e8f0'}}>{p.name} {isMe&&'(You)'}</div>
                <div style={{fontSize:11,color:'#8888aa'}}>{p.class}</div>
              </div>
              <span style={{textAlign:'center',color:'#e8e8f0',fontWeight:600}}>{p.level}</span>
              <span style={{textAlign:'center',color:'#f5c842',fontWeight:600}}>{p.power||0}</span>
              <span style={{textAlign:'center',color:'#3b82f6',fontWeight:600}}>{p.hero_count||0}</span>
              <span style={{textAlign:'center',color:'#22c55e',fontWeight:600}}>{p.wins||0}</span>
            </div>
          )
        })}
        {players.length===0 && <div style={{textAlign:'center',color:'#8888aa',padding:40}}>No players yet. Be the first!</div>}
      </div>
    </div>
  )
}
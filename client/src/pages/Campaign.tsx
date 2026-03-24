import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useGameStore } from '../store/gameStore'

const ARC_COLORS: Record<string,string> = {
  'East Blue':'#3b82f6','Alabasta':'#f59e0b','Skypiea':'#a855f7',
  'Water 7':'#06b6d4','Thriller Bark':'#6b7280','Marineford':'#e63946',
  'New World':'#f5c842','Elbaf':'#ff6b35'
}

export default function Campaign() {
  const [islands, setIslands] = useState<any[]>([])
  const [selectedIsland, setSelectedIsland] = useState<any>(null)
  const [stages, setStages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { player } = useGameStore()

  useEffect(() => {
    axios.get('/api/campaign/islands').then(r => { setIslands(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const selectIsland = async (island: any) => {
    setSelectedIsland(island)
    const res = await axios.get('/api/campaign/islands/'+island.id+'/stages')
    setStages(res.data)
  }

  const arcs = [...new Set(islands.map(i => i.arc))]

  if (loading) return <div className="loading"><div className="spinner" /><span>Loading islands...</span></div>

  return (
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <h1 className="page-title">⚔️ Campaign</h1>
      {!selectedIsland ? (
        <div>
          {arcs.map(arc => (
            <div key={arc} style={{marginBottom:24}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                <div style={{height:2,flex:1,background:'linear-gradient(90deg,'+( ARC_COLORS[arc]||'#f5c842')+',transparent)'}} />
                <span style={{fontFamily:'Cinzel,serif',fontSize:14,color:ARC_COLORS[arc]||'#f5c842',fontWeight:700,whiteSpace:'nowrap'}}>{arc}</span>
                <div style={{height:2,flex:1,background:'linear-gradient(90deg,transparent,'+(ARC_COLORS[arc]||'#f5c842')+')'}} />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
                {islands.filter(i=>i.arc===arc).map(island => {
                  const cleared = parseInt(island.cleared_stages)||0
                  const total = parseInt(island.total_stages)||1
                  const pct = Math.floor((cleared/total)*100)
                  const isLocked = island.arc_order > 1 && cleared === 0 && islands.find(i=>i.arc_order===island.arc_order-1&&parseInt(i.cleared_stages)<parseInt(i.total_stages))
                  return (
                    <div key={island.id} onClick={()=>!isLocked&&selectIsland(island)} style={{
                      background:'#12121a',border:'1px solid '+(isLocked?'#2a2a45':ARC_COLORS[arc]||'#2a2a45')+'44',
                      borderRadius:10,padding:16,cursor:isLocked?'not-allowed':'pointer',
                      opacity:isLocked?0.5:1,transition:'all 0.2s'
                    }}
                      onMouseEnter={e=>{if(!isLocked)(e.currentTarget as HTMLDivElement).style.transform='translateY(-2px)'}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(0)'}}>
                      <div style={{fontFamily:'Cinzel,serif',fontSize:14,fontWeight:700,color:'#e8e8f0',marginBottom:4}}>{island.name}</div>
                      <div style={{fontSize:12,color:'#8888aa',marginBottom:8}}>{cleared}/{total} stages</div>
                      <div className="progress-bar"><div className="progress-fill" style={{width:pct+'%',background:ARC_COLORS[arc]||'#f5c842'}} /></div>
                      {pct===100 && <div style={{fontSize:11,color:'#22c55e',marginTop:4,textAlign:'right'}}>✓ Complete</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button className="btn btn-ghost btn-sm" style={{marginBottom:16}} onClick={()=>setSelectedIsland(null)}>← Back to Islands</button>
          <h2 style={{fontFamily:'Cinzel,serif',fontSize:18,color:'#f5c842',marginBottom:4}}>{selectedIsland.name}</h2>
          <p style={{color:'#8888aa',fontSize:13,marginBottom:20}}>{selectedIsland.description}</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
            {stages.map(stage => {
              const stars = stage.stars||0
              const canPlay = (player?.vitality||0) >= stage.stamina_cost
              return (
                <div key={stage.id} style={{background:'#12121a',border:'1px solid #2a2a45',borderRadius:10,padding:16,transition:'all 0.2s'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:'#e8e8f0'}}>{stage.name}</div>
                      <div style={{fontSize:11,color:'#8888aa'}}>Stage {stage.stage_number}</div>
                    </div>
                    <div style={{color:'#f5c842',fontSize:16}}>{'★'.repeat(stars)}{'☆'.repeat(3-stars)}</div>
                  </div>
                  <div style={{fontSize:12,color:'#8888aa',marginBottom:12,lineHeight:1.4}}>{stage.description}</div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,fontSize:12}}>
                    <span style={{color:'#8888aa'}}>⚡ {stage.stamina_cost} Vitality</span>
                    <span style={{color:'#f5c842'}}>💰 {stage.rewards?.gold||200}</span>
                  </div>
                  <button className={'btn btn-red btn-sm w-full'} disabled={!canPlay}
                    onClick={()=>navigate('/battle/'+stage.id)}>
                    {stage.completed ? '🔄 Replay' : '⚔️ Battle'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
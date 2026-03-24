import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useGameStore } from '../store/gameStore'

export default function Battle() {
  const { stageId } = useParams()
  const navigate = useNavigate()
  const { addToast, refreshPlayer } = useGameStore()
  const [phase, setPhase] = useState<'prep'|'fighting'|'result'>('prep')
  const [formation, setFormation] = useState<any[]>([])
  const [stage, setStage] = useState<any>(null)
  const [result, setResult] = useState<any>(null)
  const [log, setLog] = useState<any[]>([])
  const [logIdx, setLogIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([
      axios.get('/api/heroes/formation'),
      axios.get('/api/campaign/islands').then(r => {
        const allIslands = r.data
        return Promise.all(allIslands.map((i:any) => axios.get('/api/campaign/islands/'+i.id+'/stages')))
          .then(results => results.flatMap(r=>r.data).find((s:any)=>String(s.id)===stageId))
      })
    ]).then(([fRes, stageData]) => {
      setFormation(fRes.data)
      setStage(stageData)
      setLoading(false)
    }).catch(()=>setLoading(false))
  }, [stageId])

  const startBattle = async () => {
    setPhase('fighting')
    try {
      const res = await axios.post('/api/battle/campaign/'+stageId)
      setResult(res.data)
      setLog(res.data.log || [])
      setLogIdx(0)
      animateLog(res.data.log || [])
    } catch (err: any) {
      addToast(err.response?.data?.error || 'Battle failed', 'error')
      setPhase('prep')
    }
  }

  const animateLog = (entries: any[]) => {
    let i = 0
    const interval = setInterval(() => {
      setLogIdx(i)
      i++
      if (i >= entries.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('result'), 800)
      }
    }, 200)
  }

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [logIdx])

  const handleFinish = () => {
    if (result?.result === 'win') {
      const r = result.rewards
      let msg = 'Victory! '
      if (r?.gold) msg += '+'+r.gold+' Gold '
      if (r?.gems) msg += '+'+r.gems+' Gems '
      if (r?.levelUp) msg += 'LEVEL UP! Lv.'+r.levelUp
      addToast(msg, 'reward')
    } else {
      addToast('Defeated! Train harder and try again.', 'error')
    }
    refreshPlayer()
    navigate('/campaign')
  }

  if (loading) return <div className="loading"><div className="spinner" /><span>Preparing battle...</span></div>

  return (
    <div style={{animation:'fadeIn 0.3s ease',maxWidth:800,margin:'0 auto'}}>
      <button className="btn btn-ghost btn-sm" style={{marginBottom:16}} onClick={()=>navigate('/campaign')}>← Back</button>

      {phase === 'prep' && (
        <div>
          <h1 className="page-title">⚔️ {stage?.name || 'Battle'}</h1>
          <div style={{background:'#12121a',border:'1px solid #2a2a45',borderRadius:12,padding:20,marginBottom:20}}>
            <p style={{color:'#8888aa',marginBottom:12}}>{stage?.description}</p>
            <div style={{display:'flex',gap:20,fontSize:14}}>
              <span>⚡ Cost: <strong style={{color:'#22c55e'}}>{stage?.stamina_cost} Vitality</strong></span>
              <span>💰 Reward: <strong style={{color:'#f5c842'}}>{stage?.rewards?.gold||200} Gold</strong></span>
            </div>
          </div>
          <h3 style={{fontFamily:'Cinzel,serif',fontSize:16,color:'#f5c842',marginBottom:12}}>Your Formation</h3>
          {formation.length === 0 ? (
            <div style={{background:'#12121a',border:'1px solid #e63946',borderRadius:10,padding:20,textAlign:'center',color:'#8888aa'}}>
              No heroes in formation! <button className="btn btn-gold btn-sm" style={{marginLeft:8}} onClick={()=>navigate('/formation')}>Set Formation</button>
            </div>
          ) : (
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:24}}>
              {formation.map(h => (
                <div key={h.id} style={{background:'#1a1a28',border:'1px solid #2a2a45',borderRadius:10,padding:12,display:'flex',flexDirection:'column',alignItems:'center',gap:6,minWidth:100}}>
                  <div style={{width:60,height:60,borderRadius:8,overflow:'hidden',background:'#0a0a0f',border:'2px solid #f5c84244'}}>
                    <img src={'/assets/bitmaps/heroHeads/headbig/big_'+h.hero_id+'.png'} alt={h.name}
                      style={{width:'100%',height:'100%',objectFit:'cover'}}
                      onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}} />
                  </div>
                  <div style={{fontSize:12,fontWeight:700,color:'#e8e8f0',textAlign:'center'}}>{h.name}</div>
                  <div style={{fontSize:11,color:'#8888aa'}}>Lv.{h.level}</div>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-red btn-lg w-full" onClick={startBattle} disabled={formation.length===0}>
            ⚔️ Start Battle
          </button>
        </div>
      )}

      {phase === 'fighting' && (
        <div>
          <h1 className="page-title" style={{justifyContent:'center'}}>⚔️ Battle in Progress...</h1>
          <div ref={logRef} style={{background:'#0a0a0f',border:'1px solid #2a2a45',borderRadius:12,padding:16,height:400,overflowY:'auto',fontFamily:'monospace',fontSize:13}}>
            {log.slice(0,logIdx+1).map((entry,i) => (
              <div key={i} style={{padding:'3px 0',color:entry.type==='turn_start'?'#f5c842':entry.type==='rage'?'#ff6b35':entry.type==='skill'?'#a855f7':entry.type==='debuff'?'#e63946':'#8888aa',borderBottom:entry.type==='turn_start'?'1px solid #2a2a4522':'none'}}>
                {entry.type==='turn_start' && <span>{entry.message}</span>}
                {entry.type==='attack' && <span>{entry.attacker} attacks {entry.target} for <strong style={{color:'#e63946'}}>{entry.damage}</strong> dmg</span>}
                {entry.type==='skill' && <span style={{color:'#a855f7'}}>{entry.attacker} uses <strong>{entry.action}</strong> on {entry.target} for <strong style={{color:'#ff6b35'}}>{entry.damage}</strong> dmg{!entry.alive?' 💀':''}</span>}
                {entry.type==='rage' && <span style={{color:'#ff6b35'}}>🔥 {entry.attacker} unleashes <strong>{entry.action}</strong>!</span>}
                {entry.type==='debuff' && <span style={{color:'#e63946'}}>{entry.unit} takes {entry.damage} {entry.debuff} damage</span>}
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:16,color:'#8888aa',animation:'pulse 1s infinite'}}>Battle ongoing...</div>
        </div>
      )}

      {phase === 'result' && result && (
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:80,marginBottom:16}}>{result.result==='win'?'🏆':'💀'}</div>
          <h1 style={{fontFamily:'Cinzel,serif',fontSize:32,color:result.result==='win'?'#f5c842':'#e63946',marginBottom:8}}>
            {result.result==='win'?'VICTORY!':'DEFEATED'}
          </h1>
          {result.result==='win' && (
            <div style={{marginBottom:24}}>
              <div style={{fontSize:24,color:'#f5c842',marginBottom:8}}>
                {'★'.repeat(result.stars)}{'☆'.repeat(3-result.stars)}
              </div>
              <div style={{display:'flex',justifyContent:'center',gap:24,flexWrap:'wrap',fontSize:16}}>
                {result.rewards?.gold>0 && <span>💰 +{result.rewards.gold} Gold</span>}
                {result.rewards?.gems>0 && <span>💎 +{result.rewards.gems} Gems</span>}
                {result.rewards?.exp>0 && <span>⭐ +{result.rewards.exp} EXP</span>}
                {result.rewards?.levelUp && <span style={{color:'#f5c842',fontWeight:700}}>🎉 LEVEL UP! Lv.{result.rewards.levelUp}</span>}
              </div>
            </div>
          )}
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <button className="btn btn-gold btn-lg" onClick={handleFinish}>Continue</button>
            <button className="btn btn-red" onClick={startBattle}>Retry</button>
          </div>
        </div>
      )}
    </div>
  )
}
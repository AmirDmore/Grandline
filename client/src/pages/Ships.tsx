import { useEffect, useState } from 'react'
import axios from 'axios'
import { useGameStore } from '../store/gameStore'

export default function Ships() {
  const [ships, setShips] = useState<any[]>([])
  const [_templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToast, refreshPlayer } = useGameStore()

  const load = () => {
    Promise.all([axios.get('/api/ships'), axios.get('/api/ships/templates')]).then(([sRes,tRes])=>{
      setShips(sRes.data); setTemplates(tRes.data); setLoading(false)
    }).catch(()=>setLoading(false))
  }
  useEffect(()=>{ load() }, [])

  const activate = async (shipId: number) => {
    try { await axios.post('/api/ships/activate/'+shipId); load(); addToast('Ship activated!','success') }
    catch(e:any) { addToast(e.response?.data?.error||'Failed','error') }
  }

  const upgrade = async (shipId: number, type: string) => {
    try { await axios.post('/api/ships/upgrade/'+shipId, {upgrade_type:type}); load(); addToast('Upgrade complete!','success'); refreshPlayer() }
    catch(e:any) { addToast(e.response?.data?.error||'Failed','error') }
  }

  if (loading) return <div className="loading"><div className="spinner"/><span>Loading ships...</span></div>

  return (
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <h1 className="page-title">⛵ Shipyard</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
        {ships.map(ship=>(
          <div key={ship.id} style={{background:'#12121a',border:'2px solid '+(ship.is_active?'#f5c84266':'#2a2a45'),borderRadius:12,padding:20,position:'relative'}}>
            {ship.is_active && <div style={{position:'absolute',top:12,right:12,background:'#f5c842',color:'#0a0a0f',borderRadius:4,padding:'2px 8px',fontSize:11,fontWeight:700}}>ACTIVE</div>}
            <div style={{fontSize:32,marginBottom:8}}>⛵</div>
            <h3 style={{fontFamily:'Cinzel,serif',fontSize:16,color:'#e8e8f0',marginBottom:4}}>{ship.name}</h3>
            <p style={{color:'#8888aa',fontSize:13,marginBottom:12}}>{ship.description}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:12}}>
              {[['Sail',ship.sail_level||1,'#48cae4'],['Cannon',ship.cannon_level||1,'#e63946'],['Hull',ship.hull_level||1,'#22c55e']].map(([type,level,color])=>(
                <div key={String(type)} style={{background:'#1a1a28',borderRadius:6,padding:'8px',textAlign:'center'}}>
                  <div style={{fontSize:11,color:'#8888aa'}}>{String(type)}</div>
                  <div style={{fontWeight:700,color:String(color)}}>Lv.{String(level)}</div>
                  <button className="btn btn-sm" style={{marginTop:4,fontSize:10,padding:'2px 6px',background:String(color),color:'#0a0a0f',border:'none',borderRadius:3}}
                    onClick={()=>upgrade(ship.id,String(type).toLowerCase())}>+</button>
                </div>
              ))}
            </div>
            {!ship.is_active && <button className="btn btn-gold w-full btn-sm" onClick={()=>activate(ship.id)}>Set Active</button>}
          </div>
        ))}
      </div>
      {ships.length===0 && <div style={{textAlign:'center',color:'#8888aa',padding:40}}>No ships yet. Complete the campaign to unlock more!</div>}
    </div>
  )
}
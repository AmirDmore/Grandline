import { useEffect, useState } from 'react'
import axios from 'axios'
import HeroCard from '../components/HeroCard'
import { useGameStore } from '../store/gameStore'

export default function Crew() {
  const [crew, setCrew] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { addToast, refreshPlayer } = useGameStore()

  useEffect(() => { axios.get('/api/heroes/crew').then(r=>{setCrew(r.data);setLoading(false)}).catch(()=>setLoading(false)) }, [])

  const levelUp = async (heroId: number) => {
    try {
      const res = await axios.post('/api/heroes/levelup/'+heroId)
      setCrew(c=>c.map(h=>h.id===heroId?{...h,...res.data.hero}:h))
      setSelected((s:any)=>s?{...s,...res.data.hero}:s)
      addToast('Level up! -'+res.data.gold_spent+' Gold', 'success')
      refreshPlayer()
    } catch(e:any) { addToast(e.response?.data?.error||'Failed','error') }
  }

  const starUp = async (heroId: number) => {
    try {
      const res = await axios.post('/api/heroes/starup/'+heroId)
      setCrew(c=>c.map(h=>h.id===heroId?{...h,...res.data}:h))
      setSelected((s:any)=>s?{...s,...res.data}:s)
      addToast('Star level increased!', 'reward')
    } catch(e:any) { addToast(e.response?.data?.error||'Failed','error') }
  }

  const rarities = ['all','mythic','legendary','epic','rare','common']
  const filtered = filter==='all' ? crew : crew.filter(h=>h.rarity===filter)

  if (loading) return <div className="loading"><div className="spinner"/><span>Loading crew...</span></div>

  return (
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <h1 className="page-title">👥 My Crew ({crew.length})</h1>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {rarities.map(r=>(
          <button key={r} className={'btn btn-sm '+(filter===r?'btn-gold':'btn-ghost')} onClick={()=>setFilter(r)}
            style={{textTransform:'capitalize'}}>{r}</button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))',gap:12}}>
        {filtered.map(h=>(
          <HeroCard key={h.id} hero={h} onClick={()=>setSelected(h)} selected={selected?.id===h.id} />
        ))}
      </div>
      {filtered.length===0 && <div style={{textAlign:'center',color:'#8888aa',padding:40}}>No heroes found. Go summon some!</div>}

      {selected && (
        <div style={{position:'fixed',top:0,right:0,bottom:0,width:340,background:'#12121a',borderLeft:'1px solid #2a2a45',padding:24,overflowY:'auto',zIndex:200,animation:'slideIn 0.3s ease'}}>
          <button className="btn btn-ghost btn-sm" style={{marginBottom:16}} onClick={()=>setSelected(null)}>✕ Close</button>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12,marginBottom:20}}>
            <div style={{width:100,height:100,borderRadius:12,overflow:'hidden',border:'3px solid #f5c84266',background:'#0a0a0f'}}>
              <img src={'/assets/bitmaps/heroHeads/headbig/big_'+selected.hero_id+'.png'} alt={selected.name}
                style={{width:'100%',height:'100%',objectFit:'cover'}}
                onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}} />
            </div>
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:'Cinzel,serif',fontSize:18,fontWeight:700,color:'#e8e8f0'}}>{selected.name}</div>
              <div style={{fontSize:13,color:'#8888aa'}}>{selected.title}</div>
              <div style={{color:'#f5c842',fontSize:16,marginTop:4}}>{'★'.repeat(selected.star_level)}</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:13,marginBottom:16}}>
            {[['Faction',selected.faction],['Class',selected.class],['Arc',selected.arc],['Level','Lv.'+selected.level]].map(([k,v])=>(
              <div key={k} style={{background:'#1a1a28',borderRadius:6,padding:'8px 10px'}}>
                <div style={{color:'#8888aa',fontSize:11}}>{k}</div>
                <div style={{fontWeight:700,color:'#e8e8f0'}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{background:'#1a1a28',borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{fontSize:12,color:'#8888aa',marginBottom:8}}>STATS</div>
            {[['HP',selected.base_hp,'#22c55e'],['P.ATK',selected.base_patk,'#e63946'],['C.ATK',selected.base_catk,'#f59e0b'],['M.ATK',selected.base_matk,'#a855f7'],['SPD',selected.base_speed,'#48cae4']].map(([k,v,c])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{color:'#8888aa',fontSize:12}}>{k}</span>
                <span style={{fontWeight:700,color:String(c)}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{background:'#1a1a28',borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{fontSize:12,color:'#a855f7',marginBottom:4}}>⚡ {selected.skill_name}</div>
            <div style={{fontSize:12,color:'#8888aa'}}>{selected.skill_desc}</div>
          </div>
          <div style={{background:'#1a1a28',borderRadius:8,padding:12,marginBottom:16}}>
            <div style={{fontSize:12,color:'#ff6b35',marginBottom:4}}>🔥 {selected.rage_name}</div>
            <div style={{fontSize:12,color:'#8888aa'}}>{selected.rage_desc}</div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-gold w-full" onClick={()=>levelUp(selected.id)}>Level Up</button>
            <button className="btn btn-blue w-full" onClick={()=>starUp(selected.id)}>⭐ Star Up</button>
          </div>
          <div style={{marginTop:8,fontSize:12,color:'#8888aa',textAlign:'center'}}>Shards: {selected.shards||0}</div>
        </div>
      )}
    </div>
  )
}
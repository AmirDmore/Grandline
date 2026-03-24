import { useEffect, useState } from 'react'
import axios from 'axios'
import HeroCard from '../components/HeroCard'
import { useGameStore } from '../store/gameStore'

export default function Formation() {
  const [crew, setCrew] = useState<any[]>([])
  const [formation, setFormation] = useState<(any|null)[]>([null,null,null,null,null])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSlot, setActiveSlot] = useState<number|null>(null)
  const { addToast } = useGameStore()

  useEffect(() => {
    Promise.all([axios.get('/api/heroes/crew'), axios.get('/api/heroes/formation')]).then(([cRes,fRes])=>{
      setCrew(cRes.data)
      const slots: (any|null)[] = [null,null,null,null,null]
      fRes.data.forEach((h:any)=>{ if(h.formation_slot>=1&&h.formation_slot<=5) slots[h.formation_slot-1]=h })
      setFormation(slots)
      setLoading(false)
    }).catch(()=>setLoading(false))
  }, [])

  const assignHero = (hero: any) => {
    if (activeSlot === null) return
    const newFormation = [...formation]
    const existingSlot = newFormation.findIndex(h=>h?.id===hero.id)
    if (existingSlot !== -1) newFormation[existingSlot] = null
    newFormation[activeSlot] = hero
    setFormation(newFormation)
    setActiveSlot(null)
  }

  const removeFromSlot = (slotIdx: number) => {
    const newFormation = [...formation]
    newFormation[slotIdx] = null
    setFormation(newFormation)
  }

  const saveFormation = async () => {
    setSaving(true)
    try {
      const slots = formation.map((h,i)=>({hero_id:h?.id||null,slot:i+1})).filter(s=>s.hero_id)
      await axios.put('/api/heroes/formation', { slots })
      addToast('Formation saved!', 'success')
    } catch(e:any) { addToast(e.response?.data?.error||'Failed','error') }
    setSaving(false)
  }

  const inFormation = new Set(formation.filter(Boolean).map(h=>h.id))
  const available = crew.filter(h=>!inFormation.has(h.id))

  if (loading) return <div className="loading"><div className="spinner"/><span>Loading...</span></div>

  return (
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <h1 className="page-title">🛡️ Formation</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
        <div>
          <h3 style={{fontFamily:'Cinzel,serif',fontSize:15,color:'#f5c842',marginBottom:12}}>Battle Slots (Max 5)</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,marginBottom:16}}>
            {formation.map((hero,i)=>(
              <div key={i} onClick={()=>setActiveSlot(activeSlot===i?null:i)} style={{
                background:activeSlot===i?'rgba(245,200,66,0.1)':'#12121a',
                border:'2px solid '+(activeSlot===i?'#f5c842':hero?'#3b82f644':'#2a2a45'),
                borderRadius:10,padding:8,cursor:'pointer',minHeight:100,
                display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,transition:'all 0.2s'
              }}>
                <div style={{fontSize:11,color:'#8888aa',marginBottom:4}}>Slot {i+1}</div>
                {hero ? (
                  <>
                    <div style={{width:50,height:50,borderRadius:6,overflow:'hidden',background:'#0a0a0f'}}>
                      <img src={'/assets/bitmaps/heroHeads/headbig/big_'+hero.hero_id+'.png'} alt={hero.name}
                        style={{width:'100%',height:'100%',objectFit:'cover'}}
                        onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}} />
                    </div>
                    <div style={{fontSize:10,fontWeight:700,color:'#e8e8f0',textAlign:'center',lineHeight:1.2}}>{hero.name}</div>
                    <button className="btn btn-sm" style={{fontSize:9,padding:'2px 6px',background:'#e63946',color:'white',border:'none',borderRadius:3}}
                      onClick={e=>{e.stopPropagation();removeFromSlot(i)}}>Remove</button>
                  </>
                ) : <span style={{fontSize:20,color:'#2a2a45'}}>+</span>}
              </div>
            ))}
          </div>
          {activeSlot!==null && <div style={{color:'#f5c842',fontSize:13,marginBottom:12}}>← Select a hero from the right to place in Slot {activeSlot+1}</div>}
          <button className="btn btn-gold w-full" onClick={saveFormation} disabled={saving}>{saving?'Saving...':'💾 Save Formation'}</button>
        </div>
        <div>
          <h3 style={{fontFamily:'Cinzel,serif',fontSize:15,color:'#f5c842',marginBottom:12}}>Available Heroes ({available.length})</h3>
          <div style={{maxHeight:500,overflowY:'auto',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
            {available.map(h=>(
              <HeroCard key={h.id} hero={h} size="sm" onClick={()=>activeSlot!==null&&assignHero(h)} selected={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
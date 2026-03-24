import { useEffect, useState } from 'react'
import axios from 'axios'
import HeroCard from '../components/HeroCard'
import { useGameStore } from '../store/gameStore'

export default function Summon() {
  const [banners, setBanners] = useState<any[]>([])
  const [selectedBanner, setSelectedBanner] = useState<any>(null)
  const [results, setResults] = useState<any[]>([])
  const [pity, setPity] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const { addToast, refreshPlayer, player } = useGameStore()

  useEffect(() => { axios.get('/api/summon/banners').then(r=>{setBanners(r.data);if(r.data.length>0)setSelectedBanner(r.data[0])}).catch(()=>{}) }, [])

  const pull = async (count: number) => {
    if (!selectedBanner) return
    setLoading(true)
    try {
      const res = await axios.post('/api/summon/pull/'+selectedBanner.id, { count })
      setResults(res.data.results)
      setPity(res.data.pity_count)
      setShowResults(true)
      refreshPlayer()
      const legendary = res.data.results.filter((r:any)=>r.rarity==='legendary'||r.rarity==='mythic')
      if (legendary.length > 0) addToast('Legendary pull! Got '+legendary.map((r:any)=>r.name).join(', ')+'!', 'reward')
      else addToast('Summon complete!', 'success')
    } catch(e:any) { addToast(e.response?.data?.error||'Summon failed','error') }
    setLoading(false)
  }

  const RARITY_ORDER: Record<string,number> = {mythic:0,legendary:1,epic:2,rare:3,common:4}

  return (
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <h1 className="page-title">✨ Summon</h1>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {banners.map(b=>(
          <button key={b.id} className={'btn '+(selectedBanner?.id===b.id?'btn-gold':'btn-ghost')} onClick={()=>setSelectedBanner(b)}>{b.name}</button>
        ))}
      </div>
      {selectedBanner && (
        <div style={{background:'#12121a',border:'1px solid rgba(245,200,66,0.2)',borderRadius:12,padding:24,marginBottom:24}}>
          <h2 style={{fontFamily:'Cinzel,serif',fontSize:20,color:'#f5c842',marginBottom:8}}>{selectedBanner.name}</h2>
          <p style={{color:'#8888aa',fontSize:14,marginBottom:16}}>{selectedBanner.description}</p>
          <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:20,fontSize:14}}>
            {selectedBanner.cost_tickets>0 && <span>🎫 {selectedBanner.cost_tickets} ticket/pull</span>}
            {selectedBanner.cost_gems>0 && <span>💎 {selectedBanner.cost_gems} gems/pull</span>}
            <span style={{color:'#f5c842'}}>Pity: {pity}/50 (guaranteed legendary at 50)</span>
          </div>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button className="btn btn-gold btn-lg" onClick={()=>pull(1)} disabled={loading}>
              {loading?'Summoning...':'✨ Summon x1'}
            </button>
            <button className="btn btn-red btn-lg" onClick={()=>pull(10)} disabled={loading}>
              🎰 Summon x10
            </button>
          </div>
          <div style={{marginTop:12,fontSize:12,color:'#8888aa'}}>
            Your tickets: 🎫 {player?.tickets||0} | Gems: 💎 {player?.gems||0}
          </div>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <h3 style={{fontFamily:'Cinzel,serif',fontSize:16,color:'#f5c842'}}>Summon Results</h3>
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowResults(false)}>Hide</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))',gap:12}}>
            {[...results].sort((a,b)=>(RARITY_ORDER[a.rarity]||4)-(RARITY_ORDER[b.rarity]||4)).map((r,i)=>(
              <div key={i} style={{position:'relative'}}>
                <HeroCard hero={r} size="sm" />
                {r.is_new && <div style={{position:'absolute',top:-4,left:-4,background:'#22c55e',color:'white',borderRadius:4,padding:'1px 5px',fontSize:9,fontWeight:700}}>NEW!</div>}
                {r.is_duplicate && <div style={{position:'absolute',top:-4,left:-4,background:'#f59e0b',color:'#0a0a0f',borderRadius:4,padding:'1px 5px',fontSize:9,fontWeight:700}}>+{r.shards_gained} shards</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
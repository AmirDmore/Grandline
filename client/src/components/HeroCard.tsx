interface HeroCardProps {
  hero: any; onClick?: () => void; selected?: boolean; showStats?: boolean; size?: 'sm' | 'md' | 'lg'
}
const RC: Record<string,string> = { mythic:'#ff6b35',legendary:'#f5c842',epic:'#a855f7',rare:'#3b82f6',common:'#6b7280' }
const RB: Record<string,string> = { mythic:'rgba(255,107,53,0.13)',legendary:'rgba(245,200,66,0.13)',epic:'rgba(168,85,247,0.13)',rare:'rgba(59,130,246,0.13)',common:'rgba(107,114,128,0.1)' }
export default function HeroCard({ hero, onClick, selected, showStats, size='md' }: HeroCardProps) {
  const rarity = hero.rarity || 'common'
  const color = RC[rarity] || '#6b7280'
  const bg = RB[rarity] || 'rgba(107,114,128,0.1)'
  const stars = '★'.repeat(Math.min(hero.star_level||1,6))
  const imgSize = size==='sm'?56:size==='lg'?100:72
  // Use portrait_big directly from API, or construct from hero_id/hero_template_id
  const portrait = hero.portrait_big || (hero.hero_id ? `/assets/bitmaps/heroHeads/headbig/big_${hero.hero_id}.png` : null)
  return (
    <div onClick={onClick} style={{
      background:bg, border:`2px solid ${selected?color:'rgba(42,42,69,0.8)'}`,
      borderRadius:10, padding:size==='sm'?8:12, cursor:onClick?'pointer':'default',
      transition:'all 0.2s', position:'relative',
      boxShadow:selected?`0 0 15px ${color}44`:'none',
      display:'flex', flexDirection:'column', alignItems:'center', gap:6
    }}
      onMouseEnter={e=>{if(onClick)(e.currentTarget as HTMLDivElement).style.transform='translateY(-2px)'}}
      onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(0)'}}
    >
      <div style={{position:'absolute',top:4,right:4,background:color,borderRadius:3,padding:'1px 5px',fontSize:9,fontWeight:700,color:rarity==='legendary'?'#0a0a0f':'white',textTransform:'uppercase'}}>
        {rarity.slice(0,3).toUpperCase()}
      </div>
      <div style={{width:imgSize,height:imgSize,borderRadius:8,overflow:'hidden',border:`2px solid ${color}66`,background:'#0a0a0f',display:'flex',alignItems:'center',justifyContent:'center'}}>
        {portrait ? (
          <img src={portrait} alt={hero.name} style={{width:'100%',height:'100%',objectFit:'cover'}}
            onError={e=>{const t=e.currentTarget;t.style.display='none';const p=t.parentElement;if(p)p.innerHTML=`<span style="font-size:${Math.floor(imgSize*0.5)}px">⚔️</span>`}} />
        ) : <span style={{fontSize:Math.floor(imgSize*0.5)}}>⚔️</span>}
      </div>
      <div style={{fontSize:size==='sm'?11:13,fontWeight:700,color:'#e8e8f0',textAlign:'center',lineHeight:1.2}}>{hero.name}</div>
      <div style={{color:'#f5c842',fontSize:size==='sm'?10:12,letterSpacing:1}}>{stars}</div>
      {hero.level && <div style={{fontSize:11,color:'#8888aa'}}>Lv.{hero.level}</div>}
      {showStats && (
        <div style={{width:'100%',fontSize:11,color:'#8888aa',marginTop:4}}>
          <div style={{display:'flex',justifyContent:'space-between'}}><span>HP</span><span style={{color:'#22c55e'}}>{hero.base_hp}</span></div>
          <div style={{display:'flex',justifyContent:'space-between'}}><span>ATK</span><span style={{color:'#e63946'}}>{hero.base_patk}</span></div>
        </div>
      )}
      {hero.formation_slot && (
        <div style={{position:'absolute',bottom:4,left:4,background:'#f5c842',color:'#0a0a0f',borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700}}>{hero.formation_slot}</div>
      )}
    </div>
  )
}
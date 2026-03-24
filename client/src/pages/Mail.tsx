import { useEffect, useState } from 'react'
import axios from 'axios'
import { useGameStore } from '../store/gameStore'

export default function Mail() {
  const [mails, setMails] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { addToast, refreshPlayer } = useGameStore()

  const load = () => { axios.get('/api/mail').then(r=>{setMails(r.data);setLoading(false)}).catch(()=>setLoading(false)) }
  useEffect(()=>{ load() }, [])

  const read = async (mail: any) => {
    setSelected(mail)
    if (!mail.is_read) { await axios.post('/api/mail/read/'+mail.id).catch(()=>{}); load() }
  }

  const claim = async (mailId: number) => {
    try {
      const res = await axios.post('/api/mail/claim/'+mailId)
      const c = res.data.claimed
      addToast('Claimed! '+[c.gold&&'+'+c.gold+' Gold',c.gems&&'+'+c.gems+' Gems',c.tickets&&'+'+c.tickets+' Tickets'].filter(Boolean).join(', '),'reward')
      load(); refreshPlayer(); setSelected(null)
    } catch(e:any) { addToast(e.response?.data?.error||'Failed','error') }
  }

  const claimAll = async () => {
    try {
      const res = await axios.post('/api/mail/claim-all')
      const c = res.data.claimed
      addToast('All claimed! '+[c.gold&&'+'+c.gold+' Gold',c.gems&&'+'+c.gems+' Gems',c.tickets&&'+'+c.tickets+' Tickets'].filter(Boolean).join(', '),'reward')
      load(); refreshPlayer()
    } catch(e:any) { addToast(e.response?.data?.error||'Failed','error') }
  }

  const unread = mails.filter(m=>!m.is_read).length
  const unclaimed = mails.filter(m=>!m.is_claimed&&m.attachments&&Object.keys(m.attachments||{}).some(k=>m.attachments[k]>0)).length

  if (loading) return <div className="loading"><div className="spinner"/><span>Loading mail...</span></div>

  return (
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h1 className="page-title" style={{marginBottom:0}}>📬 Mail {unread>0&&<span style={{fontSize:14,background:'#e63946',color:'white',borderRadius:10,padding:'2px 8px',marginLeft:8}}>{unread} new</span>}</h1>
        {unclaimed>0 && <button className="btn btn-gold btn-sm" onClick={claimAll}>Claim All Attachments</button>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {mails.map(m=>(
            <div key={m.id} onClick={()=>read(m)} style={{
              background:selected?.id===m.id?'rgba(245,200,66,0.08)':'#12121a',
              border:'1px solid '+(selected?.id===m.id?'#f5c84266':'#2a2a45'),
              borderRadius:8,padding:'12px 16px',cursor:'pointer',transition:'all 0.15s',
              opacity:m.is_read?0.7:1
            }}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <div style={{fontWeight:m.is_read?400:700,color:'#e8e8f0',fontSize:14}}>{m.subject}</div>
                  <div style={{fontSize:12,color:'#8888aa'}}>{m.sender}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                  {!m.is_read && <span style={{width:8,height:8,borderRadius:'50%',background:'#e63946',display:'block'}} />}
                  {!m.is_claimed&&m.attachments&&Object.values(m.attachments as Record<string,number>).some(v=>v>0) && <span style={{fontSize:10,color:'#f5c842'}}>📎</span>}
                </div>
              </div>
            </div>
          ))}
          {mails.length===0 && <div style={{textAlign:'center',color:'#8888aa',padding:40}}>No mail</div>}
        </div>
        {selected && (
          <div style={{background:'#12121a',border:'1px solid #2a2a45',borderRadius:12,padding:20}}>
            <h3 style={{fontFamily:'Cinzel,serif',fontSize:16,color:'#f5c842',marginBottom:4}}>{selected.subject}</h3>
            <div style={{fontSize:12,color:'#8888aa',marginBottom:16}}>From: {selected.sender}</div>
            <p style={{color:'#e8e8f0',fontSize:14,lineHeight:1.6,marginBottom:16}}>{selected.body}</p>
            {selected.attachments && Object.values(selected.attachments as Record<string,number>).some(v=>v>0) && (
              <div style={{background:'#1a1a28',borderRadius:8,padding:12,marginBottom:12}}>
                <div style={{fontSize:12,color:'#8888aa',marginBottom:8}}>📎 Attachments:</div>
                <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
                  {selected.attachments.gold>0&&<span>💰 {selected.attachments.gold} Gold</span>}
                  {selected.attachments.gems>0&&<span>💎 {selected.attachments.gems} Gems</span>}
                  {selected.attachments.tickets>0&&<span>🎫 {selected.attachments.tickets} Tickets</span>}
                </div>
              </div>
            )}
            {!selected.is_claimed && selected.attachments && Object.values(selected.attachments as Record<string,number>).some(v=>v>0) && (
              <button className="btn btn-gold w-full" onClick={()=>claim(selected.id)}>Claim Attachments</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
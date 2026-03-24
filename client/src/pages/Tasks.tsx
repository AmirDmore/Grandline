import { useEffect, useState } from 'react'
import axios from 'axios'
import { useGameStore } from '../store/gameStore'

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addToast, refreshPlayer } = useGameStore()

  const load = () => { axios.get('/api/tasks').then(r=>{setTasks(r.data);setLoading(false)}).catch(()=>setLoading(false)) }
  useEffect(()=>{ load() }, [])

  const claim = async (taskId: number) => {
    try {
      const res = await axios.post('/api/tasks/claim/'+taskId)
      const r = res.data.rewards
      addToast('Claimed! +'+r.gold+' Gold, +'+r.gems+' Gems, +'+r.tickets+' Tickets', 'reward')
      load(); refreshPlayer()
    } catch(e:any) { addToast(e.response?.data?.error||'Failed','error') }
  }

  if (loading) return <div className="loading"><div className="spinner"/><span>Loading tasks...</span></div>

  const completed = tasks.filter(t=>t.current_count>=t.target_count&&!t.claimed)
  const inProgress = tasks.filter(t=>t.current_count<t.target_count)
  const claimed = tasks.filter(t=>t.claimed)

  return (
    <div style={{animation:'fadeIn 0.3s ease'}}>
      <h1 className="page-title">📋 Daily Tasks</h1>
      {completed.length>0 && (
        <div style={{marginBottom:24}}>
          <h3 style={{fontFamily:'Cinzel,serif',fontSize:15,color:'#22c55e',marginBottom:12}}>✅ Ready to Claim ({completed.length})</h3>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {completed.map(t=>(
              <TaskRow key={t.id} task={t} onClaim={()=>claim(t.id)} />
            ))}
          </div>
        </div>
      )}
      <div style={{marginBottom:24}}>
        <h3 style={{fontFamily:'Cinzel,serif',fontSize:15,color:'#f5c842',marginBottom:12}}>📋 In Progress ({inProgress.length})</h3>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {inProgress.map(t=><TaskRow key={t.id} task={t} />)}
        </div>
      </div>
      {claimed.length>0 && (
        <div>
          <h3 style={{fontFamily:'Cinzel,serif',fontSize:15,color:'#8888aa',marginBottom:12}}>✓ Claimed ({claimed.length})</h3>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {claimed.map(t=><TaskRow key={t.id} task={t} />)}
          </div>
        </div>
      )}
    </div>
  )
}

function TaskRow({ task, onClaim }: { task: any, onClaim?: ()=>void }) {
  const pct = Math.min(100, Math.floor((task.current_count/task.target_count)*100))
  const canClaim = task.current_count>=task.target_count && !task.claimed
  return (
    <div style={{background:'#12121a',border:'1px solid '+(canClaim?'rgba(34,197,94,0.3)':task.claimed?'#2a2a45':'#2a2a45'),borderRadius:10,padding:16,display:'flex',alignItems:'center',gap:16,opacity:task.claimed?0.6:1}}>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,color:'#e8e8f0',marginBottom:2}}>{task.name}</div>
        <div style={{fontSize:12,color:'#8888aa',marginBottom:8}}>{task.description}</div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div className="progress-bar" style={{flex:1}}><div className="progress-fill green" style={{width:pct+'%'}} /></div>
          <span style={{fontSize:12,color:'#8888aa',whiteSpace:'nowrap'}}>{task.current_count}/{task.target_count}</span>
        </div>
      </div>
      <div style={{textAlign:'right',minWidth:100}}>
        <div style={{fontSize:12,color:'#8888aa',marginBottom:8}}>
          {task.reward_gold>0&&<span>💰{task.reward_gold} </span>}
          {task.reward_gems>0&&<span>💎{task.reward_gems} </span>}
          {task.reward_tickets>0&&<span>🎫{task.reward_tickets}</span>}
        </div>
        {canClaim && <button className="btn btn-gold btn-sm" onClick={onClaim}>Claim</button>}
        {task.claimed && <span style={{fontSize:12,color:'#22c55e'}}>✓ Done</span>}
      </div>
    </div>
  )
}
import React, { useState } from 'react';

const priorityColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

export default function Card({ card, columnKey, onUpdate, onDelete, agents = [] }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...card });

  function save(){
    onUpdate(card.id, form);
    setEditing(false);
  }

  return (
    <div className="card">
      <div className="card-top">
        <strong className="card-name">{card.name || 'Unnamed'}</strong>
        <button className="del" onClick={()=>onDelete(card.id)}>✕</button>
      </div>

      {!editing ? (
        <>
          <div className="card-content">
            {card.company && <div className="meta">🏢 {card.company}</div>}
            {card.email && <div className="meta">✉️ {card.email}</div>}
            {card.phone && <div className="meta">📞 {card.phone}</div>}
            {card.agent && <div className="meta">👤 {card.agent}</div>}
            {card.notes && <div className="notes">{card.notes}</div>}
          </div>

          <div className="card-footer">
            {['new','contacted','qualified','won','lost'].map(k => (
              k !== columnKey && <button key={k} onClick={()=>onUpdate(card.id, { stage: k })}>{k}</button>
            ))}
            <div className="priority" style={{ marginLeft: 'auto' }}>
              <span style={{background: priorityColors[card.priority||'Medium'], color:'#fff', padding:'4px 8px', borderRadius:6, fontSize:12}}>
                {card.priority || 'Medium'}
              </span>
            </div>
            <button className="btn-small" onClick={()=>{ setForm({ ...card }); setEditing(true); }}>Edit</button>
          </div>
        </>
      ) : (
        <div className="edit-area">
          <input value={form.name||''} onChange={e=>setForm(f=>({ ...f, name:e.target.value }))} placeholder="Name" />
          <input value={form.company||''} onChange={e=>setForm(f=>({ ...f, company:e.target.value }))} placeholder="Company" />
          <input value={form.email||''} onChange={e=>setForm(f=>({ ...f, email:e.target.value }))} placeholder="Email" />
          <input value={form.phone||''} onChange={e=>setForm(f=>({ ...f, phone:e.target.value }))} placeholder="Phone" />
          <select value={form.agent||''} onChange={e=>setForm(f=>({ ...f, agent:e.target.value }))}>
            <option value="">Unassigned</option>
            {agents.map(a => <option key={a}>{a}</option>)}
          </select>
          <select value={form.priority||'Medium'} onChange={e=>setForm(f=>({ ...f, priority:e.target.value }))}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <textarea value={form.notes||''} onChange={e=>setForm(f=>({ ...f, notes:e.target.value }))} placeholder="Notes" />
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={save} className="btn small primary">Save</button>
            <button onClick={()=>setEditing(false)} className="btn small ghost">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';

export default function AddModal({ onClose, onAdd, agents = [] }) {
  const [form, setForm] = useState({ name:'', company:'', email:'', phone:'', agent:'', notes:'', priority:'Medium', stage:'New Lead' });

  function submit(e){
    e.preventDefault();
    onAdd(form);
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header className="modal-head">
          <h3>Add Lead</h3>
          <button onClick={onClose} className="icon">✕</button>
        </header>
        <form className="modal-body" onSubmit={submit}>
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input placeholder="Company" value={form.company} onChange={e=>setForm({...form, company:e.target.value})} />
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
          <select value={form.agent} onChange={e=>setForm({...form, agent:e.target.value})}>
            <option value="">Unassigned</option>
            {agents.map(a=> <option key={a}>{a}</option>)}
          </select>
          <select value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <textarea placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
          <div className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">Add Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
}

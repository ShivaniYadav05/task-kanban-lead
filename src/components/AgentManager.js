import React, { useState } from 'react';

export default function AgentManager({ agents, onAdd }) {
  const [name, setName] = useState('');
  function add(){
    if(!name.trim()) return;
    onAdd(name.trim());
    setName('');
  }
  return (
    <div className="agent-manager">
      <h4>Agents</h4>
      <div className="agent-list">
        {agents.map(a => <div key={a} className="agent-item">{a}</div>)}
      </div>
      <div className="add-agent">
        <input placeholder="Agent name" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function StageManager({ columns, onAdd, onRename, onDelete }) {
  const [newTitle, setNewTitle] = useState('');
  const [renameMap, setRenameMap] = useState({});

  function handleAdd() {
    if(!newTitle.trim()) return;
    const key = uuidv4().slice(0,8);
    onAdd(key, newTitle.trim());
    setNewTitle('');
  }

  return (
    <div className="stage-manager">
      <h4>Stages</h4>
      <div className="stage-list">
        {Object.keys(columns).map(k => (
          <div key={k} className="stage-item">
            <input value={renameMap[k] ?? columns[k].title} onChange={e=>setRenameMap(m=>({ ...m, [k]: e.target.value }))} />
            <button onClick={()=>{ if(renameMap[k] && renameMap[k].trim()) onRename(k, renameMap[k].trim()); }}>Rename</button>
            {k !== 'new' && <button onClick={()=>onDelete(k)}>Delete</button>}
          </div>
        ))}
      </div>

      <div className="add-stage">
        <input placeholder="New stage title" value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
        <button onClick={handleAdd}>Add Stage</button>
      </div>
    </div>
  );
}

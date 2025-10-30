import React from 'react';
import Card from './Card';

export default function Column({ column, cards = [], allAgents, onAdd, onUpdate, onDelete, onDragStart, onDrop }) {
  // allow dropping at positions
  function handleDragOver(e){ e.preventDefault(); }

  function handleDrop(e){
    e.preventDefault();
    const payload = e.dataTransfer.getData('text/plain');
    try {
      const parsed = JSON.parse(payload);
      const toIndex = Number(e.currentTarget.dataset.dropIndex) || 0;
      onDrop({ toCol: column.id, toIndex });
    } catch(err){}
  }

  return (
    <section className="column" onDragOver={handleDragOver} onDrop={handleDrop} data-column={column.id}>
      <div className="col-header">
        <div className="col-title">
          <span className="dot" /> <strong>{column.title}</strong> <small>({column.cardIds?.length || 0})</small>
        </div>
      </div>

      <div className="col-body">
        <div className="add-placeholder">
          <button className="add-inline" onClick={()=>onAdd({ name:'New Lead', email:'', phone:'', company:'', agent:'', notes:'', priority:'Medium' })}>+ Add</button>
        </div>

        {cards.map((c, idx) => (
          <div key={c.id} draggable
               onDragStart={(e)=>{ e.dataTransfer.setData('text/plain', JSON.stringify({ fromCol: column.id, cardId: c.id, index: idx })); if(onDragStart) onDragStart({ fromCol: column.id, cardId: c.id, index: idx }); }}
               onDragOver={(e)=>e.preventDefault()}
               onDrop={(e)=>{ e.preventDefault(); // drop directly on card -> treated as dropping at card's position
                 try {
                   const payload = JSON.parse(e.dataTransfer.getData('text/plain'));
                   // call onDrop with index = idx to place above this card
                   if(onDrop) onDrop({ toCol: column.id, toIndex: idx });
                 } catch(err){}
               }}>
            <Card card={c} columnKey={column.id} onUpdate={onUpdate} onDelete={onDelete} agents={allAgents} />
          </div>
        ))}

      </div>
    </section>
  );
}

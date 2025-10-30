import React, { useEffect, useState } from 'react';
import Column from './Column';
import AddModal from './AddModal';

export default function Board({ state, addLead, updateCard, deleteCard, moveCard, reorderWithin, cardPassesFilters }) {
  const [showAdd, setShowAdd] = useState(false);
  const [dragInfo, setDragInfo] = useState(null);

  useEffect(()=>{
    const addBtn = document.getElementById('open-add');
    const exportBtn = document.getElementById('export-csv');
    if(addBtn) addBtn.onclick = ()=>setShowAdd(true);
    if(exportBtn) exportBtn.onclick = exportCSV;
    return ()=>{ if(addBtn) addBtn.onclick = null; if(exportBtn) exportBtn.onclick = null; };
  }, [state]);

  function exportCSV(){
    const rows = [['Name','Company','Email','Phone','Agent','Priority','Stage','Notes']];
    Object.values(state.cards).forEach(c=>{
      rows.push([c.name||'', c.company||'', c.email||'', c.phone||'', c.agent||'', c.priority||'', c.stage||'', c.notes||'']);
    });
    const csv = rows.map(r=> r.map(v=> `"${(''+v).replace(/"/g,'""')}"`).join(',') ).join('\\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click(); URL.revokeObjectURL(url);
  }

  // dnd handlers: pass through to columns
  function handleDragStart({ fromCol, cardId, index }){
    setDragInfo({ fromCol, cardId, index });
  }

  function handleDrop({ toCol, toIndex }){
    if(!dragInfo) return;
    const { fromCol, cardId, index: fromIndex } = dragInfo;
    if(fromCol === toCol){
      // reorder
      reorderWithin(toCol, fromIndex, toIndex);
    } else {
      moveCard(fromCol, toCol, cardId, toIndex);
    }
    setDragInfo(null);
  }

  return (
    <div className="board">
      {Object.keys(state.columns).map(colKey => (
        <Column
          key={colKey}
          column={state.columns[colKey]}
          cards={state.columns[colKey].cardIds.map(id => state.cards[id]).filter(card => cardPassesFilters(card))}
          allAgents={state.agents}
          onAdd={(lead)=>addLead(colKey, lead)}
          onUpdate={updateCard}
          onDelete={deleteCard}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}

      {showAdd && <AddModal onClose={()=>setShowAdd(false)} onAdd={(payload)=>{ addLead('new', payload); setShowAdd(false); }} agents={state.agents} />}
    </div>
  );
}

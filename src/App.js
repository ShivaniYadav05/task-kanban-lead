import React, { useEffect, useState } from 'react';
import Board from './components/Board';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import StageManager from './components/StageManager';
import AgentManager from './components/AgentManager';

const STORAGE_KEY = 'lm-kanban-v1';

const defaultAgents = ['Priya Patel','John Smith','Ahmed Hassan'];

export default function App(){
  const [state, setState] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
    // initial default state
    return {
      columns: {
        new: { id:'new', title:'New Lead', cardIds: [] },
        contacted: { id:'contacted', title:'Contacted', cardIds: [] },
        qualified: { id:'qualified', title:'Qualified', cardIds: [] },
        won: { id:'won', title:'Won', cardIds: [] },
        lost: { id:'lost', title:'Lost', cardIds: [] }
      },
      cards: {},
      agents: defaultAgents
    };
  });

  useEffect(()=> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Filters
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // state operations
  function addAgent(name){
    if(!name) return;
    setState(s => ({ ...s, agents: [...s.agents, name] }));
  }

  function addStage(key, title){
    // key must be unique
    setState(s => ({ ...s, columns: { ...s.columns, [key]: { id:key, title, cardIds: [] } } }));
  }

  function renameStage(key, newTitle){
    setState(s => ({ ...s, columns: { ...s.columns, [key]: { ...s.columns[key], title: newTitle }}}));
  }

  function deleteStage(key){
    // move cards to 'new' before deleting (or drop them)
    setState(s => {
      const columns = {...s.columns};
      const cards = {...s.cards};
      const toMove = columns[key].cardIds || [];
      // append to 'new'
      columns['new'].cardIds = [...toMove, ...columns['new'].cardIds];
      delete columns[key];
      return {...s, columns, cards};
    });
  }

  function addLead(columnKey, lead){ // lead: {name, email, phone, agent, notes, priority}
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const card = { id, ...lead, stage: state.columns[columnKey].title };
    setState(s => ({
      ...s,
      cards: { ...s.cards, [id]: card },
      columns: { ...s.columns, [columnKey]: { ...s.columns[columnKey], cardIds: [id, ...s.columns[columnKey].cardIds] } }
    }));
  }

  function updateCard(id, patch){
    setState(s => ({ ...s, cards: { ...s.cards, [id]: { ...s.cards[id], ...patch }}}));
  }

  function deleteCard(id){
    setState(s => {
      const cards = {...s.cards};
      delete cards[id];
      const columns = {...s.columns};
      Object.keys(columns).forEach(k => {
        columns[k].cardIds = columns[k].cardIds.filter(cid => cid !== id);
      });
      return {...s, cards, columns};
    });
  }

  function moveCard(fromCol, toCol, cardId, toIndex = 0){
    setState(s => {
      if(!s.columns[fromCol] || !s.columns[toCol]) return s;
      const from = Array.from(s.columns[fromCol].cardIds);
      const to = Array.from(s.columns[toCol].cardIds);
      const idx = from.indexOf(cardId);
      if(idx > -1) from.splice(idx,1);
      to.splice(toIndex, 0, cardId);
      // update card stage string
      const cards = {...s.cards, [cardId]: { ...s.cards[cardId], stage: s.columns[toCol].title }};
      return { ...s, columns: { ...s.columns, [fromCol]: { ...s.columns[fromCol], cardIds: from }, [toCol]: { ...s.columns[toCol], cardIds: to } }, cards };
    });
  }

  function reorderWithin(colKey, fromIndex, toIndex){
    setState(s => {
      const list = Array.from(s.columns[colKey].cardIds);
      const [moved] = list.splice(fromIndex,1);
      list.splice(toIndex,0,moved);
      return { ...s, columns: { ...s.columns, [colKey]: { ...s.columns[colKey], cardIds: list } }};
    });
  }

  // search + filter helper
  function cardPassesFilters(card){
    if(!card) return false;
    const q = query.trim().toLowerCase();
    if(q){
      const fields = [card.name, card.email, card.phone, card.company, card.notes].join(' ').toLowerCase();
      if(!fields.includes(q)) return false;
    }
    if(stageFilter !== 'All' && card.stage !== stageFilter) return false;
    if(agentFilter !== 'All' && card.agent !== agentFilter) return false;
    if(priorityFilter !== 'All' && (card.priority || 'Medium') !== priorityFilter) return false;
    return true;
  }

  return (
    <div className="app">
      <Header
        query={query} setQuery={setQuery}
        stageFilter={stageFilter} setStageFilter={setStageFilter}
        agentFilter={agentFilter} setAgentFilter={setAgentFilter}
        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
        agents={state.agents}
      />

      <div className="container">
        <div className="top-row">
          <Dashboard state={state} />
          <div className="managers">
            <StageManager
              columns={state.columns}
              onAdd={addStage}
              onRename={renameStage}
              onDelete={deleteStage}
            />
            <AgentManager agents={state.agents} onAdd={addAgent} />
          </div>
        </div>

        <Board
          state={state}
          addLead={addLead}
          updateCard={updateCard}
          deleteCard={deleteCard}
          moveCard={moveCard}
          reorderWithin={reorderWithin}
          cardPassesFilters={cardPassesFilters}
        />
      </div>
    </div>
  );
}

import React from 'react';

export default function Header({ query, setQuery, stageFilter, setStageFilter, agentFilter, setAgentFilter, priorityFilter, setPriorityFilter, agents }) {
  return (
    <header className="topbar">
      <div className="topbar-row">
        <div className="title">Lead Management</div>
        <div className="actions">
          <button className="btn ghost">Dashboard</button>
          <button className="btn success" id="export-csv">Export CSV</button>
          <button className="btn primary" id="open-add">+ Add Lead</button>
        </div>
      </div>

      <div className="filters">
        <input placeholder="Search leads by name, email, phone, notes..." value={query} onChange={e=>setQuery(e.target.value)} />
        <select value={stageFilter} onChange={e=>setStageFilter(e.target.value)}>
          <option>All</option>
          {Object.values(JSON.parse(JSON.stringify(window.__initialColumns || {}))).length === 0 ? null : null}
          <option>New Lead</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Won</option>
          <option>Lost</option>
        </select>
        <select value={agentFilter} onChange={e=>setAgentFilter(e.target.value)}>
          <option>All</option>
          {agents.map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)}>
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
    </header>
  );
}

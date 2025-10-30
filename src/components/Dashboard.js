import React from 'react';

export default function Dashboard({ state }) {
  const stageCounts = {};
  Object.keys(state.columns).forEach(k => {
    stageCounts[state.columns[k].title] = state.columns[k].cardIds.length;
  });

  const agentCounts = {};
  Object.values(state.cards).forEach(c => {
    const a = c.agent || 'Unassigned';
    agentCounts[a] = (agentCounts[a] || 0) + 1;
  });

  return (
    <div className="dashboard">
      <h4>Dashboard</h4>
      <div className="dash-grid">
        <div className="dash-card">
          <strong>Leads per stage</strong>
          {Object.keys(stageCounts).map(k=>(
            <div key={k} className="dash-row">
              <span>{k}</span><span>{stageCounts[k]}</span>
            </div>
          ))}
        </div>
        <div className="dash-card">
          <strong>Leads per agent</strong>
          {Object.keys(agentCounts).length === 0 && <div>No leads</div>}
          {Object.keys(agentCounts).map(a=>(
            <div key={a} className="dash-row">
              <span>{a}</span><span>{agentCounts[a]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

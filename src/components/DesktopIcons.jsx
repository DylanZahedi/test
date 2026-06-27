import React, { useState, useEffect } from 'react';

const DesktopIcons = ({ toggleWindow, tutorialStep, advanceTutorial, telemetryData }) => {
  const [tData, setTData] = useState({
    status: 'STANDBY', commits: '--', projects: '--', added: '--', removed: '--',
    bars: { commits: '0%', projects: '0%', added: '0%', removed: '0%', tier: '0%' },
    tierText: 'System scanning for parameters...', nextTier: 'AWAITING IDENTITY',
    tierColor: '#ff2a5f', nextColor: '#4a7bfe'
  });

  useEffect(() => {
    if (telemetryData) {
      const { tier, stats } = telemetryData;
      setTData(p => ({ ...p, status: 'CONNECTED' }));

      setTimeout(() => setTData(p => ({ ...p, commits: stats.merged_commits || '0', bars: { ...p.bars, commits: '100%' } })), 500);
      setTimeout(() => setTData(p => ({ ...p, projects: stats.project_count || '0', bars: { ...p.bars, projects: '100%' } })), 900);
      setTimeout(() => setTData(p => ({ ...p, added: '+' + (stats.lines_added || '0'), bars: { ...p.bars, added: '100%' } })), 1300);
      setTimeout(() => setTData(p => ({ ...p, removed: '-' + (stats.lines_removed || '0'), bars: { ...p.bars, removed: '100%' } })), 1700);

      let nextTier = 'SILVER'; let progressPct = '65%'; let fillPct = '65%';
      let currentTier = (tier || "").toUpperCase();
      let tierColor = '#ff2a5f'; let nextColor = '#4a7bfe';

      if(currentTier === 'BRONZE') { nextTier = 'SILVER'; progressPct = '68%'; fillPct = '68%'; tierColor = '#ff2a5f'; nextColor = '#4a7bfe'; } 
      else if(currentTier === 'SILVER') { nextTier = 'GOLD'; progressPct = '82%'; fillPct = '82%'; tierColor = '#4a7bfe'; nextColor = '#9d4edd'; } 
      else if(currentTier === 'GOLD') { nextTier = 'MAX LEVEL'; progressPct = '100% Achieved'; fillPct = '100%'; tierColor = '#9d4edd'; nextColor = '#9d4edd'; }

      setTimeout(() => {
        setTData(p => ({
          ...p, nextTier, tierColor, nextColor, bars: { ...p.bars, tier: fillPct },
          tierText: fillPct === '100%' ? 'Highest tier unlocked!' : `${progressPct} completed to next tier`
        }));
      }, 2100);
    }
  }, [telemetryData]);

  return (
    <div id="desktop">
      <div className="metrics-panel" id="metrics-panel">
        <div className="metrics-header">
          CONTRIBUTOR TELEMETRY
          <span className={`status-badge ${tData.status === 'CONNECTED' ? 'active' : ''}`}>{tData.status}</span>
        </div>
        
        <div className="metric-row">
          <div className="metric-label"><span>Verified Commits</span> <span>{tData.commits}</span></div>
          <div className="metric-bar-bg"><div className="metric-bar-fill" style={{background: '#ff2a5f', width: tData.bars.commits}}></div></div>
        </div>
        <div className="metric-row">
          <div className="metric-label"><span>Projects Involved</span> <span>{tData.projects}</span></div>
          <div className="metric-bar-bg"><div className="metric-bar-fill" style={{background: '#4a7bfe', width: tData.bars.projects}}></div></div>
        </div>
        <div className="metric-row">
          <div className="metric-label"><span>Lines Added</span> <span style={{color: '#10b981'}}>{tData.added}</span></div>
          <div className="metric-bar-bg"><div className="metric-bar-fill" style={{background: '#10b981', width: tData.bars.added}}></div></div>
        </div>
        <div className="metric-row">
          <div className="metric-label"><span>Lines Removed</span> <span style={{color: '#ef4444'}}>{tData.removed}</span></div>
          <div className="metric-bar-bg"><div className="metric-bar-fill" style={{background: '#ef4444', width: tData.bars.removed}}></div></div>
        </div>
        
        <div className="tier-progress">
          <div className="tier-label">Next Tier Target: <span style={{color: tData.nextColor}}>{tData.nextTier}</span></div>
          <div className="metric-bar-bg" style={{height: '10px', borderRadius: '5px'}}>
            <div className="metric-bar-fill" style={{background: `linear-gradient(90deg, ${tData.tierColor}, ${tData.nextColor})`, width: tData.bars.tier}}></div>
          </div>
          <div className="metric-label" style={{justifyContent: 'center', marginTop: '8px', fontSize: '9px'}}>{tData.tierText}</div>
        </div>
      </div>

      <div className="icon-grid">
        <div className="icon-wrapper" onDoubleClick={() => toggleWindow('guide')}>
          <div className="desktop-icon">
            <svg className="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <span>System_Guide<br />.txt</span>
          </div>
        </div>

        <div className="icon-wrapper">
          <div className={`tutorial-ring ring-1 ${tutorialStep === 1 ? 'active' : ''}`}></div>
          <div className="tutorial-tooltip tooltip-step-1 left-arrow" style={{ opacity: tutorialStep === 1 ? 1 : 0, visibility: tutorialStep === 1 ? 'visible' : 'hidden' }}>
            <div className="tooltip-title">STEP 1: INITIALIZE</div>
            <div className="tooltip-text">Double-click the letter icon to read your appreciation message.</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => { toggleWindow('letter'); advanceTutorial(2); }}>
            <svg className="svg-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>Letter_of_<br />Appreciation</span>
          </div>
        </div>

        <div className="icon-wrapper">
          <div className={`tutorial-ring ring-2 ${tutorialStep === 2 ? 'active' : ''}`}></div>
          <div className="tutorial-tooltip tooltip-step-2 left-arrow" style={{ opacity: tutorialStep === 2 ? 1 : 0, visibility: tutorialStep === 2 ? 'visible' : 'hidden' }}>
            <div className="tooltip-title">STEP 2: PROVISION</div>
            <div className="tooltip-text">Execution authorized. Double-click the provisioning terminal.</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => { toggleWindow('tool'); advanceTutorial(3); }}>
            <svg className="svg-icon" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
            <span>CRT_Gen.sh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopIcons;

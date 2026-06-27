import React, { useState, useEffect } from 'react';

const Taskbar = ({ windows, toggleWindow, overviewMode, toggleOverview }) => {
  const [time, setTime] = useState('00:00');
  const [date, setDate] = useState('JAN 01, 2026');

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setTime(d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0'));
      setDate(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase());
    };
    
    updateClock(); 
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <div 
          className={`overview-btn ${overviewMode ? 'active' : ''}`} 
          onClick={toggleOverview} 
          title="Task View (Overview)"
        >
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </div>
        <div className="taskbar-divider"></div>
      </div>

      <div className="dock-container">
        
        {windows?.guide?.isOpen && (
          <div 
            className={`dock-item running ${windows.guide.isActive ? 'focused' : ''}`} 
            onClick={() => toggleWindow('guide')}
          >
            <div className="dock-tooltip">System Guide</div>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
        )}

        {windows?.letter?.isOpen && (
          <div 
            className={`dock-item running ${windows.letter.isActive ? 'focused' : ''}`} 
            onClick={() => toggleWindow('letter')}
          >
            <div className="dock-tooltip">Briefing Letter</div>
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
        )}
        
        {windows?.tool?.isOpen && (
          <div 
            className={`dock-item running ${windows.tool.isActive ? 'focused' : ''}`} 
            onClick={() => toggleWindow('tool')}
          >
            <div className="dock-tooltip">Terminal Engine</div>
            <svg viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
          </div>
        )}
        
        {windows?.cert?.isOpen && (
          <div 
            className={`dock-item running ${windows.cert.isActive ? 'focused' : ''}`} 
            onClick={() => toggleWindow('cert')}
          >
            <div className="dock-tooltip">Identity Viewer</div>
            <svg viewBox="0 0 24 24"><path d="M12 15l-2 5l9-5l-2-5l-2-5l-9 5l-2-5l-2 5l9 5z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
        )}
      </div>

      <div className="taskbar-right">
        <div className="sys-tray">
          <span className="lang-ind" title="Keyboard Layout: English">EN</span>
          <svg viewBox="0 0 24 24" title="Network: Wired Connected"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          <svg viewBox="0 0 24 24" title="Volume: 100%"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          <div className="power-btn" onClick={() => { alert('Session closed.'); window.location.reload(); }} title="Log Out">
            <svg viewBox="0 0 24 24"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
          </div>
        </div>
        <div className="clock-widget">
          <span className="clock-time">{time}</span>
          <span className="clock-date">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
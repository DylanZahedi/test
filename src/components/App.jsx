import React, { useState, useEffect } from 'react';
import Taskbar from './components/Taskbar';
import DesktopIcons from './components/DesktopIcons';
import OSWindow from './components/OSWindow';
import SystemGuide from './components/apps/SystemGuide';
import LetterOfAppreciation from './components/apps/LetterOfAppreciation';
import TerminalEngine from './components/apps/TerminalEngine';
import CertificateViewer from './components/apps/CertificateViewer';
import './index.css';

const App = () => {
  const [highestZ, setHighestZ] = useState(100);
  const [overviewMode, setOverviewMode] = useState(false);
  const [certTargetId, setCertTargetId] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(1);
  const [telemetryData, setTelemetryData] = useState(null);
  
  const [openedOnce, setOpenedOnce] = useState({ letter: false, tool: false });

  const [windows, setWindows] = useState({
    guide: { isOpen: false, isActive: false, isMaximized: false, zIndex: 100, title: 'cat ~/docs/System_Guide.txt', top: '15%', left: '30%', width: '550px', height: '400px' },
    letter: { isOpen: false, isActive: false, isMaximized: false, zIndex: 100, title: 'vi ~/desktop/Letter_of_Appreciation.txt', top: '25%', left: '20%', width: '550px', height: '350px' },
    tool: { isOpen: false, isActive: false, isMaximized: false, zIndex: 100, title: 'root@owasp-os: ~', top: '20%', left: '35%', width: '550px', height: '350px' },
    cert: { isOpen: false, isActive: false, isMaximized: false, zIndex: 100, title: 'OWASP_CRT_Certificate.exe', top: '15%', left: '15%', width: '900px', height: '75vh' }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (id) {
      setCertTargetId(id);
      setTutorialStep(0); 

      setWindows(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => newState[key].isActive = false);
        newState.cert = { ...newState.cert, isOpen: true, isActive: true, isMaximized: true, zIndex: 1000 };
        return newState;
      });
      setHighestZ(1000);

    } else {
      setTimeout(() => { toggleWindow('guide', true); }, 100);
    }
  }, []);

  const focusWindow = (id) => {
    if (overviewMode) setOverviewMode(false);
    setHighestZ(prev => prev + 1);
    setWindows(prev => {
      const newState = { ...prev };
      Object.keys(newState).forEach(key => newState[key].isActive = false);
      newState[id].isActive = true;
      newState[id].zIndex = highestZ + 1;
      return newState;
    });
  };

  const closeWindow = (id) => {
    setWindows(prev => {
      const newState = { ...prev, [id]: { ...prev[id], isOpen: false, isActive: false } };
      let maxZ = 0; let nextWin = null;
      Object.keys(newState).forEach(key => {
        if (newState[key].isOpen && newState[key].zIndex > maxZ) {
          maxZ = newState[key].zIndex; nextWin = key;
        }
      });
      if (nextWin) newState[nextWin].isActive = true;
      return newState;
    });
  };

  const toggleWindow = (id, forceOpen = false) => {
    if (overviewMode) setOverviewMode(false);
    
    if (id === 'letter' && !openedOnce.letter) setOpenedOnce(p => ({ ...p, letter: true }));
    if (id === 'tool' && !openedOnce.tool) setOpenedOnce(p => ({ ...p, tool: true }));

    setWindows(prev => {
      const isCurrentlyOpen = prev[id].isOpen;
      const shouldOpen = forceOpen || !isCurrentlyOpen || !prev[id].isActive;
      
      if (!shouldOpen && isCurrentlyOpen && prev[id].isActive) {
         const newState = { ...prev, [id]: { ...prev[id], isOpen: false, isActive: false } };
         let maxZ = 0; let nextWin = null;
         Object.keys(newState).forEach(key => {
           if (newState[key].isOpen && newState[key].zIndex > maxZ) {
             maxZ = newState[key].zIndex; nextWin = key;
           }
         });
         if (nextWin) newState[nextWin].isActive = true;
         return newState;
      }
      
      const newZ = highestZ + 1;
      setHighestZ(newZ);
      const newState = { ...prev };
      Object.keys(newState).forEach(key => newState[key].isActive = false);
      newState[id] = { ...prev[id], isOpen: true, isActive: true, zIndex: newZ };
      return newState;
    });
  };

  const toggleMaximize = (id) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isMaximized: !prev[id].isMaximized } }));
  };

  const advanceTutorial = (step) => {
    if (step === 2 && tutorialStep === 1) {
      setTutorialStep(1.5); 
      setTimeout(() => setTutorialStep(2), 2000);
    } else if (step === 3 && tutorialStep === 2) {
      setTutorialStep(3);
    }
  };

  return (
    <div className="app-container" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="bg-layer">
        <div className="orb-1"></div>
        <div className="orb-2"></div>
        <div className="bg-noise"></div>
      </div>

      <Taskbar windows={windows} toggleWindow={toggleWindow} overviewMode={overviewMode} toggleOverview={() => setOverviewMode(!overviewMode)} />

      <DesktopIcons 
        toggleWindow={toggleWindow} 
        tutorialStep={tutorialStep} 
        advanceTutorial={advanceTutorial} 
        telemetryData={telemetryData} 
      />

      <div id="window-manager" className={overviewMode ? 'overview-mode' : ''} onClick={(e) => { if (e.target.id === 'window-manager') setOverviewMode(false); }}>
        
        <OSWindow id="guide-win" {...windows.guide} onClose={() => closeWindow('guide')} onMinimize={() => toggleWindow('guide')} onMaximize={() => toggleMaximize('guide')} onFocus={() => focusWindow('guide')}>
          <SystemGuide />
        </OSWindow>

        <OSWindow id="letter-win" {...windows.letter} onClose={() => closeWindow('letter')} onMinimize={() => toggleWindow('letter')} onMaximize={() => toggleMaximize('letter')} onFocus={() => focusWindow('letter')}>
          <LetterOfAppreciation startTyping={openedOnce.letter} />
        </OSWindow>

        <OSWindow id="tool-win" {...windows.tool} onClose={() => closeWindow('tool')} onMinimize={() => toggleWindow('tool')} onMaximize={() => toggleMaximize('tool')} onFocus={() => focusWindow('tool')}>
          <TerminalEngine startFlow={openedOnce.tool} />
        </OSWindow>

        <OSWindow id="cert-win" {...windows.cert} onClose={() => closeWindow('cert')} onMinimize={() => toggleWindow('cert')} onMaximize={() => toggleMaximize('cert')} onFocus={() => focusWindow('cert')}>
          <CertificateViewer certId={certTargetId} isMaximized={windows.cert.isMaximized} setTelemetryData={setTelemetryData} />
        </OSWindow>

      </div>
    </div>
  );
};

export default App;
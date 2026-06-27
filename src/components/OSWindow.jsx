import React, { useRef } from 'react';
import Draggable from 'react-draggable';

const OSWindow = ({ id, title, isOpen, isActive, isMaximized, zIndex, top, left, width, height, onClose, onMinimize, onMaximize, onFocus, children }) => {
  const nodeRef = useRef(null);

  return (
    <Draggable 
      nodeRef={nodeRef} 
      handle=".title-bar" 
      onStart={onFocus}
    >
      <div 
        ref={nodeRef}
        id={id} 
        className={`os-window ${isActive ? 'active' : ''} ${isMaximized ? 'maximized' : ''}`}
        style={{ 
          zIndex, 
          display: isOpen ? 'flex' : 'none',
          position: 'absolute', 
          top, left, width, height
        }}
        onClick={onFocus}
      >
        <div className="title-bar">
          <div className="window-controls">
            <div className="control-btn close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}></div>
            <div className="control-btn min-btn" onClick={(e) => { e.stopPropagation(); onMinimize(); }}></div>
            <div className="control-btn max-btn" onClick={(e) => { e.stopPropagation(); onMaximize(); }}></div>
          </div>
          <div className="window-title">{title}</div>
          <div style={{ width: '40px' }}></div>
        </div>
        
        <div 
          className="window-content" 
          style={{ 
            height: 'calc(100% - 38px)', 
            display: 'flex', 
            flexDirection: 'column',
            background: 'transparent' 
          }}
        >
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export default OSWindow;
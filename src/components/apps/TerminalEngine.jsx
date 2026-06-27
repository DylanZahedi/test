import React, { useState, useEffect, useRef } from 'react';

const TerminalEngine = ({ startFlow }) => {
  const [history, setHistory] = useState([
    `<span class="term-user">root</span><span style="color:#fff;">@</span><span class="term-host">owasp-os</span>:~$ ./crt_provision.sh<br>`
  ]);
  const [termState, setTermState] = useState(0); 
  const [inputVal, setInputVal] = useState('');
  const [firstName, setFirstName] = useState('');
  const inputRef = useRef(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!startFlow || hasStarted.current) return;
    hasStarted.current = true;

    const t1 = setTimeout(() => setHistory(p => [...p, `<span class="term-out">[+] Initializing secure identity provisioning...</span><br>`]), 600);
    const t2 = setTimeout(() => setHistory(p => [...p, `<span class="term-out">[+] Connecting to OWASP verification matrix... OK</span><br><br>`]), 1200);
    const t3 = setTimeout(() => { setTermState(1); inputRef.current?.focus(); }, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [startFlow]);

  const handleInput = (e) => {
    if (e.key === 'Enter') {
      const val = inputVal.trim();
      if (!val) return;
      
      if (termState === 1) {
        setFirstName(val);
        setHistory(p => [...p, `<span style="color:#9d4edd;">Enter Target First Name: </span>${val}<br>`]);
        setTermState(2);
      } else if (termState === 2) {
        setHistory(p => [
          ...p, 
          `<span style="color:#9d4edd;">Enter Target Last Name: </span>${val}<br><br>`,
          `<span class="term-success">[✓] Identity parsed successfully.</span><br>`,
          `<span class="term-out">[*] Generating repository issue request...</span><br>`
        ]);
        setTermState(3);
        
        setTimeout(() => {
          const fullName = firstName + " " + val;
          const issueUrl = `https://github.com/DylanZahedi/test2/issues/new?title=Cert Request: Generate My Certificate&body=${encodeURIComponent(`Please issue my certificate of participation in OWASP projects.\n\nFullName: ${fullName}`)}`;
          window.open(issueUrl, '_blank');
        }, 1500);
      }
      setInputVal('');
    }
  };


  return (
    <div className="terminal-bg" onClick={() => inputRef.current?.focus()}>
      <div id="term-output">
        {history.map((line, idx) => <span key={idx} dangerouslySetInnerHTML={{ __html: line }}></span>)}
      </div>
      
      {termState >= 1 && termState < 3 && (
        <div className="term-prompt-line">
          <span id="term-prompt" style={{color: '#9d4edd'}}>
            {termState === 1 ? "Enter Target First Name: " : "Enter Target Last Name: "}
          </span>
          <input 
            type="text" 
            ref={inputRef}
            className="term-input-field" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleInput}
            autoComplete="off"
          />
        </div>
      )}
    </div>
  );
};

export default TerminalEngine;

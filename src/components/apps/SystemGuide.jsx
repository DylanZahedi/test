import React from 'react';

const SystemGuide = () => {
  return (
    <div className="text-editor-content">
      <h3 style={{ color: '#10b981', fontSize: '18px', marginBottom: '10px' }}>
        &gt; WELCOME TO OWASP OS Workspace
      </h3>
      <p>
        This secure environment is designed for verified contributors to provision and view their digital recognition credentials.
      </p>
      
      <h4 style={{ color: '#9d4edd', marginTop: '25px', marginBottom: '5px', fontSize: '14px' }}>
        [ SYSTEM WORKFLOW ]
      </h4>
      <ul className="guide-list">
        <li>Read your initial briefing in <b>Letter_of_Appreciation</b>.</li>
        <li>Execute <b>CRT_Gen.sh</b> to initialize your identity request via terminal.</li>
        <li>Provide your First and Last name into the terminal prompt.</li>
        <li>The system will redirect you to GitHub to open an official issue.</li>
        <li>Once approved by the team, you will be provided a secure link.</li>
      </ul>
      <br />
      <p style={{ color: '#64748b', fontSize: '12px' }}>
        &gt; Status: System ready. Awaiting user input...
      </p>
    </div>
  );
};

export default SystemGuide;
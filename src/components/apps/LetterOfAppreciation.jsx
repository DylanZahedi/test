import React, { useEffect, useState, useRef } from 'react';

const LetterOfAppreciation = ({ startTyping }) => {
  const [content, setContent] = useState('');
  const hasTyped = useRef(false);

  useEffect(() => {
    if (!startTyping || hasTyped.current) return;
    hasTyped.current = true;

    const letterLines = [
        "Initiating secure connection...",
        "<br>The open web faces relentless threats daily.",
        "Its defense relies on the dedication of <span class='highlight'>exceptional individuals</span>.",
        "Through your research and code, you have strengthened our collective security.",
        "The <span class='owasp-text'>OWASP Foundation</span> recognizes your vital impact.",
        "<br><span style='color:#64748b;'>-- OWASP-CRT Project Leader</span>",
        "<br>> Execute CRT_Gen.sh to claim your verifiable credential."
    ];

    let currentLine = 0; let currentChar = 0; let isTag = false; let tagBuffer = '';
    let currentHTML = '';
    let timer;

    const type = () => {
      if (currentLine < letterLines.length) {
        let lineStr = letterLines[currentLine];
        if (currentChar < lineStr.length) {
          let char = lineStr.charAt(currentChar);
          if (char === '<') isTag = true;

          if (isTag) {
            tagBuffer += char;
            if (char === '>') {
              isTag = false; currentHTML += tagBuffer; setContent(currentHTML); tagBuffer = '';
            }
            currentChar++; timer = setTimeout(type, 0); 
          } else {
            currentHTML += char; setContent(currentHTML); currentChar++; timer = setTimeout(type, 30);
          }
        } else {
          currentHTML += '<br>'; setContent(currentHTML); currentLine++; currentChar = 0; timer = setTimeout(type, 500);
        }
      }
    };
    
    timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, [startTyping]);

  return (
    <div className="text-editor-content">
      <span dangerouslySetInnerHTML={{ __html: content }}></span>
      {startTyping && <span className="cursor"></span>}
    </div>
  );
};

export default LetterOfAppreciation;
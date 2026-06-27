import React, { useEffect, useRef, useState } from 'react';
import qrcode from 'qrcode-generator';

const CertificateViewer = ({ certId, isMaximized, setTelemetryData }) => {
  const canvasRef = useRef(null);
  const [certUser, setCertUser] = useState(null);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(true); 
  
  const images = useRef({
    logo: new Image(), sign: new Image(), pattern: new Image()
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!certId) return; 
      
      setError(null); 

      try {
        const repoOwner = "Galaxy-sc";
        const repoName = "test2";
        const rawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/data/certs/${certId}.json`;
        
        const response = await fetch(rawUrl);
        if (!response.ok) throw new Error("Certificate data not found.");
        
        const data = await response.json();
        setCertUser(data);
        
        if(setTelemetryData) setTelemetryData({ tier: data.tier, stats: data.stats || {} });

      } catch (e) {
        console.error("Fetch Error: ", e);
        setError("The document was not found either it's loading or it does not exist.");
      }
    };
    fetchData();
  }, [certId, setTelemetryData]);

  useEffect(() => {
    if (!certUser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let t = 0;

    images.current.logo.src = "/test2/assets/owasp-logo.svg";
    images.current.sign.src = "/test2/assets/sign.svg";
    
    switch (certUser.tier) {
      case "Bronze": images.current.pattern.src = "/test2/assets/stage-1.svg"; break;
      case "Silver": images.current.pattern.src = "/test2/assets/stage-2.svg"; break;
      case "Gold": images.current.pattern.src = "/test2/assets/stage-3.svg"; break;
      default: images.current.pattern.src = "/test2/assets/stage-1.svg"; break;
    }

    const capitalizeRegex = (str) => str.replace(/(^\w|\s\w)/g, m => m.toUpperCase());

    const getGradient = () => {
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const currentTier = certUser.tier || "Bronze";
      switch (currentTier) {
        case "Bronze": g.addColorStop(0, "#ff0044"); g.addColorStop(1, "#ff3396"); break;
        case "Silver": g.addColorStop(0, "#3fbbfe"); g.addColorStop(1, "#4157ff"); break;
        case "Gold": g.addColorStop(0, "#ff46f0"); g.addColorStop(1, "#711bff"); break;
        default: g.addColorStop(0, "#ff0044"); g.addColorStop(1, "#ff3396"); break;
      }
      return g;
    };

    const drawLineJustified = (ctx, words, x, y, maxWidth) => {
      if (words.length === 0) return;
      if (words.length === 1) { ctx.textAlign = 'left'; ctx.fillText(words[0], x, y); return; }
      let totalWordsWidth = 0;
      for (let word of words) totalWordsWidth += ctx.measureText(word).width;
      const totalSpaces = words.length - 1;
      const extraSpace = (maxWidth - totalWordsWidth) / totalSpaces;
      let currentX = x;
      for (let i = 0; i < words.length; i++) {
        ctx.textAlign = 'left'; ctx.fillText(words[i], currentX, y);
        if (i < words.length - 1) currentX += ctx.measureText(words[i]).width + extraSpace;
      }
    };

    const drawJustifiedText = (ctx, text, x, y, maxWidth, lineHeight) => {
      const words = text.split(' '); let currentLine = []; let currentWidth = 0;
      for (let i = 0; i < words.length; i++) {
        const wordWidth = ctx.measureText(words[i] + ' ').width;
        if (currentWidth + wordWidth <= maxWidth) { currentLine.push(words[i]); currentWidth += wordWidth; } 
        else { drawLineJustified(ctx, currentLine, x, y, maxWidth); y += lineHeight; currentLine = [words[i]]; currentWidth = ctx.measureText(words[i] + ' ').width; }
      }
      if (currentLine.length > 0) { ctx.textAlign = 'left'; ctx.fillText(currentLine.join(' '), x, y); }
    };

    const generateQRCodeAdvanced = (options = {}) => {
      const { size = 250, color = '#1a1a2e', dotStyle = 'rounded' } = options;
      const qr = qrcode(0, 'H');
      const qrUrl = window.location.href.includes('?id=') ? window.location.href : `https://galaxy-sc.github.io/test2/?id=${certUser.id || "0"}`;
      qr.addData(qrUrl); qr.make();
      const cells = qr.getModuleCount(); const cellSize = size / cells;
      for (let row = 0; row < cells; row++) {
        for (let col = 0; col < cells; col++) {
          if (qr.isDark(row, col)) {
            const x = 190 + col * cellSize; const y = 3000 + row * cellSize;
            ctx.fillStyle = color;
            if (dotStyle === 'rounded') {
              ctx.beginPath(); ctx.arc(x + (cellSize-1) / 2, y + (cellSize-1) / 2, (cellSize-1) / 2.5, 0, Math.PI * 2); ctx.fill();
            } else { ctx.fillRect(x, y, cellSize-1, cellSize-1); }
          }
        }
      }
    };

    const drawWhite = () => {
      ctx.fillStyle = "white"; ctx.font = "bold 200px 'Cascadia Mono', monospace"; ctx.fillText("CERTIFICATE", 330, 800);
      ctx.font = "200 100px 'Cascadia Code', monospace"; ctx.fillText("OF CONTRIBUTION", 550, 900);
      ctx.fillText("PRESENTED TO", 640, 1400); ctx.font = "200 70px Corbel";
      const displayName = certUser.real_name ? capitalizeRegex(certUser.real_name) : (certUser.user || "UNKNOWN");
      const certText = `Recognizing valuable contributions that advanced the OWASP open source security mission, this certificate is awarded to ${displayName} for exceptional dedication to cybersecurity. Through innovative research, OWASP project participation, and knowledge sharing on vulnerabilities and secure coding, they have strengthened global defenses against cyber threats, exemplifying integrity and collaboration.`;
      drawJustifiedText(ctx, certText, 190, 1800, 2000, 90);
    };

    const drawGradientContent = () => {
      const g = getGradient();
      ctx.fillStyle = g; ctx.lineWidth = 4; ctx.strokeStyle = g;
      ctx.beginPath(); ctx.roundRect(460, 1000, 1070, 120, [100]); ctx.stroke();
      ctx.globalAlpha = 0.1; ctx.fill(); ctx.globalAlpha = 1; ctx.font = "70px Ebrima";
      
      let certYear = new Date().getFullYear();
      if (certUser.stats?.first_commit_date) certYear = certUser.stats.first_commit_date.split('-')[0];
      else if (certUser.first_commit) certYear = certUser.first_commit;

      const certIdText = `CRT-OWASP-${certUser.id || "000"} : ${certYear}`;
      ctx.fillText(certIdText, 460 + (1070 - ctx.measureText(certIdText).width) / 2, 1085);
      ctx.fillText("// VERIFIED CONTRIBUTOR  // VERIFIED CONTRIBUTOR", 190, 1250);
      
      if (images.current.logo.complete) ctx.drawImage(images.current.logo, 330, 415, 483, 145);
      ctx.globalAlpha = 0.3;
      if (images.current.pattern.complete && images.current.pattern.naturalWidth !== 0) ctx.drawImage(images.current.pattern, 0, 0, 2480, 3508);
      ctx.globalAlpha = 1; ctx.font = "260px Impact";
      const displayName = certUser.real_name ? capitalizeRegex(certUser.real_name) : (certUser.user || "UNKNOWN");
      ctx.fillText(displayName, 190, 1680); ctx.font = "italic 70px Corbel";
      const projectCount = certUser.stats?.project_count || 1;
      ctx.fillText(`${projectCount} ${projectCount === 1 ? 'Repository' : 'Repositories'}`, 190, 2450);
      if (images.current.sign.complete) ctx.drawImage(images.current.sign, 300, 2460, 440, 290);

      ctx.font = "Bold 90px Ebrima"; ctx.fillText("Meysam Bal-afkan", 190, 2850); ctx.fillText("Fatemeh Zahedi", 1510, 2850);
      ctx.font = "50px Corbel"; ctx.fillText("OWASP-CRT Project Leader", 190, 2930); ctx.fillText("OWASP-CRT Project Co-Leader", 1510, 2930);

      ctx.fillStyle = g; ctx.globalCompositeOperation = "source-atop";
      ctx.fillRect(0, 0, 2480, 3508); ctx.globalCompositeOperation = "source-over";
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      generateQRCodeAdvanced(); drawGradientContent(); drawWhite();
      t += 0.02; animationFrameId = requestAnimationFrame(loop);
    };

    if (images.current.logo.complete) loop(); else images.current.logo.onload = () => loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [certUser]);


  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {error && <div style={{ position: 'absolute', top: '20px', left: '20px', color: '#ff2a5f', zIndex: 10 }}>{error}</div>}
      
      <div 
        className="tutorial-tooltip top-arrow" 
        style={{ 
          position: 'absolute',
          top: '20px',   
          left: '30px', 
          opacity: showHint ? 1 : 0, 
          visibility: showHint ? 'visible' : 'hidden',
          zIndex: 100,
          transition: 'all 0.5s ease',
          pointerEvents: 'none'
        }}
      >
        <div className="tooltip-title" style={{ color: '#4a7bfe' }}>
          {isMaximized ? "HINT: MINIMIZE" : "HINT: MAXIMIZE"}
        </div>
        <div className="tooltip-text">
          {isMaximized 
            ? "Click the GREEN button to minimize this window." 
            : "Click the GREEN button to maximize this window."}
        </div>
      </div>

      <div className="cert-scroll-area">
        <canvas ref={canvasRef} id="cert-canvas" width="2480" height="3508" />
      </div>
    </div>
  );
};

export default CertificateViewer;

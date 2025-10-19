import React, { useState } from 'react';
import './BashSummary.css';

const BashSummary = ({ summary }) => {
  const [copied, setCopied] = useState(false);
  if (!summary) return null;

  const renderLine = (line, index) => {
    if (line.startsWith('### ')) {
      return (
        <h3 key={index} className="bash-h3">
          <span className="bash-prompt-green">$</span> {line.substring(4)}
        </h3>
      );
    }
    if (line.startsWith('#### ')) {
      return (
        <h4 key={index} className="bash-h4">
          <span className="bash-prompt-yellow">~</span> {line.substring(5)}
        </h4>
      );
    }
    if (line.trim() === '') {
      return <div key={index} className="bash-line">&nbsp;</div>;
    }
    return (
      <p key={index} className="bash-line">
        {line}
      </p>
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="summary-result-bash">
      <div className="bash-header">
        <div className="bash-buttons">
          <div className="bash-button red"></div>
          <div className="bash-button yellow"></div>
          <div className="bash-button green"></div>
        </div>
        <span className="bash-title">summary-output.txt</span>
        <button className="bash-copy-btn" onClick={handleCopy}>
          {copied ? '✔ Copied' : '📋 Copy'}
        </button>
      </div>

      <div className="bash-body">
        {summary.split('\n').map(renderLine)}
      </div>
    </div>
  );
};

export default BashSummary;

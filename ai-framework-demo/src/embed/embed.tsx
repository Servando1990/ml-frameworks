import React from 'react';
import ReactDOM from 'react-dom';
import AIPrioritizationFramework from '@/components/AIPrioritizationFramework';
import './styles/embed.css';

declare global {
  interface Window {
    initPrioritizationFramework: (elementId: string) => void;
  }
}

window.initPrioritizationFramework = (elementId: string) => {
  const container = document.getElementById(elementId);
  if (container) {
    ReactDOM.render(
      <div className="ai-framework-container">
        <AIPrioritizationFramework />
      </div>, 
      container
    );
  }
}; 
import React from 'react';
import { createRoot } from 'react-dom/client';    
import { AIPrioritizationFramework } from '../../components/AIPrioritizationFramework';
import './styles/embed.css';

declare global {
  interface Window {
    initPrioritizationFramework: (elementId: string) => void;
  }
}

window.initPrioritizationFramework = (elementId: string): void => {
  const container = document.getElementById(elementId);
  if (container) {
    const root = createRoot(container);
    root.render(
      <div className="ai-framework-container">
        <AIPrioritizationFramework />
      </div>
    );
  }
}; 
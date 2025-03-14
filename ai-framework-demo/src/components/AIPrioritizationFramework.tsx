'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ReferenceArea } from 'recharts';
import { UseCaseForm } from './UseCaseForm';

// Extend Window interface to include Cal property
declare global {
  interface Window {
    Cal?: any;
  }
}

// Dynamically import the chart component with SSR disabled
const QuadrantChart = dynamic(
  () => import('./QuadrantChart'),
  { ssr: false }
);

// Add TypeScript interfaces
interface UseCase {
  id: number;
  name: string;
  description: string;
  impact: number;
  effort: number;
  implementationType?: string;
  answers?: Record<string, string>;
}

interface UseCaseProps {
  useCase: UseCase;
  onDelete: (id: number) => void;
  onEdit: (useCase: UseCase) => void;
}

interface UseCaseScoresProps {
  useCases: UseCase[];
}

const UseCase = ({ useCase, onDelete, onEdit }: UseCaseProps) => (
  <li className="p-4 border border-black/20 dark:border-white/20 rounded-lg">
    <div className="flex justify-between items-start gap-4">
      <div>
        <h3 className="font-medium mb-2">{useCase.name}</h3>
        <p className="text-sm text-black/60 dark:text-white/60">{useCase.description}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onEdit(useCase)} className="text-sm p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,76.68652,179.31348,32a16.02162,16.02162,0,0,0-22.62695,0L72.00244,116.68359,50.34277,181.31934a8.00039,8.00039,0,0,0,10.34082,10.33789L125.31641,168l84.68457-84.68652A16.01869,16.01869,0,0,0,224,76.68652Z"></path>
          </svg>
        </button>
        <button onClick={() => onDelete(useCase.id)} className="text-sm p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M216,48H176V40a24.02718,24.02718,0,0,0-24-24H104A24.02718,24.02718,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16.01833,16.01833,0,0,0,16,16H192a16.01833,16.01833,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8.00917,8.00917,0,0,1,8-8h48a8.00917,8.00917,0,0,1,8,8v8H96Z"></path>
          </svg>
        </button>
      </div>
    </div>
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">Impact</span>
        <span className="text-sm">{useCase.impact}/10</span>
      </div>
      <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full">
        <div 
          className="h-full bg-black/20 dark:bg-white/20 rounded-full" 
          style={{ width: `${(useCase.impact / 10) * 100}%` }}
        />
      </div>
    </div>
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm">Effort</span>
        <span className="text-sm">{useCase.effort}/10</span>
      </div>
      <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full">
        <div 
          className="h-full bg-black/20 dark:bg-white/20 rounded-full" 
          style={{ width: `${(useCase.effort / 10) * 100}%` }}
        />
      </div>
    </div>
    {useCase.implementationType && (
      <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10">
        <div className="flex items-center">
          <span className="text-sm font-medium">Implementation: </span>
          <span className="ml-2 text-sm px-2 py-1 bg-black/5 dark:bg-white/10 rounded-md">{useCase.implementationType}</span>
        </div>
      </div>
    )}
  </li>
);

const UseCaseScores = ({ useCases }: UseCaseScoresProps) => {
  const sortedUseCases = [...useCases].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

  return (
    <div className="w-full border-collapse">
      <table className="w-full">
        <thead>
          <tr className="bg-black/5 dark:bg-white/5">
            <th className="text-left p-3">#</th>
            <th className="text-left p-3">Use case</th>
            <th className="text-left p-3">Priority Score</th>
            <th className="text-left p-3">Quadrant</th>
            <th className="text-left p-3">Implementation</th>
          </tr>
        </thead>
        <tbody>
          {sortedUseCases.map((useCase, index) => (
            <tr key={useCase.id} className="border-t border-black/10 dark:border-white/10">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{useCase.name}</td>
              <td className="p-3">{getPriorityScore(useCase).toFixed(1)}</td>
              <td className="p-3">{getQuadrant(useCase.impact, useCase.effort)}</td>
              <td className="p-3">{useCase.implementationType || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function AIPrioritizationFramework() {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [showExamples, setShowExamples] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUseCase, setEditingUseCase] = useState<UseCase | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Load Cal.com script and initialize calendar
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Create the Cal.com script exactly as provided
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
      Cal("init", "30min", {origin:"https://cal.com"});
    `;

    // Add the script to the document
    document.head.appendChild(script);

    // Initialize Cal.com with inline embed after a short delay to ensure script is loaded
    const timer = setTimeout(() => {
      if (window.Cal && window.Cal.ns && window.Cal.ns["30min"]) {
        window.Cal.ns["30min"]("inline", {
          elementOrSelector: "#my-cal-inline",
          calLink: "servando-torres-garcia-qco7rh/30min",
          config: { layout: "month_view" }
        });
      } else {
        console.warn("Cal.com not initialized properly");
      }
    }, 1000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      // Remove the script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Clear the calendar container
      if (calendarRef.current) {
        calendarRef.current.innerHTML = '';
      }
    };
  }, []);

  const handleAddUseCase = (useCase: Omit<UseCase, 'id'>) => {
    // Extract implementationType from answers if it exists
    const implementationType = useCase.answers?.implementationType;
    
    const newUseCase = { 
      ...useCase, 
      id: Date.now(),
      implementationType: implementationType || 'Not specified'
    };
    
    // Add the use case to the state
    setUseCases([...useCases, newUseCase]);
    
    // Log the submission to our API
    fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add_use_case',
        useCase: newUseCase,
        timestamp: new Date().toISOString()
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Logging successful:', data);
    })
    .catch(error => {
      console.error('Error logging use case:', error);
    });
    
    setShowForm(false);
  };

  const handleDeleteUseCase = (id: number) => {
    // Find the use case before deleting it
    const useCaseToDelete = useCases.find(useCase => useCase.id === id);
    
    // Remove the use case from the state
    setUseCases(useCases.filter(useCase => useCase.id !== id));
    
    // Log the deletion to our API
    if (useCaseToDelete) {
      fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_use_case',
          useCase: useCaseToDelete,
          timestamp: new Date().toISOString()
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Logging successful:', data);
      })
      .catch(error => {
        console.error('Error logging use case deletion:', error);
      });
    }
  };

  const handleEditUseCase = (updatedUseCase: UseCase) => {
    // Extract implementationType from answers if it exists
    const implementationType = updatedUseCase.answers?.implementationType;
    
    const finalUpdatedUseCase = {
      ...updatedUseCase,
      implementationType: implementationType || updatedUseCase.implementationType || 'Not specified'
    };
    
    // Update the use case in the state
    setUseCases(useCases.map(useCase => 
      useCase.id === finalUpdatedUseCase.id ? finalUpdatedUseCase : useCase
    ));
    
    // Log the edit to our API
    fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'edit_use_case',
        useCase: finalUpdatedUseCase,
        timestamp: new Date().toISOString()
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Logging successful:', data);
    })
    .catch(error => {
      console.error('Error logging use case edit:', error);
    });
    
    setEditingUseCase(null);
    setShowForm(false);
  };

  // Function to start editing a use case
  const startEditingUseCase = (useCase: UseCase) => {
    setEditingUseCase(useCase);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col w-full mb-6">
          <div className="self-start mb-6 pl-6">
            <div>
              <span className="font-serif text-4xl tracking-tight">controlthrive</span>
            </div>
          </div>
          
          <div className="self-center mb-2">
            <h1 className="text-3xl font-bold text-center">AI Prioritization Framework</h1>
            <p className="text-sm text-[#F4F5F8]/60 mt-1 italic text-center">by <a href="https://www.linkedin.com/in/servando-torres-239a26b0/" target="_blank" rel="noopener noreferrer" className="hover:underline">Servando</a></p>
          </div>
        </div>
        
        <div className="h-[400px] border border-[#F4F5F8]/20 rounded-xl overflow-hidden">
          <QuadrantChart useCases={useCases} />
        </div>

        {showForm ? (
          <div className="max-w-2xl mx-auto w-full border border-[#F4F5F8]/20 rounded-lg p-4">
            <UseCaseForm
              onSubmit={(useCase) => {
                if (editingUseCase) {
                  handleEditUseCase({ ...useCase, id: editingUseCase.id });
                } else {
                  handleAddUseCase(useCase);
                }
                setEditingUseCase(null);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingUseCase(null);
              }}
              initialUseCase={editingUseCase as UseCase | null}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mx-auto text-sm flex items-center gap-2 px-4 py-1.5 rounded-2xl border border-[#F4F5F8]/20 hover:bg-[#F4F5F8]/5"
          >
            <span>Add New Use Case</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
            </svg>
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
            <ul className="space-y-4">
              {useCases.map(useCase => (
                <UseCase
                  key={useCase.id}
                  useCase={useCase}
                  onDelete={handleDeleteUseCase}
                  onEdit={startEditingUseCase}
                />
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Use Case Scores</h3>
            <div className="overflow-hidden rounded-lg border border-[#F4F5F8]/20">
              <UseCaseScores useCases={useCases} />
            </div>
          </div>
          
          <div className="border border-[#F4F5F8]/20 rounded-lg p-5 bg-black/5 dark:bg-[#F4F5F8]/5 h-fit">
            <h3 className="text-lg font-semibold mb-3">Calculation Method</h3>
            <div className="text-sm space-y-3">
              <div>
                <p className="font-medium mb-1">Priority Score Formula:</p>
                <p className="font-mono bg-black/10 dark:bg-white/10 p-2 rounded inline-block">
                  (Impact × 0.7) + ((10 - Effort) × 0.3)
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Weighting:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Impact: 70% weight (higher is better)</li>
                  <li>Effort: 30% weight (lower is better, inverted as 10-Effort)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Quadrants:</p>
                <ul className="space-y-1">
                  <li><span className="inline-block w-3 h-3 bg-[#16a34a] mr-2 rounded-full"></span>Quick Wins: High Impact, Low Effort</li>
                  <li><span className="inline-block w-3 h-3 bg-[#2563eb] mr-2 rounded-full"></span>Strategic Ventures: High Impact, High Effort</li>
                  <li><span className="inline-block w-3 h-3 bg-[#ca8a04] mr-2 rounded-full"></span>Foundation Labs: Low Impact, Low Effort</li>
                  <li><span className="inline-block w-3 h-3 bg-[#dc2626] mr-2 rounded-full"></span>Optimization Zone: Low Impact, High Effort</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Need More Assistance?</h3>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Schedule a consultation with our AI experts to discuss your use cases and get personalized recommendations.
          </p>
          
          <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-black/30" style={{ height: "600px" }}>
            <div 
              ref={calendarRef}
              id="my-cal-inline" 
              style={{width: "100%", height: "100%", overflow: "scroll"}}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getQuadrantColor(impact: number, effort: number): string {
  if (impact >= 5 && effort < 5) return "#16a34a"; // green for Quick Wins
  if (impact >= 5 && effort >= 5) return "#2563eb"; // blue for Strategic Ventures
  if (impact < 5 && effort < 5) return "#ca8a04"; // yellow for Foundation Labs
  return "#dc2626"; // red for Optimization Zone
}

function getQuadrant(impact: number, effort: number): string {
  if (impact >= 5 && effort < 5) return "Quick Wins";
  if (impact >= 5 && effort >= 5) return "Strategic Ventures";
  if (impact < 5 && effort < 5) return "Foundation Labs";
  return "Optimization Zone";
}

function getPriorityScore(useCase: UseCase) {
  return (useCase.impact * 0.7) + ((10 - useCase.effort) * 0.3);
} 
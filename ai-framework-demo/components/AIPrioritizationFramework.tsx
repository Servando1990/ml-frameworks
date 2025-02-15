import React, { useState } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ReferenceArea } from 'recharts';
import { UseCaseForm } from './UseCaseForm';
  
// Add TypeScript interfaces
interface UseCase {
  id: number;
  name: string;
  description: string;
  impact: number;
  effort: number;
}

interface UseCaseProps {
  useCase: UseCase;
  onDelete: (id: number) => void;
  onEdit: (useCase: UseCase) => void;
}

const UseCase: React.FC<UseCaseProps> = ({ useCase, onDelete, onEdit }) => (
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
  </li>
);

interface QuadrantChartProps {
  useCases: UseCase[];
}

const QuadrantChart: React.FC<QuadrantChartProps> = ({ useCases }) => {
  const data = useCases.map(useCase => ({
    name: useCase.name,
    impact: useCase.impact,
    effort: useCase.effort,
    quadrant: getQuadrant(useCase.impact, useCase.effort),
    fill: getQuadrantColor(useCase.impact, useCase.effort)
  }));

  return (
    <div className="relative h-[400px]">
      {/* Quadrant Labels with absolute positioning */}
      <div className="absolute inset-0 z-10">
        <div className="w-full h-full flex flex-wrap">
          {/* Top Left - Quick Wins */}
          <div className="w-1/2 h-1/2 flex items-center justify-center">
            <span 
              className="text-[#22c55e] text-xl font-medium"
              style={{ 
                letterSpacing: '0.5px',
                filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))'
              }}
            >
              Quick Wins
            </span>
          </div>
          
          {/* Top Right - Strategic Ventures */}
          <div className="w-1/2 h-1/2 flex items-center justify-center">
            <span 
              className="text-[#3b82f6] text-xl font-medium"
              style={{ 
                letterSpacing: '0.5px',
                filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))'
              }}
            >
              Strategic Ventures
            </span>
          </div>
          
          {/* Bottom Left - Foundation Labs */}
          <div className="w-1/2 h-1/2 flex items-center justify-center">
            <span 
              className="text-[#eab308] text-xl font-medium"
              style={{ 
                letterSpacing: '0.5px',
                filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))'
              }}
            >
              Foundation Labs
            </span>
          </div>
          
          {/* Bottom Right - Optimization Zone */}
          <div className="w-1/2 h-1/2 flex items-center justify-center">
            <span 
              className="text-[#ef4444] text-xl font-medium"
              style={{ 
                letterSpacing: '0.5px',
                filter: 'drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))'
              }}
            >
              Optimization Zone
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
            <defs>
              <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              {/* Quick Wins - Dark Green */}
              <linearGradient id="quickWinsGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1B4D3E" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#1B4D3E" stopOpacity="0.1"/>
              </linearGradient>
              {/* Strategic Ventures - Dark Blue */}
              <linearGradient id="strategicVenturesGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0.1"/>
              </linearGradient>
              {/* Foundation Labs - Dark Yellow/Brown */}
              <linearGradient id="foundationLabsGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4D461B" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#4D461B" stopOpacity="0.1"/>
              </linearGradient>
              {/* Optimization Zone - Dark Red */}
              <linearGradient id="optimizationZoneGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4D1B1B" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="#4D1B1B" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            
            {/* Quick Wins - Top Left Green */}
            <ReferenceArea 
              x1={0} 
              x2={5} 
              y1={5} 
              y2={10} 
              fill="#16a34a" 
              fillOpacity={0.1} 
            />

            {/* Strategic Ventures - Top Right Blue */}
            <ReferenceArea 
              x1={5} 
              x2={10} 
              y1={5} 
              y2={10} 
              fill="#2563eb" 
              fillOpacity={0.1} 
            />

            {/* Foundation Labs - Bottom Left Yellow */}
            <ReferenceArea 
              x1={0} 
              x2={5} 
              y1={0} 
              y2={5} 
              fill="#ca8a04" 
              fillOpacity={0.1} 
            />

            {/* Optimization Zone - Bottom Right Red */}
            <ReferenceArea 
              x1={5} 
              x2={10} 
              y1={0} 
              y2={5} 
              fill="#dc2626" 
              fillOpacity={0.1} 
            />
            
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis 
              type="number" 
              dataKey="effort" 
              name="Feasibility" 
              domain={[0, 10]}
              label={{ value: 'Feasibility', position: 'bottom', offset: 0 }}
              ticks={[0, 2.5, 5, 7.5, 10]}
              stroke="#666"
              strokeOpacity={0.3}
            />
            <YAxis 
              type="number" 
              dataKey="impact" 
              name="Impact" 
              domain={[0, 10]}
              label={{ value: 'Impact', angle: -90, position: 'left', offset: 0 }}
              ticks={[0, 2.5, 5, 7.5, 10]}
              stroke="#666"
              strokeOpacity={0.3}
            />
            
            {/* Quadrant Dividers with reduced opacity */}
            <line x1="150" y1="0" x2="150" y2="300" stroke="#666" strokeDasharray="3 3" strokeOpacity={0.1} />
            <line x1="0" y1="150" x2="300" y2="150" stroke="#666" strokeDasharray="3 3" strokeOpacity={0.1} />
            
            <Tooltip 
              content={({ payload }) => {
                if (!payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-black p-3 border border-black/20 dark:border-white/20 rounded-lg shadow-lg">
                    <p className="font-medium text-base mb-1">{data.name}</p>
                    <p className="text-sm">Impact: {data.impact}</p>
                    <p className="text-sm">Feasibility: {data.effort}</p>
                    <p className="text-sm font-medium mt-1" style={{ color: data.fill }}>{data.quadrant}</p>
                  </div>
                );
              }} 
            />
            <Scatter 
              data={data} 
              shape={(props: any) => (
                <g>
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={8}
                    fill={props.fill}
                    fillOpacity={0.2}
                    filter="url(#glow)"
                  />
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill={props.fill}
                    style={{ cursor: 'pointer' }}
                  />
                </g>
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface UseCaseScoresProps {
  useCases: UseCase[];
}

const UseCaseScores: React.FC<UseCaseScoresProps> = ({ useCases }) => {
  const sortedUseCases = [...useCases].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-black/5 dark:bg-white/5">
          <th className="text-left p-3">#</th>
          <th className="text-left p-3">Use case</th>
          <th className="text-left p-3">Priority Score</th>
          <th className="text-left p-3">Quadrant</th>
        </tr>
      </thead>
      <tbody>
        {sortedUseCases.map((useCase, index) => (
          <tr key={useCase.id} className="border-t border-black/10 dark:border-white/10">
            <td className="p-3">{index + 1}</td>
            <td className="p-3">{useCase.name}</td>
            <td className="p-3">{getPriorityScore(useCase).toFixed(1)}</td>
            <td className="p-3">{getQuadrant(useCase.impact, useCase.effort)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const AIPrioritizationFramework: React.FC = () => {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [showExamples, setShowExamples] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAddUseCase = (useCase: UseCase) => {
    setUseCases([...useCases, { ...useCase, id: Date.now() }]);
  };

  const handleDeleteUseCase = (id: number) => {
    setUseCases(useCases.filter(useCase => useCase.id !== id));
  };

  const handleEditUseCase = (updatedUseCase: UseCase) => {
    setUseCases(useCases.map(useCase => 
      useCase.id === updatedUseCase.id ? updatedUseCase : useCase
    ));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="h-[400px] border border-[#F4F5F8]/20 rounded-xl overflow-hidden">
        <QuadrantChart useCases={useCases} />
      </div>

      {showForm ? (
        <div className="max-w-2xl mx-auto w-full border border-[#F4F5F8]/20 rounded-lg p-4">
          <UseCaseForm
            onSubmit={(useCase) => {
              handleAddUseCase({ ...useCase, id: Date.now() });
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
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
                onEdit={handleEditUseCase}
              />
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Use Case Scores</h3>
          <div className="relative inline-block">
            <button className="flex gap-2 items-center text-sm px-2 py-1 hover:bg-[#F4F5F8]/5 text-[#F4F5F8]/60 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Z"></path>
              </svg>
              How is this calculated?
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-[#F4F5F8]/20">
          <UseCaseScores useCases={useCases} />
        </div>
      </div>
    </div>
  );
};

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

export { AIPrioritizationFramework };
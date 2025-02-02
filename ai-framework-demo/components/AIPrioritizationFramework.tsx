import React, { useState } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
  
const UseCase = ({ useCase, onDelete, onEdit }) => (
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

const QuadrantChart = ({ useCases }) => {
  const data = useCases.map(useCase => ({
    name: useCase.name,
    impact: useCase.impact,
    effort: useCase.effort,
    quadrant: getQuadrant(useCase.impact, useCase.effort)
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          dataKey="effort" 
          name="Effort" 
          domain={[0, 10]}
          label={{ value: 'Effort', position: 'bottom' }} 
        />
        <YAxis 
          type="number" 
          dataKey="impact" 
          name="Impact" 
          domain={[0, 10]}
          label={{ value: 'Impact', angle: -90, position: 'left' }} 
        />
        <Tooltip 
          content={({ payload }) => {
            if (!payload?.length) return null;
            const data = payload[0].payload;
            return (
              <div className="bg-white dark:bg-black p-2 border border-black/20 dark:border-white/20 rounded-lg">
                <p className="font-medium">{data.name}</p>
                <p className="text-sm">Impact: {data.impact}</p>
                <p className="text-sm">Effort: {data.effort}</p>
                <p className="text-sm">Quadrant: {data.quadrant}</p>
              </div>
            );
          }} 
        />
        <Scatter 
          data={data} 
          fill="#000" 
          fillOpacity={0.6}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const UseCaseScores = ({ useCases }) => {
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

const AIPrioritizationFramework = () => {
  const [useCases, setUseCases] = useState([]);
  const [showExamples, setShowExamples] = useState(false);

  const handleAddUseCase = (useCase) => {
    setUseCases([...useCases, { ...useCase, id: Date.now() }]);
  };

  const handleDeleteUseCase = (id) => {
    setUseCases(useCases.filter(useCase => useCase.id !== id));
  };

  const handleEditUseCase = (updatedUseCase) => {
    setUseCases(useCases.map(useCase => 
      useCase.id === updatedUseCase.id ? updatedUseCase : useCase
    ));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Use Cases</h2>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="text-sm flex items-center gap-2 px-4 py-1.5 rounded-2xl border bg-white dark:bg-black hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span>Show examples</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
              <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Z"></path>
            </svg>
          </button>
        </div>
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
        <button
          onClick={() => handleAddUseCase({ 
            name: 'New Use Case',
            description: '',
            impact: 5,
            effort: 5
          })}
          className="mt-4 text-sm flex items-center gap-2 px-4 py-1.5 rounded-2xl border bg-white dark:bg-black hover:bg-black/5 dark:hover:bg-white/5"
        >
          <span>Add New Use Case</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
          </svg>
        </button>
      </div>

      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-semibold mb-4">Impact / Effort Quadrants</h2>
        <div className="h-96 border border-black/20 dark:border-white/20 rounded-xl overflow-hidden">
          <QuadrantChart useCases={useCases} />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Use Case Scores</h3>
            <div className="relative inline-block">
              <button className="flex gap-2 items-center text-sm px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5 text-black/60 dark:text-white/60 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Z"></path>
                </svg>
                How is this calculated?
              </button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-black/20 dark:border-white/20">
            <UseCaseScores useCases={useCases} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getQuadrant(impact, effort) {
  if (impact >= 5 && effort < 5) return "Quick Wins";
  if (impact >= 5 && effort >= 5) return "Strategic Projects";
  if (impact < 5 && effort < 5) return "Fill Ins";
  return "Maybes";
}

function getPriorityScore(useCase) {
  return (useCase.impact * 0.7) + ((10 - useCase.effort) * 0.3);
}

export default AIPrioritizationFramework;
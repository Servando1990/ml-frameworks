'use client';

import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, ReferenceArea } from 'recharts';

interface UseCase {
  id: number;
  name: string;
  description: string;
  impact: number;
  effort: number;
}

interface QuadrantChartProps {
  useCases: UseCase[];
}

const getQuadrantColor = (impact: number, effort: number): string => {
  if (impact >= 5 && effort < 5) return "#4ade80"; // Green for Quick Wins
  if (impact >= 5 && effort >= 5) return "#60a5fa"; // Blue for Strategic Ventures
  if (impact < 5 && effort < 5) return "#facc15"; // Yellow for Foundation Labs
  return "#f87171"; // Red for Optimization Zone
};

const getQuadrantName = (impact: number, effort: number): string => {
  if (impact >= 5 && effort < 5) return "Quick Wins";
  if (impact >= 5 && effort >= 5) return "Strategic Ventures";
  if (impact < 5 && effort < 5) return "Foundation Labs";
  return "Optimization Zone";
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const useCase = payload[0].payload;
    const quadrantName = getQuadrantName(useCase.impact, useCase.effort);
    const color = getQuadrantColor(useCase.impact, useCase.effort);
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2" style={{ borderColor: color }}>
        <p className="font-medium text-base">{useCase.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{useCase.description}</p>
        <div className="mt-3 space-y-1">
          <p className="text-sm font-medium" style={{ color }}>
            {quadrantName}
          </p>
          <p className="text-sm">Impact: {useCase.impact}/10</p>
          <p className="text-sm">Effort: {useCase.effort}/10</p>
        </div>
      </div>
    );
  }
  return null;
};

const QuadrantChart: React.FC<QuadrantChartProps> = ({ useCases }) => {
  const data = useCases.map(useCase => ({
    ...useCase,
    fill: getQuadrantColor(useCase.impact, useCase.effort),
  }));

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 30 }}>
          {/* Quadrant backgrounds */}
          <ReferenceArea 
            x1={0} x2={5} y1={5} y2={10}
            fill="rgba(74, 222, 128, 0.05)"
            label={{ 
              value: "Quick Wins",
              position: "center",
              fill: "rgba(74, 222, 128, 0.6)",
              fontSize: 14,
              fontWeight: "bold"
            }}
          />
          <ReferenceArea 
            x1={5} x2={10} y1={5} y2={10}
            fill="rgba(96, 165, 250, 0.05)"
            label={{ 
              value: "Strategic Ventures",
              position: "center",
              fill: "rgba(96, 165, 250, 0.6)",
              fontSize: 14,
              fontWeight: "bold"
            }}
          />
          <ReferenceArea 
            x1={0} x2={5} y1={0} y2={5}
            fill="rgba(250, 204, 21, 0.05)"
            label={{ 
              value: "Foundation Labs",
              position: "center",
              fill: "rgba(250, 204, 21, 0.6)",
              fontSize: 14,
              fontWeight: "bold"
            }}
          />
          <ReferenceArea 
            x1={5} x2={10} y1={0} y2={5}
            fill="rgba(248, 113, 113, 0.05)"
            label={{ 
              value: "Optimization Zone",
              position: "center",
              fill: "rgba(248, 113, 113, 0.6)",
              fontSize: 14,
              fontWeight: "bold"
            }}
          />

          {/* Grid */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.1)" 
          />

          {/* Axes */}
          <XAxis
            type="number"
            dataKey="effort"
            domain={[0, 10]}
            tickCount={6}
            tick={{ fill: '#FFFFFF', fontSize: 11 }}
            axisLine={{ stroke: '#FFFFFF', strokeWidth: 1.5 }}
            tickLine={{ stroke: '#FFFFFF', strokeWidth: 1.5 }}
            label={{ 
              value: 'Effort', 
              position: 'insideBottom',
              offset: -10,
              fill: '#FFFFFF', 
              fontSize: 13,
              fontWeight: "bold"
            }}
          />
          <YAxis
            type="number"
            dataKey="impact"
            domain={[0, 10]}
            tickCount={6}
            tick={{ fill: '#FFFFFF', fontSize: 11 }}
            axisLine={{ stroke: '#FFFFFF', strokeWidth: 1.5 }}
            tickLine={{ stroke: '#FFFFFF', strokeWidth: 1.5 }}
            label={{ 
              value: 'Impact', 
              angle: -90, 
              position: 'insideLeft',
              offset: -10,
              fill: '#FFFFFF', 
              fontSize: 13,
              fontWeight: "bold"
            }}
          />

          {/* Reference lines */}
          <ReferenceLine 
            x={5} 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth={1}
          />
          <ReferenceLine 
            y={5} 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth={1}
          />

          {/* Data points */}
          <Scatter
            data={data}
            shape={(props: any) => (
              <circle
                cx={props.cx}
                cy={props.cy}
                r={4}
                fill={props.payload.fill}
                fillOpacity={0.8}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
                style={{
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              />
            )}
          />

          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: '3 3' }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuadrantChart;
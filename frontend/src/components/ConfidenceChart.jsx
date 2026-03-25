import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { GENRE_COLORS } from '../utils/genreColors';
import { capitalizeGenre, formatConfidence } from '../utils/formatters';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 font-medium">
        <span style={{ color: GENRE_COLORS[data.genre] || '#333' }}>
          {capitalizeGenre(data.genre)}: {formatConfidence(data.score)}
        </span>
      </div>
    );
  }
  return null;
};

const CustomYAxisTick = ({ x, y, payload, predictedGenre }) => {
  const isPredicted = payload.value === predictedGenre;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill={isPredicted ? "#1e293b" : "#475569"}
        fontWeight={isPredicted ? "bold" : "normal"}
        fontSize={13}
      >
        {isPredicted ? `★ ${capitalizeGenre(payload.value)}` : capitalizeGenre(payload.value)}
      </text>
    </g>
  );
};

export default function ConfidenceChart({ allScores, predictedGenre }) {
  const sortedData = useMemo(() => {
    return [...allScores]
      .sort((a, b) => b.score - a.score)
      .map(item => ({
        ...item,
        displayScore: item.score <= 1 ? item.score * 100 : item.score
      }));
  }, [allScores]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Confidence Scores — All Genres</h3>
      <div className="h-80 w-full text-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{ top: 0, right: 20, left: 30, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              tick={{ fill: '#94a3b8' }} 
              axisLine={{ stroke: '#e2e8f0' }} 
              tickLine={false} 
            />
            <YAxis 
              type="category" 
              dataKey="genre" 
              axisLine={false} 
              tickLine={false}
              tick={<CustomYAxisTick predictedGenre={predictedGenre} />}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} />
            <Bar 
              dataKey="displayScore" 
              radius={[0, 4, 4, 0]}
              animationDuration={1000}
            >
              {sortedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={GENRE_COLORS[entry.genre] || '#94a3b8'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

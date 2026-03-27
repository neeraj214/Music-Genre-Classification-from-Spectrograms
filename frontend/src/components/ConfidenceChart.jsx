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
    const color = GENRE_COLORS[data.genre] || '#94a3b8';
    return (
      <div 
        className="glass-card"
        style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 600 }}
      >
        <span style={{ color }}>
          {capitalizeGenre(data.genre)}: {formatConfidence(data.score)}
        </span>
      </div>
    );
  }
  return null;
};

const CustomYAxisTick = ({ x, y, payload, predictedGenre }) => {
  const isPredicted = payload.value === predictedGenre;
  const color = isPredicted ? GENRE_COLORS[payload.value] || '#0F0E17' : '#6E6D7A';
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill={color}
        fontWeight={isPredicted ? 800 : 500}
        fontSize={13}
        style={{ textTransform: 'capitalize' }}
      >
        {payload.value}
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
    <div className="glass-card" style={{ padding: '28px', width: '100%', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Confidence Scores</h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, padding: '4px 10px', background: 'rgba(108,99,255,0.06)', borderRadius: '12px' }}>
          All 10 genres
        </span>
      </div>
      
      <div style={{ height: '360px', width: '100%', fontSize: '14px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="4 4" 
              horizontal={true} 
              vertical={false} 
              stroke="rgba(108,99,255,0.1)" 
            />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              tick={{ fill: 'var(--text-muted)' }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              type="category" 
              dataKey="genre" 
              axisLine={false} 
              tickLine={false}
              width={80}
              tick={<CustomYAxisTick predictedGenre={predictedGenre} />}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: 'rgba(108,99,255,0.04)' }} 
            />
            <Bar 
              dataKey="displayScore" 
              radius={[0, 6, 6, 0]}
              animationDuration={800}
              isAnimationActive={true}
              animationEasing="ease-out"
            >
              {sortedData.map((entry, index) => {
                const color = GENRE_COLORS[entry.genre] || '#94a3b8';
                const isPredicted = entry.genre === predictedGenre;
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={color}
                    fillOpacity={0.9}
                    stroke={isPredicted ? color : 'none'}
                    strokeWidth={isPredicted ? 2 : 0}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

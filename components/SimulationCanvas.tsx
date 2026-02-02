import React, { useEffect, useState } from 'react';
import { SimulationState } from '../types';
import { Cloud } from './Cloud';
import { Tree } from './Tree';
import { MAX_TREES } from '../constants';

interface SimulationCanvasProps {
  state: SimulationState;
  onObjectClick: (id: string) => void;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ state, onObjectClick }) => {
  const [rainDrops, setRainDrops] = useState<{ x: number; y: number; id: number }[]>([]);

  // Rain animation loop
  useEffect(() => {
    if (!state.isRaining) {
      setRainDrops([]);
      return;
    }

    const interval = setInterval(() => {
      const newDrop = {
        x: Math.random() * 800,
        y: 0,
        id: Date.now() + Math.random(),
      };
      setRainDrops((prev) => [...prev.slice(-50), newDrop]);
    }, 50);

    return () => clearInterval(interval);
  }, [state.isRaining]);

  // Generate tree positions based on count
  const trees = Array.from({ length: state.treeCount }).map((_, i) => ({
    x: 50 + (i * (350 / MAX_TREES)), // Spread across the hill
    y: 280 - (i * 10), // Follow slope
  }));

  // Trash visualization
  const trashItems = Array.from({ length: Math.floor(state.trashAccumulation / 10) }).map((_, i) => ({
    x: 450 + (i * 15) % 200,
    y: 420 + Math.random() * 20,
    rotation: Math.random() * 360,
  }));

  const riverHeight = 450 - (state.waterLevel * 1.5); // Moves up as water level increases
  const groundWaterOpacity = state.groundWaterLevel / 100;

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl border-4 border-slate-800 bg-sky-200">
      <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        
        {/* Sky / Sun */}
        <circle cx="700" cy="80" r="40" fill="#FDB813" className="cursor-pointer hover:scale-110 transition-transform" onClick={() => onObjectClick('rain')} />

        {/* Clouds */}
        <Cloud x={100} y={50} />
        <Cloud x={300} y={80} scale={0.8} />
        {state.isRaining && <Cloud x={500} y={60} scale={1.2} opacity={0.9} />}

        {/* Rain Drops */}
        {state.isRaining && rainDrops.map((drop) => (
          <line
            key={drop.id}
            x1={drop.x}
            y1={drop.y}
            x2={drop.x - 5}
            y2={drop.y + 20}
            stroke="blue"
            strokeWidth="2"
            opacity="0.6"
            className="animate-rain"
          />
        ))}

        {/* Ground Structure (Cross Section) */}
        <g transform="translate(0, 0)">
          {/* Deep Earth */}
          <path d="M0,300 Q400,300 800,450 V600 H0 Z" fill="#3E2723" />
          
          {/* Groundwater Layer (Air Tanah) - Changes color/opacity based on tree absorption */}
          <path 
            d="M0,320 Q400,320 800,470 V550 H0 Z" 
            fill="#2196F3" 
            opacity={groundWaterOpacity * 0.6} // More trees = more water stored here
            className="transition-opacity duration-1000"
            onClick={() => onObjectClick('groundwater')}
          />
          <text x="50" y="500" fill="white" fontSize="14" opacity={groundWaterOpacity > 0.3 ? 0.8 : 0}>Air Tanah</text>

          {/* Top Soil / Grass */}
          <path d="M0,300 Q400,300 800,450 L800,480 Q400,330 0,330 Z" fill="#8D6E63" />
          <path d="M0,300 Q400,300 800,450" fill="none" stroke="#4CAF50" strokeWidth="15" />
        </g>

        {/* House */}
        <g transform="translate(100, 230)" onClick={() => onObjectClick('house')} className="cursor-pointer">
          <path d="M0,0 L60,0 L60,50 L0,50 Z" fill="#FFCCBC" stroke="#5D4037" strokeWidth="2"/>
          <path d="M-10,0 L30,-40 L70,0 Z" fill="#D84315" stroke="#BF360C" strokeWidth="2"/>
          <rect x="20" y="20" width="20" height="30" fill="#8D6E63" />
          <rect x="5" y="10" width="15" height="15" fill="#B3E5FC" stroke="#5D4037" />
        </g>

        {/* Trees */}
        {trees.map((pos, idx) => (
          <Tree key={idx} x={pos.x} y={pos.y} scale={1.2} onClick={() => onObjectClick('tree')} />
        ))}

        {/* River */}
        <path 
          d={`M400,${riverHeight} L800,${riverHeight} L800,600 L400,600 Z`} 
          fill={state.trashAccumulation > 50 ? "#5D4037" : "#29B6F6"} // Dirty or Clean
          opacity="0.8"
          className="transition-all duration-700 ease-in-out"
        />
        
        {/* River Label or Trash Click Area */}
        <rect x="500" y="500" width="200" height="50" fill="transparent" onClick={() => onObjectClick('trash')} cursor="pointer"/>

        {/* Floating Trash */}
        {trashItems.map((item, idx) => (
          <g key={idx} transform={`translate(${item.x}, ${riverHeight + 20}) rotate(${item.rotation})`}>
            <rect width="15" height="10" fill="gray" stroke="black" />
            <path d="M0,0 L15,10" stroke="black" />
          </g>
        ))}

        {/* Flood Overlay */}
        {state.isFlooded && (
          <rect x="0" y="0" width="800" height="600" fill="#29B6F6" opacity="0.4" className="animate-pulse" />
        )}
        
        {state.isFlooded && (
           <text x="400" y="300" textAnchor="middle" fontSize="60" fontWeight="bold" fill="#B71C1C" stroke="white" strokeWidth="2">
             BANJIR!
           </text>
        )}

      </svg>

      {/* Internal CSS for rain animation */}
      <style>{`
        .animate-rain {
          animation: fall 0.5s linear infinite;
        }
        @keyframes fall {
          from { transform: translateY(0); }
          to { transform: translateY(600px); }
        }
      `}</style>
    </div>
  );
};

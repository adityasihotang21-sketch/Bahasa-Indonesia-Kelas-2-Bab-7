import React from 'react';

interface TreeProps {
  x: number;
  y: number;
  scale?: number;
  onClick?: () => void;
}

export const Tree: React.FC<TreeProps> = ({ x, y, scale = 1, onClick }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} onClick={onClick} className="cursor-pointer hover:opacity-90 transition-opacity">
    {/* Roots - representing water absorption */}
    <path
      d="M0,0 Q-10,20 -5,40 M0,0 Q10,20 5,40 M0,0 L0,30"
      stroke="#5D4037"
      strokeWidth="3"
      fill="none"
      opacity="0.6"
    />
    
    {/* Trunk */}
    <rect x="-4" y="-40" width="8" height="40" fill="#795548" />
    
    {/* Leaves */}
    <circle cx="0" cy="-50" r="20" fill="#4CAF50" />
    <circle cx="-15" cy="-40" r="15" fill="#388E3C" />
    <circle cx="15" cy="-40" r="15" fill="#43A047" />
    <circle cx="0" cy="-65" r="18" fill="#2E7D32" />
  </g>
);

import React from 'react';

interface CloudProps {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}

export const Cloud: React.FC<CloudProps> = ({ x, y, scale = 1, opacity = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
    <path
      d="M25,60 
         a20,20 0 0,1 0,-40 
         a30,30 0 0,1 50,0 
         a20,20 0 0,1 0,40 
         z"
      fill="white"
      stroke="#e2e8f0"
      strokeWidth="2"
    />
  </g>
);

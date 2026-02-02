import React, { useState, useEffect, useCallback } from 'react';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlPanel } from './components/ControlPanel';
import { VocabularyCard } from './components/VocabularyCard';
import { SimulationState, TrashHabit } from './types';
import { VOCABULARY_DB } from './constants';
import { Info } from 'lucide-react';

const INITIAL_STATE: SimulationState = {
  treeCount: 2,
  trashHabit: 'bin',
  isRaining: false,
  waterLevel: 20, // Initial river level
  groundWaterLevel: 20, // Initial groundwater
  trashAccumulation: 0,
  isFlooded: false,
};

function App() {
  const [state, setState] = useState<SimulationState>(INITIAL_STATE);
  const [activeVocab, setActiveVocab] = useState<string | null>(null);

  // Simulation Loop
  useEffect(() => {
    // Basic recovery when sunny
    if (!state.isRaining) {
      setState(prev => {
        let { waterLevel, trashAccumulation, isFlooded, trashHabit } = prev;
        
        // Water naturally recedes when sunny
        waterLevel = Math.max(20, waterLevel - 1);
        isFlooded = waterLevel >= 90;

        // Trash cleanup logic
        if (trashHabit === 'bin') {
           trashAccumulation = Math.max(0, trashAccumulation - 1.5);
        } else {
           // Even if sunny, throwing trash in river accumulates it
           trashAccumulation = Math.min(100, trashAccumulation + 0.5);
        }

        return { ...prev, waterLevel, trashAccumulation, isFlooded };
      });
      return;
    }

    const interval = setInterval(() => {
      setState((prev) => {
        let { waterLevel, groundWaterLevel, trashAccumulation, isFlooded, treeCount, trashHabit } = prev;

        // 1. Trash Logic (Accumulation)
        if (trashHabit === 'river') {
          trashAccumulation = Math.min(100, trashAccumulation + 1);
        } else {
          trashAccumulation = Math.max(0, trashAccumulation - 1); // Cleaning up
        }

        // 2. Water Physics Logic
        
        // A. Water Entering System (Inflow)
        const rainIntensity = 2.0; 
        
        // Tree Effect: Trees absorb water into the ground, reducing surface runoff to river.
        // Each tree reduces the rain entering the river.
        // If Max trees (8), they absorb almost all runoff (1.6 reduction).
        const absorptionPerTree = 0.22;
        const totalAbsorption = treeCount * absorptionPerTree;
        const waterRunoffToRiver = Math.max(0, rainIntensity - totalAbsorption);

        // B. Groundwater Logic (Reward for planting trees)
        // Water absorbed by trees goes into the ground layer
        groundWaterLevel = Math.min(100, groundWaterLevel + (treeCount * 0.8));

        // C. River Drainage (Outflow)
        // Normally, the river drains water out (e.g. 1.0 unit per tick).
        let riverDrainage = 1.0;

        // Trash Effect: Trash clogs the river flow.
        // If trash is high, drainage drops significantly, causing backup.
        if (trashAccumulation > 0) {
          // Blockage factor: 100 trash = 0.9 blockage.
          const blockage = (trashAccumulation / 100) * 0.9;
          riverDrainage = Math.max(0.1, riverDrainage - blockage);
        }

        // D. Calculate Net Water Level Change
        // Change = (Water entering from rain) - (Water flowing out)
        // If Trees are high (Runoff ~0.2) and River Clean (Drainage 1.0) -> Level DROPS/Stays Low (-0.8).
        // If Trees are 0 (Runoff 2.0) and River Clean (Drainage 1.0) -> Level RISES (+1.0).
        // If River Dirty (Drainage 0.1) -> Level RISES FAST regardless of trees, but faster without trees.
        const netChange = waterRunoffToRiver - riverDrainage;
        
        waterLevel = Math.min(100, Math.max(20, waterLevel + netChange));

        // 3. Flood Condition
        isFlooded = waterLevel >= 90;

        return {
          ...prev,
          waterLevel,
          groundWaterLevel,
          trashAccumulation,
          isFlooded,
        };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [state.isRaining, state.trashHabit, state.treeCount]);

  const handleObjectClick = (id: string) => {
    if (VOCABULARY_DB[id]) {
      setActiveVocab(id);
    }
  };

  const resetSimulation = () => {
    setState(INITIAL_STATE);
    setActiveVocab(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center p-4 md:p-8">
      
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 tracking-tight flex items-center gap-2">
            🌱 Lab Lingkungan Sehat
          </h1>
          <p className="text-slate-500 mt-1">
            Belajar Bahasa Indonesia & IPAS Kelas 2 SD
          </p>
        </div>
        <div className="hidden md:block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium border border-yellow-200">
          Topik: Lestarikan Lingkungan
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Visualization (Takes up 2 cols) */}
        <div className="lg:col-span-2 aspect-[4/3] bg-white rounded-2xl shadow-xl p-2 relative">
          <SimulationCanvas state={state} onObjectClick={handleObjectClick} />
          
          {/* Overlay Tip */}
          {!activeVocab && !state.isRaining && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-slate-500 shadow-sm flex items-center gap-1 animate-pulse">
              <Info size={14} />
              Klik benda untuk belajar kata!
            </div>
          )}
          
          <VocabularyCard 
            item={activeVocab ? VOCABULARY_DB[activeVocab] : null} 
            onClose={() => setActiveVocab(null)} 
          />
        </div>

        {/* Right: Controls */}
        <div className="lg:col-span-1">
          <ControlPanel 
            state={state}
            setTreeCount={(n) => setState(prev => ({...prev, treeCount: n}))}
            setTrashHabit={(h) => setState(prev => ({...prev, trashHabit: h}))}
            toggleRain={() => setState(prev => ({...prev, isRaining: !prev.isRaining}))}
            reset={resetSimulation}
          />

          {/* Status Indicators (Simple Logic Feedback) */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg border-2 ${state.groundWaterLevel > 50 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-xs text-slate-500 uppercase font-bold">Cadangan Air Tanah</div>
              <div className="text-lg font-bold text-slate-700">
                {state.groundWaterLevel > 70 ? 'Banyak' : state.groundWaterLevel > 30 ? 'Cukup' : 'Sedikit'}
              </div>
            </div>
            <div className={`p-3 rounded-lg border-2 ${state.isFlooded ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className="text-xs text-slate-500 uppercase font-bold">Status Sungai</div>
              <div className={`text-lg font-bold ${state.isFlooded ? 'text-red-600' : 'text-green-700'}`}>
                {state.isFlooded ? 'BANJIR!' : 'Aman'}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
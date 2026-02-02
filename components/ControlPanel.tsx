import React from 'react';
import { SimulationState, TrashHabit } from '../types';
import { MAX_TREES } from '../constants';
import { TreeDeciduous, Trash2, CloudRain, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  state: SimulationState;
  setTreeCount: (count: number) => void;
  setTrashHabit: (habit: TrashHabit) => void;
  toggleRain: () => void;
  reset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  setTreeCount,
  setTrashHabit,
  toggleRain,
  reset,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-slate-200 flex flex-col gap-6">
      <h2 className="text-xl font-bold text-slate-800 text-center mb-2 font-comic">Panel Kendali</h2>
      
      {/* Tree Control */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-green-700 font-semibold">
          <TreeDeciduous size={24} />
          <label>Jumlah Pohon: {state.treeCount}</label>
        </div>
        <input
          type="range"
          min="0"
          max={MAX_TREES}
          value={state.treeCount}
          onChange={(e) => setTreeCount(Number(e.target.value))}
          className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <p className="text-xs text-slate-500 italic">
          {state.treeCount > 5 
            ? "Banyak pohon menyerap air hujan." 
            : "Kurang pohon membuat air cepat mengalir ke sungai."}
        </p>
      </div>

      {/* Trash Control */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-orange-700 font-semibold">
          <Trash2 size={24} />
          <label>Buang Sampah</label>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTrashHabit('bin')}
            className={`flex-1 py-2 px-1 rounded-lg text-sm font-bold border-2 transition-colors ${
              state.trashHabit === 'bin'
                ? 'bg-green-100 border-green-500 text-green-800'
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
            }`}
          >
            Tempat Sampah
          </button>
          <button
            onClick={() => setTrashHabit('river')}
            className={`flex-1 py-2 px-1 rounded-lg text-sm font-bold border-2 transition-colors ${
              state.trashHabit === 'river'
                ? 'bg-red-100 border-red-500 text-red-800'
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
            }`}
          >
            Di Sungai
          </button>
        </div>
        <p className="text-xs text-slate-500 italic">
          {state.trashHabit === 'river' 
            ? 'Sampah akan menyumbat aliran sungai!' 
            : 'Sungai bersih, aliran lancar.'}
        </p>
      </div>

      {/* Weather Control */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={toggleRain}
          className={`w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md ${
            state.isRaining
              ? 'bg-blue-600 text-white shadow-blue-300 ring-2 ring-blue-300'
              : 'bg-white border-2 border-blue-400 text-blue-600 hover:bg-blue-50'
          }`}
        >
          <CloudRain size={24} />
          {state.isRaining ? 'Hentikan Hujan' : 'Turunkan Hujan'}
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        className="text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 text-sm mt-auto"
      >
        <RotateCcw size={16} />
        Ulangi Simulasi
      </button>
    </div>
  );
};
import React from 'react';
import { VocabularyItem } from '../types';
import { X } from 'lucide-react';

interface VocabularyCardProps {
  item: VocabularyItem | null;
  onClose: () => void;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-md border-4 border-yellow-400 animate-in fade-in zoom-in duration-300 z-50">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
      >
        <X size={24} />
      </button>
      
      <div className="text-center space-y-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          item.type === 'kata-ulang' ? 'bg-purple-100 text-purple-700' :
          item.type === 'konsep' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {item.type === 'kata-ulang' ? 'Kata Ulang' : item.type === 'konsep' ? 'Konsep Alam' : 'Benda'}
        </span>
        
        <h3 className="text-3xl font-extrabold text-slate-800 font-serif">{item.word}</h3>
        
        <p className="text-lg text-slate-600 leading-relaxed">
          {item.description}
        </p>

        <div className="pt-2">
          <p className="text-sm text-slate-400">
            *Klik gambar lain untuk belajar kata baru!*
          </p>
        </div>
      </div>
    </div>
  );
};

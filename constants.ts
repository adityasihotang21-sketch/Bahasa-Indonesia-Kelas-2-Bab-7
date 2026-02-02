import { VocabularyItem } from './types';

export const MAX_TREES = 8;

export const VOCABULARY_DB: Record<string, VocabularyItem> = {
  tree: {
    id: 'tree',
    word: 'Pohon',
    type: 'benda',
    description: 'Tumbuhan berkayu yang akarnya membantu menyimpan air tanah dan mencegah longsor.',
  },
  rain: {
    id: 'rain',
    word: 'Hujan',
    type: 'benda',
    description: 'Air yang turun dari langit. Air hujan akan meresap ke dalam tanah jika banyak pohon.',
  },
  trash: {
    id: 'trash',
    word: 'Sampah-sampah',
    type: 'kata-ulang',
    description: 'Benda yang dibuang karena tidak terpakai lagi. Sampah di sungai menyebabkan banjir.',
  },
  flood: {
    id: 'flood',
    word: 'Banjir',
    type: 'konsep',
    description: 'Peristiwa terbenamnya daratan karena volume air yang meningkat.',
  },
  groundwater: {
    id: 'groundwater',
    word: 'Air Tanah',
    type: 'konsep',
    description: 'Air yang tersimpan di dalam lapisan tanah. Akar pohon membantu menahan air ini.',
  },
  house: {
    id: 'house',
    word: 'Rumah',
    type: 'benda',
    description: 'Tempat tinggal kita. Kita harus menjaga kebersihan lingkungan rumah.',
  },
};

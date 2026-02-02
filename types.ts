export type TrashHabit = 'bin' | 'river';

export interface SimulationState {
  treeCount: number; // 0 to 10
  trashHabit: TrashHabit;
  isRaining: boolean;
  waterLevel: number; // 0 to 100 (percentage of river fullness)
  groundWaterLevel: number; // 0 to 100 (percentage of soil saturation)
  trashAccumulation: number; // 0 to 100 (visual trash in river)
  isFlooded: boolean;
}

export interface VocabularyItem {
  id: string;
  word: string;
  type: 'benda' | 'kata-ulang' | 'konsep';
  description: string;
}

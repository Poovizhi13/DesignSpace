export type FurnitureType = 'bed' | 'chair' | 'table' | 'sofa';

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  position: [number, number, number];
  rotation: number;
  scale: number;
}

export interface RoomBounds {
  width: number;
  length: number;
}

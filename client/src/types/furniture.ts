export type FurnitureType = 'bed' | 'chair' | 'table' | 'sofa' | 'bookshelf' | 'desk' | 'armchair';

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

export interface FurnitureCategory {
  name: string;
  items: {
    type: FurnitureType;
    name: string;
    description?: string;
  }[];
}

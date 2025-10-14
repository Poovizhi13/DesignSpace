import { useState, useCallback } from 'react';
import { FurnitureItem, FurnitureType } from '../types/furniture';

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

export function useRoomDesigner() {
  const [roomDimensions, setRoomDimensions] = useState<RoomDimensions>({
    width: 12,
    length: 14,
    height: 10
  });

  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');

  const addFurniture = useCallback((type: FurnitureType) => {
    const newFurniture: FurnitureItem = {
      id: Date.now().toString(),
      type,
      position: [
        (Math.random() - 0.5) * (roomDimensions.width - 2),
        0,
        (Math.random() - 0.5) * (roomDimensions.length - 2)
      ],
      rotation: 0,
      scale: 1
    };
    
    setFurniture(prev => [...prev, newFurniture]);
  }, [roomDimensions]);

  const deleteFurniture = useCallback((id: string) => {
    setFurniture(prev => prev.filter(item => item.id !== id));
    setSelectedFurniture(prev => prev?.id === id ? null : prev);
  }, []);

  const updateFurniture = useCallback((id: string, updates: Partial<FurnitureItem>) => {
    setFurniture(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setSelectedFurniture(prev => 
      prev?.id === id ? { ...prev, ...updates } : prev
    );
  }, []);

  const selectFurniture = useCallback((furnitureItem: FurnitureItem | null) => {
    setSelectedFurniture(furnitureItem);
  }, []);

  const resetScene = useCallback(() => {
    setFurniture([]);
    setSelectedFurniture(null);
    setRoomDimensions({
      width: 12,
      length: 14,
      height: 10
    });
  }, []);

  return {
    roomDimensions,
    setRoomDimensions,
    furniture,
    selectedFurniture,
    viewMode,
    setViewMode,
    addFurniture,
    deleteFurniture,
    updateFurniture,
    selectFurniture,
    resetScene
  };
}

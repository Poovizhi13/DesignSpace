import { useState, useCallback, useRef, useEffect } from 'react';
import { FurnitureItem, FurnitureType } from '../types/furniture';

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

export interface RoomLayout {
  roomDimensions: RoomDimensions;
  furniture: FurnitureItem[];
  version: string;
}

interface HistoryState {
  furniture: FurnitureItem[];
  roomDimensions: RoomDimensions;
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
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);

  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isUndoRedo = useRef(false);

  useEffect(() => {
    if (!isUndoRedo.current) {
      const newState: HistoryState = {
        furniture: [...furniture],
        roomDimensions: { ...roomDimensions }
      };
      
      setHistory(prev => [...prev.slice(0, historyIndex + 1), newState]);
      setHistoryIndex(prev => prev + 1);
    }
    isUndoRedo.current = false;
  }, [furniture, roomDimensions]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedo.current = true;
      const prevState = history[historyIndex - 1];
      setFurniture(prevState.furniture);
      setRoomDimensions(prevState.roomDimensions);
      setHistoryIndex(prev => prev - 1);
      setSelectedFurniture(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedo.current = true;
      const nextState = history[historyIndex + 1];
      setFurniture(nextState.furniture);
      setRoomDimensions(nextState.roomDimensions);
      setHistoryIndex(prev => prev + 1);
      setSelectedFurniture(null);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

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

  const saveLayout = useCallback(() => {
    const layout: RoomLayout = {
      roomDimensions,
      furniture,
      version: '1.0'
    };
    
    const jsonString = JSON.stringify(layout, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `room-layout-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [roomDimensions, furniture]);

  const loadLayout = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const layout: RoomLayout = JSON.parse(e.target?.result as string);
        
        if (layout.version === '1.0') {
          setRoomDimensions(layout.roomDimensions);
          setFurniture(layout.furniture);
          setSelectedFurniture(null);
        } else {
          console.error('Unsupported layout version');
        }
      } catch (error) {
        console.error('Error loading layout:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    roomDimensions,
    setRoomDimensions,
    furniture,
    selectedFurniture,
    viewMode,
    setViewMode,
    snapToGrid,
    setSnapToGrid,
    addFurniture,
    deleteFurniture,
    updateFurniture,
    selectFurniture,
    resetScene,
    saveLayout,
    loadLayout,
    undo,
    redo,
    canUndo,
    canRedo
  };
}

import { useState, useCallback, useRef, useEffect } from "react";
import { FurnitureItem, FurnitureType } from "../types/furniture";

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

export interface RoomLayout {
  roomDimensions: RoomDimensions;
  furniture: FurnitureItem[];
  version: string;
  floorTexture: string;
  wallColor: string;
}

interface HistoryState {
  furniture: FurnitureItem[];
  roomDimensions: RoomDimensions;
  floorTexture: string;
  wallColor: string;
}

export function useRoomDesigner() {
  // -----------------------------
  // 🏠 Room + Furniture State
  // -----------------------------
  const [roomDimensions, setRoomDimensions] = useState<RoomDimensions>({
    width: 12,
    length: 14,
    height: 10,
  });

  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);

  // 🎨 New: Texture and Color State
  const [floorTexture, setFloorTexture] = useState<string>("/textures/wood_floor.jpg");
  const [wallColor, setWallColor] = useState<string>("#ffffff");

  // -----------------------------
  // ⏳ Undo / Redo State
  // -----------------------------
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isUndoRedo = useRef(false);

  // Initialize first history state
  useEffect(() => {
    if (history.length === 0) {
      const initialState: HistoryState = {
        furniture: [],
        roomDimensions: { ...roomDimensions },
        floorTexture,
        wallColor,
      };
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, []);

  // -----------------------------
  // 🧠 History Tracking (Debounced)
  // -----------------------------
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isUndoRedo.current) {
        const newState: HistoryState = {
          furniture: [...furniture],
          roomDimensions: { ...roomDimensions },
          floorTexture,
          wallColor,
        };
        setHistory((prev) => [...prev.slice(0, historyIndex + 1), newState]);
        setHistoryIndex((prev) => prev + 1);
      }
      isUndoRedo.current = false;
    }, 300);

    return () => clearTimeout(timeout);
  }, [furniture, roomDimensions, floorTexture, wallColor]);

  // -----------------------------
  // ↩️ Undo / Redo
  // -----------------------------
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedo.current = true;
      const prevState = history[historyIndex - 1];
      setFurniture(prevState.furniture);
      setRoomDimensions(prevState.roomDimensions);
      setFloorTexture(prevState.floorTexture);
      setWallColor(prevState.wallColor);
      setHistoryIndex((prev) => prev - 1);
      setSelectedFurniture(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedo.current = true;
      const nextState = history[historyIndex + 1];
      setFurniture(nextState.furniture);
      setRoomDimensions(nextState.roomDimensions);
      setFloorTexture(nextState.floorTexture);
      setWallColor(nextState.wallColor);
      setHistoryIndex((prev) => prev + 1);
      setSelectedFurniture(null);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // -----------------------------
  // 🪑 Furniture Operations
  // -----------------------------
  const addFurniture = useCallback(
    (type: FurnitureType) => {
      const newFurniture: FurnitureItem = {
        id: Date.now().toString(),
        type,
        position: [
          (Math.random() - 0.5) * (roomDimensions.width - 4),
          0,
          (Math.random() - 0.5) * (roomDimensions.length - 4),
        ],
        rotation: 0,
        scale: 1,
      };
      setFurniture((prev) => [...prev, newFurniture]);
    },
    [roomDimensions]
  );

  const deleteFurniture = useCallback((id: string) => {
    setFurniture((prev) => prev.filter((item) => item.id !== id));
    setSelectedFurniture((prev) => (prev?.id === id ? null : prev));
  }, []);

  const updateFurniture = useCallback((id: string, updates: Partial<FurnitureItem>) => {
    setFurniture((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    setSelectedFurniture((prev) => (prev?.id === id ? { ...prev, ...updates } : prev));
  }, []);

  const selectFurniture = useCallback((furnitureItem: FurnitureItem | null) => {
    setSelectedFurniture(furnitureItem);
  }, []);

  // -----------------------------
  // 🔄 Reset + Save + Load
  // -----------------------------
  const resetScene = useCallback(() => {
    const defaultRoom = { width: 12, length: 14, height: 10 };
    const defaultTexture = "/textures/wood_floor.jpg";
    const defaultColor = "#ffffff";

    setFurniture([]);
    setSelectedFurniture(null);
    setRoomDimensions(defaultRoom);
    setFloorTexture(defaultTexture);
    setWallColor(defaultColor);
    setHistory([
      { furniture: [], roomDimensions: defaultRoom, floorTexture: defaultTexture, wallColor: defaultColor },
    ]);
    setHistoryIndex(0);
  }, []);

  const saveLayout = useCallback(() => {
    const layout: RoomLayout = {
      roomDimensions,
      furniture,
      version: "1.1",
      floorTexture,
      wallColor,
    };

    const jsonString = JSON.stringify(layout, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `room-layout-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [roomDimensions, furniture, floorTexture, wallColor]);

  const loadLayout = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const layout: RoomLayout = JSON.parse(e.target?.result as string);
        if (layout.version && layout.version.startsWith("1.")) {
          setRoomDimensions(layout.roomDimensions);
          setFurniture(layout.furniture);
          setFloorTexture(layout.floorTexture || "/textures/wood_floor.jpg");
          setWallColor(layout.wallColor || "#ffffff");
          setSelectedFurniture(null);
        } else {
          alert("Unsupported layout version");
        }
      } catch (error) {
        console.error("Error loading layout:", error);
      }
    };
    reader.readAsText(file);
  }, []);

  // -----------------------------
  // 📦 Return Hook API
  // -----------------------------
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
    canRedo,

    // 🎨 Added states
    floorTexture,
    setFloorTexture,
    wallColor,
    setWallColor,
  };
}

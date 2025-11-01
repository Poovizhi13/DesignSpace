import { Canvas } from "@react-three/fiber";
import { OrbitControls, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import Room from "./Room";
import Furniture from "./Furniture";
import Grid from "./Grid";
import ControlPanel from "./UI/ControlPanel";
import FurniturePanel from "./UI/FurniturePanel";
import Toolbar from "./UI/Toolbar";
import { useRoomDesigner } from "../hooks/useRoomDesigner";
import WebGLFallback from "./WebGLFallback";

export default function RoomDesigner() {
  const {
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
  } = useRoomDesigner();

  const [hasError, setHasError] = useState(false);

  // ✅ Listen for chatbot commands (e.g., "add bed", "add table")
  useEffect(() => {
    const handleAddFromChat = (e: CustomEvent) => {
      const { type } = e.detail;
      console.log("🧠 Chatbot requested furniture:", type);

      // Only add furniture if the type exists in your model list
      addFurniture(type);
    };

    window.addEventListener("add-furniture", handleAddFromChat as EventListener);
    return () => {
      window.removeEventListener("add-furniture", handleAddFromChat as EventListener);
    };
  }, [addFurniture]);

  // Room dimensions
  const roomWidth = roomDimensions.width;
  const roomLength = roomDimensions.length;
  const roomHeight = roomDimensions.height;

  const handleCreated = () => {
    console.log("✅ WebGL context created successfully");
  };

  const handleError = (error: any) => {
    console.error("❌ WebGL context creation error:", error);
    setHasError(true);
  };

  if (hasError) {
    return <WebGLFallback />;
  }

  return (
    <div className="w-full h-full relative">
      {/* Control Panels */}
      <ControlPanel
        roomDimensions={roomDimensions}
        setRoomDimensions={setRoomDimensions}
      />

      <FurniturePanel onAddFurniture={addFurniture} />

      <Toolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetScene={resetScene}
        selectedFurniture={selectedFurniture}
        onDeleteFurniture={deleteFurniture}
        onUpdateFurniture={updateFurniture}
        onSaveLayout={saveLayout}
        onLoadLayout={loadLayout}
        snapToGrid={snapToGrid}
        onSnapToGridChange={setSnapToGrid}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={
          viewMode === "3d"
            ? { position: [roomWidth * 0.8, roomHeight * 0.8, roomLength * 0.8], fov: 60 }
            : { position: [0, roomHeight * 2, 0], fov: 60, up: [0, 0, -1] }
        }
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        className="bg-gray-50"
        onCreated={handleCreated}
        onError={handleError}
        fallback={<WebGLFallback />}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[roomWidth, roomHeight * 2, roomLength]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, roomHeight - 1, 0]} intensity={0.5} />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={viewMode === "3d"}
          target={[0, 0, 0]}
          maxPolarAngle={viewMode === "2d" ? 0 : Math.PI / 2.1}
          minPolarAngle={viewMode === "2d" ? 0 : Math.PI / 6}
        />

        {/* Gizmo Helper (only visible in 3D) */}
        {viewMode === "3d" && (
          <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
            <GizmoViewport axisColors={["red", "green", "blue"]} labelColor="black" />
          </GizmoHelper>
        )}``

        <Suspense fallback={null}>
          {/* Room */}
          <Room width={roomWidth} length={roomLength} height={roomHeight} />

          {/* Grid */}
          <Grid width={roomWidth} length={roomLength} divisions={Math.max(roomWidth, roomLength)} />

          {/* Furniture */}
          {furniture.map((item) => (
            <Furniture
              key={item.id}
              furniture={item}
              isSelected={selectedFurniture?.id === item.id}
              onSelect={selectFurniture}
              onUpdate={updateFurniture}
              roomBounds={{ width: roomWidth, length: roomLength }}
              snapToGrid={snapToGrid}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}

import { useRef, useState, useCallback, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { FurnitureItem, FurnitureType } from "../types/furniture";
import DistanceMeasurements from "./DistanceMeasurements";

interface FurnitureProps {
  furniture: FurnitureItem;
  isSelected: boolean;
  onSelect: (furniture: FurnitureItem | null) => void;
  onUpdate: (id: string, updates: Partial<FurnitureItem>) => void;
  roomBounds: { width: number; length: number };
  snapToGrid?: boolean;
  showMeasurements?: boolean;
}

function FurnitureModel({ type }: { type: FurnitureType }) {
  const modelPath = `/models/${type}.glb`;
  const { scene } = useGLTF(modelPath);
  
  const clonedScene = scene.clone();
  
  clonedScene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return <primitive object={clonedScene} scale={2.5} />;
}

const snapToGridValue = (value: number, gridSize: number = 1) => {
  return Math.round(value / gridSize) * gridSize;
};

export default function Furniture({ 
  furniture, 
  isSelected, 
  onSelect, 
  onUpdate,
  roomBounds,
  snapToGrid = false,
  showMeasurements = true
}: FurnitureProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera, gl } = useThree();

  const bind = useDrag(
    ({ active, movement: [x, y], memo = furniture.position }) => {
      setIsDragging(active);
      
      if (active) {
        const newX = memo[0] + (x / gl.domElement.clientWidth) * 10;
        const newZ = memo[2] + (y / gl.domElement.clientHeight) * 10;
        
        const constrainedX = Math.max(-roomBounds.width / 2 + 0.5, Math.min(roomBounds.width / 2 - 0.5, newX));
        const constrainedZ = Math.max(-roomBounds.length / 2 + 0.5, Math.min(roomBounds.length / 2 - 0.5, newZ));
        
        const finalX = snapToGrid ? snapToGridValue(constrainedX) : constrainedX;
        const finalZ = snapToGrid ? snapToGridValue(constrainedZ) : constrainedZ;
        
        onUpdate(furniture.id, {
          position: [finalX, furniture.position[1], finalZ]
        });
      }
      
      return memo;
    },
    { filterTaps: true }
  );

  const handleClick = useCallback((e: THREE.Event) => {
    e.stopPropagation();
    if (!isDragging) {
      onSelect(isSelected ? null : furniture);
    }
  }, [furniture, isSelected, onSelect, isDragging]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...furniture.position);
      meshRef.current.rotation.y = furniture.rotation;
      meshRef.current.scale.setScalar(furniture.scale);
    }
  });

  return (
    <group
      ref={meshRef}
      onClick={handleClick}
      {...bind()}
    >
      <Suspense fallback={null}>
        <FurnitureModel type={furniture.type} />
      </Suspense>
      
      {isSelected && (
        <>
          <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2, 2.5, 8]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
          </mesh>
          {showMeasurements && <DistanceMeasurements furniture={furniture} roomBounds={roomBounds} />}
        </>
      )}
    </group>
  );
}

useGLTF.preload('/models/bed.glb');
useGLTF.preload('/models/chair.glb');
useGLTF.preload('/models/table.glb');
useGLTF.preload('/models/sofa.glb');
useGLTF.preload('/models/bookshelf.glb');
useGLTF.preload('/models/desk.glb');
useGLTF.preload('/models/armchair.glb');

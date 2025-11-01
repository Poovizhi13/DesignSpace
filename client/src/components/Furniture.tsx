import { useRef, useState, useCallback, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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

const snapToGridValue = (value: number, gridSize: number = 1) =>
  Math.round(value / gridSize) * gridSize;

export default function Furniture({
  furniture,
  isSelected,
  onSelect,
  onUpdate,
  roomBounds,
  snapToGrid = false,
  showMeasurements = true,
}: FurnitureProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera, gl } = useThree();
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const intersectionPoint = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();

  const yOffsetMap: Record<FurnitureType, number> = {
    bed: 0.65,
    chair: 1.35,
    table: 0.84,
    sofa: 0.65,
    bookshelf: 1.2,
    desk: 0.54,
    armchair: 1.2,
  };

  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    onSelect(furniture);
  }, [onSelect, furniture]);

  const handlePointerUp = useCallback((e: any) => {
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handlePointerMove = useCallback(
    (e: any) => {
      if (!isDragging) return;
      e.stopPropagation();

      raycaster.setFromCamera(e.pointer, camera);
      raycaster.ray.intersectPlane(planeRef.current, intersectionPoint);

      if (!intersectionPoint) return;

      let newX = intersectionPoint.x;
      let newZ = intersectionPoint.z;

      // Apply room constraints
      newX = Math.max(-roomBounds.width / 2 + 0.5, Math.min(roomBounds.width / 2 - 0.5, newX));
      newZ = Math.max(-roomBounds.length / 2 + 0.5, Math.min(roomBounds.length / 2 - 0.5, newZ));

      const finalX = snapToGrid ? snapToGridValue(newX) : newX;
      const finalZ = snapToGrid ? snapToGridValue(newZ) : newZ;

      onUpdate(furniture.id, { position: [finalX, furniture.position[1], finalZ] });
    },
    [isDragging, camera, roomBounds, snapToGrid, furniture, onUpdate]
  );

  const handleClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!isDragging) onSelect(isSelected ? null : furniture);
    },
    [furniture, isSelected, onSelect, isDragging]
  );

  useFrame(() => {
    if (meshRef.current) {
      const yOffset = yOffsetMap[furniture.type] || 0.3;
      meshRef.current.position.set(
        furniture.position[0],
        furniture.position[1] + yOffset,
        furniture.position[2]
      );
      meshRef.current.rotation.y = furniture.rotation;
      meshRef.current.scale.setScalar(furniture.scale);
    }
  });

  return (
    <group
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
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

          {showMeasurements && (
            <DistanceMeasurements furniture={furniture} roomBounds={roomBounds} />
          )}
        </>
      )}
    </group>
  );
}

useGLTF.preload("/models/bed.glb");
useGLTF.preload("/models/chair.glb");
useGLTF.preload("/models/table.glb");
useGLTF.preload("/models/sofa.glb");
useGLTF.preload("/models/bookshelf.glb");
useGLTF.preload("/models/desk.glb");
useGLTF.preload("/models/armchair.glb");

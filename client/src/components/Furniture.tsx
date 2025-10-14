import { useRef, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";
import { FurnitureItem, FurnitureType } from "../types/furniture";

interface FurnitureProps {
  furniture: FurnitureItem;
  isSelected: boolean;
  onSelect: (furniture: FurnitureItem | null) => void;
  onUpdate: (id: string, updates: Partial<FurnitureItem>) => void;
  roomBounds: { width: number; length: number };
}

export default function Furniture({ 
  furniture, 
  isSelected, 
  onSelect, 
  onUpdate,
  roomBounds 
}: FurnitureProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera, gl } = useThree();

  // Get furniture geometry based on type
  const getFurnitureGeometry = (type: FurnitureType) => {
    switch (type) {
      case 'bed':
        return (
          <group>
            {/* Mattress */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[2, 0.6, 1.5]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Headboard */}
            <mesh position={[0, 1, -0.6]} castShadow>
              <boxGeometry args={[2.2, 1.4, 0.2]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
          </group>
        );
      case 'chair':
        return (
          <group>
            {/* Seat */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.6, 0.1, 0.6]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 1, -0.25]} castShadow>
              <boxGeometry args={[0.6, 1, 0.1]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Legs */}
            {[[-0.25, 0.25, -0.25], [0.25, 0.25, -0.25], [-0.25, 0.25, 0.25], [0.25, 0.25, 0.25]].map((pos, i) => (
              <mesh key={i} position={pos} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.5]} />
                <meshStandardMaterial color="#654321" />
              </mesh>
            ))}
          </group>
        );
      case 'table':
        return (
          <group>
            {/* Tabletop */}
            <mesh position={[0, 0.75, 0]} castShadow>
              <boxGeometry args={[1.5, 0.1, 1]} />
              <meshStandardMaterial color="#D2691E" />
            </mesh>
            {/* Legs */}
            {[[-0.65, 0.375, -0.4], [0.65, 0.375, -0.4], [-0.65, 0.375, 0.4], [0.65, 0.375, 0.4]].map((pos, i) => (
              <mesh key={i} position={pos} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.75]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
            ))}
          </group>
        );
      case 'sofa':
        return (
          <group>
            {/* Base */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[2.5, 0.8, 1]} />
              <meshStandardMaterial color="#4169E1" />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.9, -0.4]} castShadow>
              <boxGeometry args={[2.5, 1, 0.2]} />
              <meshStandardMaterial color="#4169E1" />
            </mesh>
            {/* Armrests */}
            <mesh position={[-1.15, 0.7, 0]} castShadow>
              <boxGeometry args={[0.2, 1.4, 1]} />
              <meshStandardMaterial color="#4169E1" />
            </mesh>
            <mesh position={[1.15, 0.7, 0]} castShadow>
              <boxGeometry args={[0.2, 1.4, 1]} />
              <meshStandardMaterial color="#4169E1" />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
        );
    }
  };

  // Handle drag interaction
  const bind = useDrag(
    ({ active, movement: [x, y], memo = furniture.position }) => {
      setIsDragging(active);
      
      if (active) {
        // Convert screen movement to world coordinates
        const vector = new THREE.Vector3();
        const newX = memo[0] + (x / gl.domElement.clientWidth) * 10;
        const newZ = memo[2] + (y / gl.domElement.clientHeight) * 10;
        
        // Constrain to room bounds
        const constrainedX = Math.max(-roomBounds.width / 2 + 0.5, Math.min(roomBounds.width / 2 - 0.5, newX));
        const constrainedZ = Math.max(-roomBounds.length / 2 + 0.5, Math.min(roomBounds.length / 2 - 0.5, newZ));
        
        onUpdate(furniture.id, {
          position: [constrainedX, furniture.position[1], constrainedZ]
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
      // Update transform based on furniture properties
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
      {getFurnitureGeometry(furniture.type)}
      
      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2, 2.5, 8]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

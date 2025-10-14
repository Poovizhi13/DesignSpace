import { useRef } from "react";
import { Mesh } from "three";
import * as THREE from "three";

interface RoomProps {
  width: number;
  length: number;
  height: number;
}

export default function Room({ width, length, height }: RoomProps) {
  const floorRef = useRef<Mesh>(null);

  return (
    <group>
      {/* Floor */}
      <mesh 
        ref={floorRef}
        position={[0, -0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.8} />
      </mesh>

      {/* Walls */}
      {/* Back Wall */}
      <mesh position={[0, height / 2, -length / 2]} receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* Front Wall (partial for entrance) */}
      <mesh position={[0, height / 2, length / 2]} receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

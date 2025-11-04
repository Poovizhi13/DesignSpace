import { useRef } from "react";
import { Mesh, RepeatWrapping } from "three";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface RoomProps {
  width: number;
  length: number;
  height: number;
  floorTexture?: string; // URL to texture file (e.g., "/textures/wood_floor.jpg")
  wallColor?: string; // HEX color for walls
}

export default function Room({
  width,
  length,
  height,
  floorTexture = "/textures/wood_floor.jpg",
  wallColor = "#ffffff",
}: RoomProps) {
  const floorRef = useRef<Mesh>(null);

  // Load floor texture
  const texture = useTexture(floorTexture);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(4, 4); // Adjust tile repetition

  return (
    <group>
      {/* 🧱 Floor */}
      <mesh
        ref={floorRef}
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          map={texture}
          toneMapped={true}
        />
      </mesh>

      {/* 🧱 Walls */}
      {/* Back Wall */}
      <mesh position={[0, height / 2, -length / 2]} receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.3} />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.3} />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.3} />
      </mesh>

      {/* Front Wall (semi-transparent for entrance view) */}
      <mesh position={[0, height / 2, length / 2]} receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

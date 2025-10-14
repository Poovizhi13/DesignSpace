import { useMemo } from "react";
import { Html } from "@react-three/drei";
import { FurnitureItem } from "../types/furniture";
import * as THREE from "three";

interface DistanceMeasurementsProps {
  furniture: FurnitureItem;
  roomBounds: { width: number; length: number };
}

export default function DistanceMeasurements({ furniture, roomBounds }: DistanceMeasurementsProps) {
  const distances = useMemo(() => {
    const [x, , z] = furniture.position;
    
    const distanceToLeft = Math.abs(x + roomBounds.width / 2);
    const distanceToRight = Math.abs(roomBounds.width / 2 - x);
    const distanceToBack = Math.abs(z + roomBounds.length / 2);
    const distanceToFront = Math.abs(roomBounds.length / 2 - z);
    
    return {
      left: distanceToLeft.toFixed(1),
      right: distanceToRight.toFixed(1),
      back: distanceToBack.toFixed(1),
      front: distanceToFront.toFixed(1)
    };
  }, [furniture.position, roomBounds]);

  const [x, , z] = furniture.position;

  return (
    <group>
      {/* Left distance */}
      <Html position={[-roomBounds.width / 4 + x / 2, 0.5, z]} center>
        <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-mono whitespace-nowrap">
          {distances.left} ft
        </div>
      </Html>

      {/* Right distance */}
      <Html position={[roomBounds.width / 4 + x / 2, 0.5, z]} center>
        <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-mono whitespace-nowrap">
          {distances.right} ft
        </div>
      </Html>

      {/* Back distance */}
      <Html position={[x, 0.5, -roomBounds.length / 4 + z / 2]} center>
        <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-mono whitespace-nowrap">
          {distances.back} ft
        </div>
      </Html>

      {/* Front distance */}
      <Html position={[x, 0.5, roomBounds.length / 4 + z / 2]} center>
        <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-mono whitespace-nowrap">
          {distances.front} ft
        </div>
      </Html>

      {/* Distance lines */}
      <Line
        points={[
          [-roomBounds.width / 2, 0.01, z],
          [x, 0.01, z]
        ]}
        color="#00ff00"
      />
      <Line
        points={[
          [x, 0.01, z],
          [roomBounds.width / 2, 0.01, z]
        ]}
        color="#00ff00"
      />
      <Line
        points={[
          [x, 0.01, -roomBounds.length / 2],
          [x, 0.01, z]
        ]}
        color="#00ff00"
      />
      <Line
        points={[
          [x, 0.01, z],
          [x, 0.01, roomBounds.length / 2]
        ]}
        color="#00ff00"
      />
    </group>
  );
}

function Line({ points, color }: { points: [number, number, number][]; color: string }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(
      points.map(p => new THREE.Vector3(...p))
    );
    return geo;
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} linewidth={2} transparent opacity={0.6} />
    </line>
  );
}

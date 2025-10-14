import * as THREE from "three";
import { useMemo } from "react";

interface GridProps {
  width: number;
  length: number;
  divisions: number;
}

export default function Grid({ width, length, divisions }: GridProps) {
  const gridLines = useMemo(() => {
    const points: THREE.Vector3[] = [];
    
    // Horizontal lines
    for (let i = 0; i <= divisions; i++) {
      const z = (i / divisions) * length - length / 2;
      points.push(new THREE.Vector3(-width / 2, 0.001, z));
      points.push(new THREE.Vector3(width / 2, 0.001, z));
    }
    
    // Vertical lines
    for (let i = 0; i <= divisions; i++) {
      const x = (i / divisions) * width - width / 2;
      points.push(new THREE.Vector3(x, 0.001, -length / 2));
      points.push(new THREE.Vector3(x, 0.001, length / 2));
    }
    
    return points;
  }, [width, length, divisions]);

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(gridLines);
    return geometry;
  }, [gridLines]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#cccccc" transparent opacity={0.3} />
    </line>
  );
}

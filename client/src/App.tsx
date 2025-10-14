import { Suspense, useEffect, useState } from "react";
import "@fontsource/inter";
import RoomDesigner from "./components/RoomDesigner";
import WebGLFallback from "./components/WebGLFallback";

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

function App() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  if (webglSupported === null) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100">
        <div className="text-lg font-medium">Checking WebGL support...</div>
      </div>
    );
  }

  if (!webglSupported) {
    return <WebGLFallback />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Suspense fallback={
        <div className="flex items-center justify-center w-full h-full bg-gray-100">
          <div className="text-lg font-medium">Loading 3D Room Designer...</div>
        </div>
      }>
        <RoomDesigner />
      </Suspense>
    </div>
  );
}

export default App;

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import Scene3D from './components/Scene3D';

function App() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Canvas shadows gl={{ antialias: true, toneMapping: 3 }}>
        <PerspectiveCamera makeDefault position={[0, 4, 16]} fov={50} />
        <Suspense fallback={null}>
          <Scene3D />
          <EffectComposer>
            <Bloom intensity={0.5} luminanceThreshold={0.6} luminanceSmoothing={0.4} mipmapBlur />
            <Vignette eskil={false} offset={0.25} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;

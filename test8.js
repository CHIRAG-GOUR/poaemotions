const fs = require('fs');

const petContent = \
import { useEffect, useRef, useState, useMemo } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Camera, Loader2, Sparkles } from 'lucide-react';

// The 3D Blob Component
function PetBlob({ expression }: { expression: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  // Map emotions to blob states
  const config = useMemo(() => {
    switch(expression) {
      case 'happy': return { color: '#fbbf24', distort: 0.6, speed: 4, scale: 1.2 };
      case 'sad': return { color: '#60a5fa', distort: 0.2, speed: 0.5, scale: 0.9 };
      case 'angry': return { color: '#ef4444', distort: 0.8, speed: 8, scale: 1.1 };
      case 'surprised': return { color: '#a855f7', distort: 0.3, speed: 2, scale: 1.5 };
      case 'fearful': return { color: '#94a3b8', distort: 0.9, speed: 6, scale: 0.8 };
      default: return { color: '#3b82f6', distort: 0.4, speed: 2, scale: 1 };
    }
  }, [expression]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smoothly interpolate scale
    meshRef.current.scale.lerp(new THREE.Vector3(config.scale, config.scale, config.scale), 0.1);
    
    // Auto-rotate
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <MeshDistortMaterial
        ref={materialRef}
        color={config.color}
        envMapIntensity={0.8}
        clearcoat={0.8}
        clearcoatRoughness={0}
        metalness={0.1}
        roughness={0.2}
        distort={config.distort}
        speed={config.speed}
      />
      
      {/* Cartoon Eyes based on expression! */}
      {(expression === 'surprised' || expression === 'happy') && (
        <group position={[0, 0, 1.1]}>
           <mesh position={[-0.3, 0.2, 0]}>
             <sphereGeometry args={[0.2, 32, 32]} />
             <meshStandardMaterial color="white" />
             <mesh position={[0, 0, 0.18]}>
               <sphereGeometry args={[0.08, 16, 16]} />
               <meshStandardMaterial color="black" />
             </mesh>
           </mesh>
           <mesh position={[0.3, 0.2, 0]}>
             <sphereGeometry args={[0.2, 32, 32]} />
             <meshStandardMaterial color="white" />
             <mesh position={[0, 0, 0.18]}>
               <sphereGeometry args={[0.08, 16, 16]} />
               <meshStandardMaterial color="black" />
             </mesh>
           </mesh>
        </group>
      )}
    </Sphere>
  );
}

export default function EmotionPet() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');

  // Load Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        setIsModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models", err);
      }
    };
    loadModels();
  }, []);

  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsCameraActive(false);
      setCurrentEmotion('neutral');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        setIsCameraActive(true);
        intervalRef.current = setInterval(detectFace, 300);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const detectFace = async () => {
    if (!videoRef.current || videoRef.current.paused || !isModelsLoaded) return;

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const expressions = detections.expressions as unknown as Record<string, number>;
        const maxEmotion = Object.keys(expressions).reduce((a, b) => 
            expressions[a] > expressions[b] ? a : b
        );
        if (maxEmotion && expressions[maxEmotion] > 0.4) {
            setCurrentEmotion(maxEmotion);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="w-full bg-blue-50/80 backdrop-blur-md rounded-[2.5rem] p-8 border-4 border-white shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-blue-900 font-comic flex items-center justify-center gap-3">
          <Sparkles className="text-yellow-400" size={32} /> Your 3D Emotion Pet
        </h2>
        <p className="text-xl text-blue-700 font-medium mt-2">Make a face into the camera, and watch your pet react in real-time!</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        
        {/* Camera Feed */}
        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
           <div className="w-full aspect-[4/3] bg-gray-900 rounded-3xl border-8 border-blue-200 shadow-inner overflow-hidden relative flex items-center justify-center">
             {!isCameraActive && <Camera size={48} className="text-gray-600 opacity-50" />}
             <video 
               ref={videoRef}
               autoPlay 
               muted 
               playsInline 
               className={\w-full h-full object-cover \\}
               style={{ transform: 'scaleX(-1)' }}
             />
             {!isModelsLoaded && <div className="absolute inset-0 bg-white/50 backdrop-blur flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>}
           </div>
           
           <button 
             onClick={toggleCamera} 
             disabled={!isModelsLoaded}
             className={\px-8 py-3 rounded-full font-bold text-lg transition-all \\}
           >
              {isCameraActive ? 'Turn Off Camera' : 'Wake Up Pet'}
           </button>
           
           {isCameraActive && (
              <div className="bg-white px-6 py-2 rounded-full font-black text-blue-800 shadow-sm uppercase tracking-widest border-2 border-blue-100">
                DETECTING: {currentEmotion}
              </div>
           )}
        </div>

        {/* 3D Pet Canvas */}
        <div className="w-full md:w-2/3 aspect-square max-w-[500px] h-[500px] bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 rounded-full border-8 border-white shadow-2xl relative overflow-hidden">
           <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
             <PetBlob expression={currentEmotion} />
           </Canvas>
        </div>

      </div>
    </div>
  );
}
\;

fs.writeFileSync('E:/1. Skillizee/POA Emotions/src/components/EmotionPet.tsx', petContent);

/// <reference types="@react-three/fiber" />
import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, Loader2 } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

const EMOTIONS_CONFIG: Record<string, { color: string, distort: number, speed: number, scale: [number, number, number], eyeScale: number }> = {
  happy: { color: '#fbbf24', distort: 0.4, speed: 4, scale: [1.2, 1.2, 1.2], eyeScale: 1 },
  sad: { color: '#60a5fa', distort: 0.2, speed: 1, scale: [1.5, 0.8, 1], eyeScale: 0.8 },
  angry: { color: '#ef4444', distort: 0.8, speed: 8, scale: [1.3, 1.3, 1.3], eyeScale: 1.2 },
  surprised: { color: '#c084fc', distort: 0.3, speed: 2, scale: [0.9, 1.5, 0.9], eyeScale: 1.6 },
  fearful: { color: '#34d399', distort: 0.6, speed: 10, scale: [0.8, 0.8, 0.8], eyeScale: 1.5 },
  disgusted: { color: '#a3e635', distort: 0.5, speed: 3, scale: [1.1, 0.9, 1.1], eyeScale: 0.9 },
  neutral: { color: '#9ca3af', distort: 0.3, speed: 2, scale: [1, 1, 1], eyeScale: 1 }
};

function PetMesh({ emotion }: { emotion: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);
  
  const targetConfig = EMOTIONS_CONFIG[emotion] || EMOTIONS_CONFIG.neutral;
  const targetColor = new THREE.Color(targetConfig.color);

  useFrame(() => {
    if (groupRef.current) {
        groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetConfig.scale[0], 0.05);
        groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetConfig.scale[1], 0.05);
        groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetConfig.scale[2], 0.05);
    }
    if (materialRef.current) {
        materialRef.current.color.lerp(targetColor, 0.05);
        materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetConfig.distort * 0.5, 0.05);
        materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetConfig.speed, 0.05);
    }
  });

  return (
    <Float floatIntensity={2} speed={targetConfig.speed}>
        <group ref={groupRef}>
            {/* Main Body */}
            <Sphere args={[1.5, 64, 64]}>
              <MeshDistortMaterial ref={materialRef} roughness={0.3} metalness={0.1} clearcoat={0.3} />
            </Sphere>
            
            {/* Face Group - Pushed out on Z to avoid being swallowed by the distorting body */}
            <group position={[0, 0, 1.7]}>
                {/* Left Eye */}
                <group position={[-0.6, 0.3, 0]}>
                    <Sphere args={[0.18, 32, 32]} scale={[1, targetConfig.eyeScale, 0.5]}>
                        <meshStandardMaterial color="#111" roughness={0.4} />
                    </Sphere>
                    {/* Eye highlight */}
                    <Sphere position={[-0.05, 0.08 * targetConfig.eyeScale, 0.1]} args={[0.06, 16, 16]}>
                        <meshBasicMaterial color="#fff" />
                    </Sphere>
                </group>
                
                {/* Right Eye */}
                <group position={[0.6, 0.3, 0]}>
                    <Sphere args={[0.18, 32, 32]} scale={[1, targetConfig.eyeScale, 0.5]}>
                        <meshStandardMaterial color="#111" roughness={0.4} />
                    </Sphere>
                    {/* Eye highlight */}
                    <Sphere position={[-0.05, 0.08 * targetConfig.eyeScale, 0.1]} args={[0.06, 16, 16]}>
                        <meshBasicMaterial color="#fff" />
                    </Sphere>
                </group>

                {/* Dynamic Mouth */}
                <group position={[0, -0.3, 0]}>
                   {emotion === 'happy' && (
                     <mesh rotation={[0, 0, Math.PI]}>
                       <torusGeometry args={[0.25, 0.08, 16, 32, Math.PI]} />
                       <meshStandardMaterial color="#111" roughness={0.4} />
                     </mesh>
                   )}
                   {emotion === 'sad' && (
                     <mesh position={[0, -0.1, 0]}>
                       <torusGeometry args={[0.25, 0.08, 16, 32, Math.PI]} />
                       <meshStandardMaterial color="#111" roughness={0.4} />
                     </mesh>
                   )}
                   {(emotion === 'surprised' || emotion === 'fearful') && (
                     <Sphere args={[0.18, 32, 32]} scale={[1, 1.5, 0.5]}>
                        <meshStandardMaterial color="#111" roughness={0.4} />
                     </Sphere>
                   )}
                   {emotion === 'angry' && (
                     <Sphere args={[0.25, 32, 32]} scale={[1.2, 0.3, 0.5]}>
                        <meshStandardMaterial color="#111" roughness={0.4} />
                     </Sphere>
                   )}
                   {(emotion === 'neutral' || emotion === 'disgusted') && (
                     <Sphere args={[0.25, 16, 16]} scale={[1, 0.15, 0.5]}>
                       <meshStandardMaterial color="#111" roughness={0.4} />
                     </Sphere>
                   )}
                </group>
            </group>
        </group>
    </Float>
  );
}

export default function EmotionPet() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [detectedEmotion, setDetectedEmotion] = useState<string>('neutral');

  useEffect(() => {
    let isMounted = true;
    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        if (isMounted) setIsModelsLoaded(true);
      } catch (e: any) {
        if (isMounted) setErrorMsg(`Models load error: ${e.message}`);
      }
    };
    loadModels();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => setIsCameraActive(true))
              .catch(e => console.error(e));
          }
        };
      }
      streamRef.current = stream;
    } catch (err: any) {
      setErrorMsg(err.name === 'NotAllowedError' ? 'Camera access was denied.' : err.message);
    }
  };

  useEffect(() => {
    if (isCameraActive && isModelsLoaded) {
      intervalRef.current = setInterval(async () => {
        if (videoRef.current && !videoRef.current.paused) {
          try {
            const detections = await faceapi.detectSingleFace(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.3 })
            ).withFaceExpressions();

            if (detections) {
              const expressions = detections.expressions;
              const maxEmotion = Object.keys(expressions).filter(k => k !== 'asSortedArray').reduce((a, b) =>
                (expressions as any)[a] > (expressions as any)[b] ? a : b
              );
              if (maxEmotion && (expressions as any)[maxEmotion] > 0.4) {
                setDetectedEmotion(maxEmotion);
              } else {
                setDetectedEmotion('neutral');
              }
            }
          } catch(e) {}
        }
      }, 200);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }
  }, [isCameraActive, isModelsLoaded]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-50/80 rounded-3xl overflow-hidden border-4 border-white shadow-2xl p-6 md:p-8 backdrop-blur text-center flex flex-col md:flex-row gap-8 items-center">
       
       <div className="flex-1 w-full aspect-square bg-gradient-to-b from-blue-100 to-amber-50 rounded-[3rem] shadow-inner relative overflow-hidden border-8 border-white">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
             <ambientLight intensity={0.8} />
             <directionalLight position={[10, 10, 10]} intensity={1.5} />
             <PetMesh emotion={detectedEmotion} />
             <Environment preset="city" />
             <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} />
          </Canvas>

          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-6 py-2 rounded-full font-black text-xl text-gray-700 shadow border-2 border-white uppercase tracking-widest">
            {detectedEmotion}
          </div>
       </div>

       <div className="flex-1 flex flex-col items-center gap-6 w-full max-w-sm">
          <div className="text-left w-full text-gray-700">
             <h3 className="text-3xl font-black mb-2 text-indigo-700">3D Emotions Mimic Pet</h3>
             <p className="text-lg font-medium leading-tight">
               Meet your new virtual friend! It perfectly mirrors your feelings. Smile, frown, or act surprised into the camera below to see it react instantly!
             </p>
          </div>

          <div className="relative w-full aspect-square bg-gray-900 rounded-3xl overflow-hidden border-8 border-indigo-200 shadow-xl flex items-center justify-center">
            {errorMsg ? (
              <div className="text-red-400 p-4 text-center text-sm z-10 relative">{errorMsg}</div>
            ) : !isCameraActive ? (
              <div className="flex flex-col items-center gap-4 z-10 relative p-4">
                {isModelsLoaded ? (
                  <button onClick={startCamera} className="bg-indigo-500 hover:bg-indigo-400 text-white font-black py-4 px-8 rounded-full shadow-lg flex items-center gap-3 transition-transform active:scale-95 text-lg">
                    <Camera size={28} /> Wake Up Pet!
                  </button>
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin" size={32} />
                    <span className="font-bold">Loading Magic...</span>
                  </div>
                )}
              </div>
            ) : null}

            <video
              ref={videoRef}
              className={`absolute z-0 w-full h-full object-cover mirror ${!isCameraActive ? 'hidden' : ''}`}
              style={{ transform: 'scaleX(-1)' }}
              autoPlay
              playsInline
              muted
            />
          </div>
       </div>
    </div>
  );
}


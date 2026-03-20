import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { motion } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';

const EMOTION_ANGLES: Record<string, number> = {
  happy: 0,
  sad: 51.43,
  angry: 102.86,
  disgusted: 154.29,
  fearful: 205.71,
  surprised: 257.14,
  neutral: 308.57,
};

export default function CameraEmotionWheel() {
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
        if (isMounted) setErrorMsg(`Models failed to load: ${e.message}`);
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
            videoRef.current.play().then(() => {
              setIsCameraActive(true);
            }).catch(e => console.error('Play error:', e));
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
              
              if (maxEmotion && (expressions as any)[maxEmotion] > 0.5) {
                setDetectedEmotion(maxEmotion);
              }
            }
          } catch(e) {
            console.error('Detection error:', e);
          }
        }
      }, 200);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isCameraActive, isModelsLoaded]);

  const targetRotation = -(EMOTION_ANGLES[detectedEmotion] || 0);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
      <div className="flex-1 flex flex-col items-center">
        <div className="relative w-64 h-64 md:w-80 md:h-80 bg-gray-950 rounded-full overflow-hidden border-8 border-indigo-400 shadow-xl mb-4">
          <video
            ref={videoRef}
            className={`absolute z-0 w-full h-full object-cover mirror ${!isCameraActive ? 'hidden' : ''}`}
            style={{ transform: 'scaleX(-1)' }}
            autoPlay
            playsInline
            muted
          />
          {errorMsg && (
            <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4 text-center text-sm bg-gray-900 z-10">
              {errorMsg}
            </div>
          )}
          {!isCameraActive && !errorMsg && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-900 p-4">
              {isModelsLoaded ? (
                <button
                  onClick={startCamera}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Camera size={24} /> Spin with Camera!
                </button>
              ) : (
                <div className="text-gray-400 flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin" size={32} />
                  <span className="text-sm font-bold">Loading AI...</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="bg-indigo-100 px-6 py-2 rounded-full font-bold text-indigo-800 uppercase tracking-widest border-2 border-indigo-200">
          You look: {detectedEmotion}
        </div>
      </div>

      <div className="flex-1 flex justify-center py-8">
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          {/* Indicator Triangle */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-indigo-600 z-30 drop-shadow-md"></div>
          
          <motion.div
            animate={{ rotate: targetRotation }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            className="w-full h-full rounded-full border-[12px] border-white shadow-2xl relative flex items-center justify-center bg-white"
            style={{
               background: 'conic-gradient(from -25.71deg, #facc15 0deg 51.43deg, #60a5fa 51.43deg 102.86deg, #f87171 102.86deg 154.29deg, #4ade80 154.29deg 205.71deg, #c084fc 205.71deg 257.14deg, #fb923c 257.14deg 308.57deg, #9ca3af 308.57deg 360deg)'
              }}
            >
              {/* Happy = 0 */}
              <div className="absolute w-full h-full flex justify-center" style={{ transform: 'rotate(0deg)' }}>
                 <div className="flex flex-col items-center mt-4">
                   <span className="text-3xl md:text-4xl drop-shadow-md">😄</span>
                   <span className="font-bold text-yellow-900 text-sm md:text-base mt-2">Happy</span>
                 </div>
              </div>
              {/* Sad = 51.43 */}
              <div className="absolute w-full h-full flex justify-center" style={{ transform: 'rotate(51.43deg)' }}>
                 <div className="flex flex-col items-center mt-4">
                   <span className="text-3xl md:text-4xl drop-shadow-md">😢</span>
                   <span className="font-bold text-blue-900 text-sm md:text-base mt-2">Sad</span>
                 </div>
              </div>
              {/* Angry = 102.86 */}
              <div className="absolute w-full h-full flex justify-center" style={{ transform: 'rotate(102.86deg)' }}>
                 <div className="flex flex-col items-center mt-4">
                   <span className="text-3xl md:text-4xl drop-shadow-md">😡</span>
                   <span className="font-bold text-red-900 text-sm md:text-base mt-2">Angry</span>
                 </div>
              </div>
              {/* Disgusted = 154.29 */}
              <div className="absolute w-full h-full flex justify-center" style={{ transform: 'rotate(154.29deg)' }}>
                 <div className="flex flex-col items-center mt-4">
                   <span className="text-3xl md:text-4xl drop-shadow-md">🤢</span>
                   <span className="font-bold text-green-900 text-sm md:text-base mt-2">Disgusted</span>
                 </div>
              </div>
              {/* Fearful = 205.71 */}
              <div className="absolute w-full h-full flex justify-center" style={{ transform: 'rotate(205.71deg)' }}>
                 <div className="flex flex-col items-center mt-4">
                   <span className="text-3xl md:text-4xl drop-shadow-md">😨</span>
                   <span className="font-bold text-purple-900 text-sm md:text-base mt-2">Fearful</span>
                 </div>
              </div>
              {/* Surprised = 257.14 */}
              <div className="absolute w-full h-full flex justify-center" style={{ transform: 'rotate(257.14deg)' }}>
                 <div className="flex flex-col items-center mt-4">
                   <span className="text-3xl md:text-4xl drop-shadow-md">😲</span>
                   <span className="font-bold text-orange-900 text-sm md:text-base mt-2">Surprised</span>
                 </div>
              </div>
              {/* Neutral = 308.57 */}
              <div className="absolute w-full h-full flex justify-center" style={{ transform: 'rotate(308.57deg)' }}>
                 <div className="flex flex-col items-center mt-4">
                   <span className="text-3xl md:text-4xl drop-shadow-md">😐</span>
                   <span className="font-bold text-gray-900 text-sm md:text-base mt-2">Neutral</span>
                 </div>
              </div>
              <div className="absolute bg-white w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center font-black text-sm md:text-lg text-gray-700 shadow-inner z-20 text-center leading-tight border-4 border-gray-100">
                EMOTION<br/>WHEEL
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

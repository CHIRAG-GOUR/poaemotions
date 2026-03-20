const fs = require('fs');

const simonSaysContent = \
import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, Award, Zap, Camera as CameraIcon } from 'lucide-react';
import Confetti from 'react-confetti';

export default function SimonSaysFeelings() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [targetEmotion, setTargetEmotion] = useState<{name: string, label: string, emoji: string} | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'success'>('idle');
  const [browniePoints, setBrowniePoints] = useState(0);

  const emotionsList = [
    { name: 'happy', label: 'HAPPY', emoji: '??' },
    { name: 'sad', label: 'SAD', emoji: '??' },
    { name: 'angry', label: 'ANGRY', emoji: '??' },
    { name: 'surprised', label: 'SURPRISED', emoji: '??' }
  ];

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
      streamRef.current = null;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startGame = async () => {
    if (!isCameraActive) await startCamera();
    
    // Pick random emotion
    const randomEmotion = emotionsList[Math.floor(Math.random() * emotionsList.length)];
    setTargetEmotion(randomEmotion);
    setGameState('playing');
    
    // Start detection loop
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(detectFace, 500);
  };

  const detectFace = async () => {
    if (!videoRef.current || videoRef.current.paused || !isModelsLoaded || gameState !== 'playing') return;

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && targetEmotion) {
        const expressions = detections.expressions as unknown as Record<string, number>;
        
        // If confidence for the target emotion is very high (> 0.7)
        if (expressions[targetEmotion.name] > 0.7) {
            handleSuccess();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSuccess = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setGameState('success');
    setBrowniePoints(prev => prev + 1);
    
    // Play Success Sound using Web Audio API
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch(e) {}
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 border-4 border-white shadow-2xl flex flex-col items-center">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-8">
        <h2 className="text-3xl font-black text-indigo-800 font-comic flex items-center gap-3">
          <Zap className="text-yellow-500 fill-yellow-500" size={32} /> Simon Says: Feelings!
        </h2>
        <div className="bg-yellow-100 px-6 py-2 rounded-full border-2 border-yellow-300 shadow-sm flex items-center gap-2">
          <Award size={24} className="text-yellow-600" />
          <span className="text-xl font-bold text-yellow-700">{browniePoints} Points</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-4xl">
        
        {/* Left Side: Instructions */}
        <div className="flex-1 flex flex-col items-center text-center gap-6">
          <AnimatePresence mode="wait">
            {gameState === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                 <div className="bg-indigo-100 p-6 rounded-full text-indigo-500"><CameraIcon size={64}/></div>
                 <p className="text-xl font-bold text-gray-700">Turn on your camera and mimic the emotion perfectly to win Brownie points!</p>
                 <button onClick={startGame} className="bg-indigo-600 text-white px-8 py-4 rounded-full font-black text-xl hover:bg-indigo-700 shadow-lg transform hover:scale-105 transition-all">Play Now!</button>
              </motion.div>
            )}

            {gameState === 'playing' && targetEmotion && (
               <motion.div key="playing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-3xl border-4 border-white shadow-lg w-full flex flex-col items-center">
                  <p className="text-gray-600 font-bold uppercase tracking-widest mb-2">Show me a...</p>
                  <h3 className="text-5xl font-black text-indigo-600 mb-4">{targetEmotion.label} <span className="text-6xl opacity-90">{targetEmotion.emoji}</span></h3>
                  <p className="text-lg font-medium text-gray-700 bg-white/60 px-6 py-2 rounded-full">Face</p>
                  <div className="mt-6 flex gap-2">
                     <span className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                     </span>
                     <span className="text-red-500 font-bold text-sm">Scanning...</span>
                  </div>
               </motion.div>
            )}

            {gameState === 'success' && targetEmotion && (
               <motion.div key="success" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-100 p-8 rounded-3xl border-4 border-green-200 shadow-lg w-full flex flex-col items-center relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none z-0">
                      {/* Confetti limited to container */}
                      <Confetti width={400} height={400} recycle={false} numberOfPieces={200} gravity={0.5} />
                  </div>
                  <h3 className="text-4xl font-black text-green-700 mb-2 relative z-10">Amazing! {targetEmotion.emoji}</h3>
                  <p className="text-green-800 font-bold text-xl relative z-10">+1 Brownie Point</p>
                  <button onClick={startGame} className="mt-8 bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 relative z-10 shadow-md">Next Card</button>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Camera View */}
        <div className="flex-1 w-full max-w-sm flex flex-col items-center relative">
            <div className="w-full aspect-video md:aspect-[4/3] bg-gray-900 rounded-3xl border-8 border-gray-100 shadow-inner overflow-hidden relative">
                {!isCameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                     <Camera size={48} className="mb-2 opacity-50" />
                     <p className="font-semibold text-sm">Camera Off</p>
                  </div>
                )}
                <video 
                   ref={videoRef}
                   autoPlay 
                   muted 
                   playsInline 
                   className={\w-full h-full object-cover \\}
                   style={{ transform: 'scaleX(-1)' }}
                />

                {/* Overlays / Filters */}
                {gameState === 'success' && targetEmotion?.name === 'angry' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       {/* Cartoon Steam from ears effect overlay */}
                       <div className="absolute top-10 left-4 w-12 h-12 bg-gray-200/80 rounded-full blur-sm animate-[ping_1s_ease-out_infinite]"></div>
                       <div className="absolute top-10 right-4 w-12 h-12 bg-gray-200/80 rounded-full blur-sm animate-[ping_1s_ease-out_infinite]"></div>
                    </motion.div>
                )}
                {gameState === 'success' && targetEmotion?.name === 'sad' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-blue-500/20 mix-blend-overlay pointer-events-none"></motion.div>
                )}
            </div>
            
            {/* Status indicator */}
            {!isModelsLoaded && (
              <div className="absolute -bottom-12 flex items-center gap-2 text-gray-500 font-bold bg-white px-4 py-2 rounded-full shadow-sm">
                <Loader2 className="animate-spin" size={16} /> Loading AI Models...
              </div>
            )}
        </div>

      </div>
    </div>
  );
}
\;

fs.writeFileSync('E:/1. Skillizee/POA Emotions/src/components/SimonSaysFeelings.tsx', simonSaysContent);

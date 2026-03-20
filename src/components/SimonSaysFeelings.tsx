import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, Play, CheckCircle2, Award, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const EMOTIONS_TO_PLAY = ['happy', 'sad', 'angry', 'surprised', 'fearful'];
const EMOTION_LABELS: Record<string, { emoji: string; text: string; color: string }> = {
  happy: { emoji: '😄', text: 'Happy', color: 'text-yellow-500' },
  sad: { emoji: '😢', text: 'Sad', color: 'text-blue-500' },
  angry: { emoji: '😡', text: 'Angry', color: 'text-red-500' },
  surprised: { emoji: '😲', text: 'Surprised', color: 'text-orange-500' },
  fearful: { emoji: '😨', text: 'Scared', color: 'text-purple-500' },
};

export default function SimonSaysFeelings() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'playing' | 'success' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [countdown, setCountdown] = useState(3);
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
        console.error("Failed to load face-api models", e);
        if (isMounted) setErrorMsg("Models failed to load: " + e.message);
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
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
             videoRef.current.width = videoRef.current.videoWidth || 640;
             videoRef.current.height = videoRef.current.videoHeight || 480;
             videoRef.current.play().then(() => {
                 setIsCameraActive(true);
                 startGame();
             }).catch(e => console.error("Play error:", e));
          }
        };
      }
      streamRef.current = stream;
    } catch (err: any) {
      console.error("Camera access denied or error:", err);
      setErrorMsg(err.name === 'NotAllowedError' ? "Camera access was denied." : err.message);
    }
  };

  const startGame = () => {
    setScore(0);
    setCurrentRound(0);
    startRoundSequence();
  };

  const startRoundSequence = () => {
    setGameState('countdown');
    setCountdown(3);

    let time = 3;
    const countInt = setInterval(() => {
      time -= 1;
      if (time > 0) {
        setCountdown(time);
      } else {
        clearInterval(countInt);
        setGameState('playing');
      }
    }, 1000);
  };

  // Face Detection Loop
  useEffect(() => {
    if (isCameraActive && isModelsLoaded && gameState === 'playing') {
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

                if (maxEmotion && (expressions as any)[maxEmotion] > 0.6) {
                    setDetectedEmotion(maxEmotion);
                } else {
                    setDetectedEmotion('neutral');
                }
            }
          } catch(e) {
             console.error("Detection error:", e);
          }
        }
      }, 200);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }
  }, [isCameraActive, isModelsLoaded, gameState]);

  // Game Logic Loop
  useEffect(() => {
    if (gameState === 'playing') {
      const target = EMOTIONS_TO_PLAY[currentRound % EMOTIONS_TO_PLAY.length];
      if (detectedEmotion === target) {
         handleRoundSuccess();
      }
    }
  }, [detectedEmotion, gameState, currentRound]);

  const handleRoundSuccess = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (videoRef.current) {
        videoRef.current.pause(); // Freeze feed
    }
    setGameState('success');
    setScore(s => s + 100);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      const nextRnd = currentRound + 1;
      if (nextRnd >= EMOTIONS_TO_PLAY.length) {
        setGameState('finished');
        if (videoRef.current) videoRef.current.play(); // Unfreeze to not look glitchy at end
        stopCamera();
      } else {
        if (videoRef.current) videoRef.current.play(); // Resume feed
        setCurrentRound(nextRnd);
        startRoundSequence();
      }
    }, 2500);
  };

  const targetEmotion = EMOTIONS_TO_PLAY[currentRound % EMOTIONS_TO_PLAY.length];
  const targetLabel = EMOTION_LABELS[targetEmotion] || { color: '', text: '', emoji: '' };

  return (
    <div className="w-full max-w-4xl mx-auto bg-blue-50/50 p-6 md:p-8 rounded-3xl shadow-xl border-4 border-white backdrop-blur-sm">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-black text-blue-900 drop-shadow-sm flex items-center justify-center gap-3">
            <Zap className="text-yellow-400" size={36} />
            Simon Says... Feelings!
            <Zap className="text-yellow-400" size={36} />
        </h2>
        <p className="text-lg text-blue-700 font-medium mt-2">Can you make the face we ask for?</p>
      </div>

      <div className="flex flex-col gap-6 w-full">

        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border-8 border-white shadow-inner flex items-center justify-center">
            <video
                ref={videoRef}
                className={`absolute z-0 w-full h-full object-cover mirror ${!isCameraActive ? 'hidden' : ''}`}
                style={{ transform: 'scaleX(-1)' }}
                autoPlay
                playsInline
                muted
            />

            {errorMsg ? (
                <div className="z-10 text-red-500 text-center p-4 bg-red-100 rounded-xl m-4">
                    <p className="font-bold">Camera Error</p>
                    <p className="text-sm">{errorMsg}</p>
                </div>
            ) : !isCameraActive && gameState === 'idle' ? (
                <div className="z-10 text-center flex flex-col items-center p-6 bg-white/10 backdrop-blur-md rounded-3xl">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Camera size={48} className="text-blue-500" />
                    </div>
                    {isModelsLoaded ? (
                        <button
                            onClick={startCamera}
                            className="bg-green-500 hover:bg-green-400 text-white font-black text-xl px-8 py-4 rounded-full shadow-lg border-b-8 border-green-700 active:border-b-0 active:mt-8 transition-all flex items-center gap-2"
                        >
                            <Play fill="currentColor" /> Play Now!
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 text-blue-300 font-bold">
                            <Loader2 className="animate-spin" /> Loading Magic Camera...
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <AnimatePresence>
                        {gameState === 'countdown' && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 2, opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm"
                            >
                                <motion.span
                                    key={countdown}
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1.5 }}
                                    className="text-8xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                                >
                                    {countdown}
                                </motion.span>
                            </motion.div>
                        )}

                        {gameState === 'success' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center z-20 overflow-hidden"
                            >
                                {/* Flashing Photo Snap Effect */}
                                <motion.div
                                   initial={{ opacity: 1 }}
                                   animate={{ opacity: 0 }}
                                   transition={{ duration: 0.5 }}
                                   className="absolute inset-0 bg-white z-30"
                                />

                                {/* Camera Freeze Overlay Container */}
                                <div className="absolute inset-0 bg-black/10 z-40">
                                   {targetEmotion === 'angry' && (
                                     <>
                                        <motion.div initial={{ opacity: 0, y: 50, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="absolute left-[10%] top-[30%] text-6xl">💨</motion.div>
                                        <motion.div initial={{ opacity: 0, y: 50, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="absolute right-[10%] top-[30%] text-6xl" style={{ transform: 'scaleX(-1)' }}>💨</motion.div>
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="absolute top-4 left-1/2 -translate-x-1/2 text-5xl drop-shadow-md">💢</motion.div>
                                     </>
                                   )}
                                   {targetEmotion === 'sad' && (
                                     <>
                                        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: [0, 50, 100], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute left-[30%] top-[40%] text-5xl drop-shadow-lg">💧</motion.div>
                                        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: [0, 50, 100], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} className="absolute right-[30%] top-[40%] text-5xl drop-shadow-lg">💧</motion.div>
                                        <div className="absolute top-0 left-0 w-full h-full bg-blue-500/20 mix-blend-overlay"></div>
                                     </>
                                   )}
                                   {targetEmotion === 'surprised' && (
                                     <>
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="absolute left-[20%] top-[20%] text-6xl text-yellow-400 font-black">!</motion.div>
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="absolute right-[20%] top-[10%] text-5xl text-yellow-400 font-black">?</motion.div>
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.4 }} className="absolute left-[10%] top-[50%] text-7xl text-yellow-400 font-black">!</motion.div>
                                     </>
                                   )}
                                   {targetEmotion === 'happy' && (
                                     <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                        className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-yellow-300 mix-blend-overlay"
                                     ></motion.div>
                                   )}
                                   {targetEmotion === 'fearful' && (
                                     <motion.div animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 0.2 }} className="absolute inset-0 z-40 bg-purple-900/40 mix-blend-multiply flex items-center justify-center">
                                         <span className="text-9xl opacity-30 drop-shadow-lg">👻</span>
                                     </motion.div>
                                   )}
                                </div>

                                <motion.div
                                    initial={{ scale: 0, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0 }}
                                    className="z-50 bg-white px-8 py-6 rounded-3xl border-4 border-green-400 text-center shadow-2xl flex flex-col items-center mt-32"
                                >
                                    <CheckCircle2 size={60} className="text-green-500 mb-2" />
                                    <span className="text-3xl font-black text-green-600">Great Job!</span>
                                    <span className="text-xl font-bold text-yellow-500 mt-2 flex items-center gap-1">
                                        <Award size={20}/> +1 Brownie Point
                                    </span>
                                </motion.div>
                            </motion.div>
                        )}

                        {gameState === 'finished' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex items-center justify-center z-20 bg-blue-600/80 backdrop-blur-md"
                            >
                                <div className="bg-white p-8 rounded-3xl text-center shadow-2xl flex flex-col items-center">
                                    <Award size={80} className="text-yellow-400 mb-4 drop-shadow-md" />
                                    <span className="text-4xl font-black text-blue-900 mb-2">You Did It!</span>
                                    <span className="text-2xl font-bold text-blue-600 mb-6">Final Score: {score}</span>
                                    <button
                                        onClick={startGame}
                                        className="bg-blue-500 hover:bg-blue-400 text-white font-black px-6 py-3 rounded-full flex items-center gap-2"
                                    >
                                        <Play fill="currentColor" /> Play Again
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>

        <div className="flex gap-4 items-center">
             <div className="flex-1 bg-white p-4 rounded-2xl shadow-inner border-2 border-indigo-100 flex items-center justify-between">
                <div>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Round {gameState === 'playing' || gameState === 'success' ? currentRound + 1 : 0} / {EMOTIONS_TO_PLAY.length}</p>
                   {gameState === 'playing' ? (
                       <p className="text-2xl font-black text-gray-700 flex items-center gap-2">
                          Show me: <span className={`${targetLabel?.color}`}>{targetLabel?.text}</span> {targetLabel?.emoji}
                       </p>
                   ) : (
                       <p className="text-2xl font-black text-gray-300">Waiting...</p>
                   )}
                </div>
                <div className="text-right">
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Score</p>
                   <p className="text-3xl font-black text-yellow-500 flex items-center gap-1 justify-end"><Award /> {score}</p>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
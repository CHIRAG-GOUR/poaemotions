import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Unlock, Lock, Loader2, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORY_PARTS = [
  {
    id: 1,
    text: "Once upon a time in the colorful land of SkilliZee, there was a little blob named Blobby. Blobby found a shiny new toy in the magical forest and felt incredibly...",
    targetEmotion: "happy",
    instruction: "Show a HAPPY face to see what happens next!",
    emoji: "😄",
    color: "bg-yellow-100 border-yellow-400 text-yellow-800"
  },
  {
    id: 2,
    text: "He played all day! But suddenly, the toy fell into a deep, dark puddle. It was gone. Blobby sat by the puddle and felt very...",
    targetEmotion: "sad",
    instruction: "Show a SAD face to share Blobby's feelings.",
    emoji: "😢",
    color: "bg-blue-100 border-blue-400 text-blue-800"
  },
  {
    id: 3,
    text: "Wait! A grumpy troll marched over and told Blobby it was his puddle! 'Go away!' the troll shouted. Blobby puffed up, feeling extremely...",
    targetEmotion: "angry",
    instruction: "Show an ANGRY face to stand up to the troll!",
    emoji: "😡",
    color: "bg-red-100 border-red-400 text-red-800"
  },
  {
    id: 4,
    text: "Just as Blobby was about to yell back, the troll tripped on a banana peel and did a funny dance before falling into the mud. Blobby gasped, utterly...",
    targetEmotion: "surprised",
    instruction: "Show a SURPRISED face!",
    emoji: "😲",
    color: "bg-orange-100 border-orange-400 text-orange-800"
  }
];

export default function FacialStoryUnlock() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [currentPart, setCurrentPart] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
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
             }).catch(e => console.error("Play error:", e));
          }
        };
      }
      streamRef.current = stream;
    } catch (err: any) {
      setErrorMsg(err.name === 'NotAllowedError' ? "Camera access was denied." : err.message);
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
  }, [isCameraActive, isModelsLoaded]);

  // Check for unlock condition
  useEffect(() => {
    if (isUnlocked || currentPart >= STORY_PARTS.length) return;
    
    const target = STORY_PARTS[currentPart].targetEmotion;
    if (detectedEmotion === target) {
        handleUnlock();
    }
  }, [detectedEmotion, currentPart, isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
    
    // Auto advance after a delay
    setTimeout(() => {
        if (currentPart < STORY_PARTS.length - 1) {
            setCurrentPart(p => p + 1);
            setIsUnlocked(false);
        } else {
            setCurrentPart(p => p + 1); // Finished
        }
    }, 3000);
  };

  const isFinished = currentPart >= STORY_PARTS.length;
  const currentBlock = STORY_PARTS[Math.min(currentPart, STORY_PARTS.length - 1)];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 bg-white/50 p-6 rounded-[3rem] border-8 border-white shadow-xl backdrop-blur-md">
        
        {/* Story Area */}
        <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-black text-indigo-900 mb-6 flex items-center gap-3 drop-shadow-sm">
                <BookOpen className="text-indigo-500" size={32} /> Facial Story Unlocks
            </h2>
            
            <div className="space-y-4 mb-6 flex-1">
                <AnimatePresence>
                    {STORY_PARTS.slice(0, currentPart + (isUnlocked ? 1 : 0)).map((part, i) => (
                        <motion.div 
                            key={part.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`p-5 rounded-3xl border-2 shadow-sm text-lg font-bold leading-relaxed ${
                                i === currentPart 
                                  ? (isUnlocked ? 'bg-green-50 border-green-300 text-green-900 shadow-lg ring-4 ring-green-100 ring-offset-2' : part.color)
                                  : 'bg-white text-gray-500 border-gray-100'
                            }`}
                        >
                            {part.text}
                            {i === currentPart && isUnlocked && (
                                <motion.span 
                                    initial={{ scale: 0 }} 
                                    animate={{ scale: 1 }} 
                                    className="ml-2 inline-block text-2xl"
                                >
                                    {part.emoji}  ✨
                                </motion.span>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isFinished && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white text-center shadow-xl border-4 border-indigo-300"
                    >
                        <h3 className="text-3xl font-black mb-2">🎉 Story Complete! 🎉</h3>
                        <p className="text-xl font-medium text-indigo-100">You did a great job showing your emotions to help Blobby!</p>
                    </motion.div>
                )}
            </div>

        </div>

        {/* Camera / Interaction Area */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">
           {isFinished ? (
              <div className="flex-1 bg-white rounded-[2rem] border-4 border-indigo-100 p-6 flex flex-col items-center justify-center text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h4 className="text-2xl font-black text-indigo-900">Empathy Master!</h4>
              </div>
           ) : (
             <div className={`p-6 rounded-[2rem] border-4 shadow-lg text-center transition-colors ${isUnlocked ? 'bg-green-400 border-green-500 text-white' : 'bg-gray-800 border-gray-900 text-white'}`}>
                
                {/* Status Header */}
                <div className="flex items-center justify-center gap-2 mb-4 font-bold text-lg">
                    {isUnlocked ? (
                         <><Unlock size={24} /> <span className="uppercase tracking-wide">Unlocked!</span></>
                    ) : (
                         <><Lock size={24} className="text-gray-400" /> <span className="uppercase tracking-wide text-gray-300">Story Locked</span></>
                    )}
                </div>

                {/* Webcam Container */}
                <div className="w-full aspect-square bg-gray-950 rounded-2xl overflow-hidden relative border-4 border-black mb-4">
                    <video 
                        ref={videoRef} 
                        className={`absolute z-0 w-full h-full object-cover mirror ${!isCameraActive ? 'hidden' : ''}`}
                        style={{ transform: 'scaleX(-1)' }}
                        autoPlay
                        playsInline 
                        muted 
                    />

                    {errorMsg ? (
                        <div className="z-10 absolute inset-0 flex items-center justify-center text-red-400 p-2 text-sm bg-gray-900">
                            {errorMsg}
                        </div>
                    ) : !isCameraActive ? (
                        <div className="z-10 absolute inset-0 flex flex-col items-center justify-center p-4">
                            {isModelsLoaded ? (
                                <button 
                                    onClick={startCamera}
                                    className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-4 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
                                >
                                    <Camera size={20} /> Start Camera
                                </button>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center gap-2 bg-gray-900 p-4 rounded-xl">
                                    <Loader2 className="animate-spin" />
                                    <span className="text-xs font-bold">Loading Magic...</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Overlay detected emotion icon */}
                            {!isUnlocked && detectedEmotion !== 'neutral' && (
                                <div className="absolute bottom-2 right-2 bg-white text-2xl p-2 rounded-xl shadow-md z-10">
                                   {detectedEmotion === 'happy' && '😄'}
                                   {detectedEmotion === 'sad' && '😢'}
                                   {detectedEmotion === 'angry' && '😡'}
                                   {detectedEmotion === 'surprised' && '😲'}
                                   {detectedEmotion === 'fearful' && '😨'}
                                   {detectedEmotion === 'disgusted' && '🤢'}
                                </div>
                            )}
                            {/* Scanner Line */}
                            {!isUnlocked && (
                                <motion.div 
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                                    className="absolute left-0 right-0 h-1 bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-10"
                                />
                            )}
                        </>
                    )}

                    {/* Success Overlay */}
                    <AnimatePresence>
                        {isUnlocked && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-green-500/50 flex items-center justify-center backdrop-blur-sm z-20"
                            >
                                <span className="text-6xl drop-shadow-md">{currentBlock.emoji}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Instruction */}
                <div className="font-semibold text-sm">
                    {isUnlocked ? "Awesome! Next part loading..." : currentBlock.instruction}
                </div>
             </div>
           )}
        </div>

    </div>
  );
}

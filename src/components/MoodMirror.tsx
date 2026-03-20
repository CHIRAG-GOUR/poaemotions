import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, AlertCircle } from 'lucide-react';

export default function MoodMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');      
  const [errorMsg, setErrorMsg] = useState<string>('');

  const EMOTION_MAP: Record<string, { color: string, border: string, emoji: string, text: string }> = {
    happy: { color: 'bg-yellow-400', border: 'border-yellow-300', emoji: '😄', text: 'You look Happy!' },
    sad: { color: 'bg-blue-400', border: 'border-blue-300', emoji: '😢', text: 'Feeling Sad?' },
    angry: { color: 'bg-red-400', border: 'border-red-300', emoji: '😡', text: 'Oh, so Angry!' },
    fearful: { color: 'bg-purple-400', border: 'border-purple-300', emoji: '😨', text: 'Scared or Fearful?' },
    disgusted: { color: 'bg-green-400', border: 'border-green-300', emoji: '🤢', text: 'Disgusted!' },
    surprised: { color: 'bg-orange-400', border: 'border-orange-300', emoji: '😲', text: 'Surprised!' },
    neutral: { color: 'bg-gray-400', border: 'border-gray-300', emoji: '😐', text: 'Neutral / Calm' },
  };

// Custom Synthesized Sound Effects for each Emotion
  useEffect(() => {
    if (!isCameraActive || !isModelsLoaded) return;
    
    // Play a distinct magical retro sound for each emotion using Web Audio API
    const playSound = (emotion: string) => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        
        if (emotion === 'happy') {
          // Cheerful ascending chime
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, now); // A4
          oscillator.frequency.setValueAtTime(554.37, now + 0.1); // C#5
          oscillator.frequency.setValueAtTime(659.25, now + 0.2); // E5
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          oscillator.start(now);
          oscillator.stop(now + 0.5);
        } else if (emotion === 'sad') {
          // Melancholy descending tone
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(349.23, now); // F4
          oscillator.frequency.linearRampToValueAtTime(261.63, now + 0.3); // C4
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.linearRampToValueAtTime(0.01, now + 0.8);
          oscillator.start(now);
          oscillator.stop(now + 0.8);
        } else if (emotion === 'surprised') {
          // Sharp popup sound
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(300, now);
          oscillator.frequency.exponentialRampToValueAtTime(900, now + 0.1);
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          oscillator.start(now);
          oscillator.stop(now + 0.3);
        } else if (emotion === 'angry') {
          // Low vibrating distorted hum
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(150, now);
          oscillator.frequency.linearRampToValueAtTime(90, now + 0.3);
          gainNode.gain.setValueAtTime(0.4, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          oscillator.start(now);
          oscillator.stop(now + 0.4);
        } else if (emotion === 'fearful') {
          // Shaking high pitch
          oscillator.type = 'square';
          for(let i=0; i<6; i++) {
             oscillator.frequency.setValueAtTime(600, now + i*0.08);
             oscillator.frequency.setValueAtTime(500, now + i*0.08 + 0.04);
          }
          gainNode.gain.setValueAtTime(0.15, now);
          gainNode.gain.linearRampToValueAtTime(0.01, now + 0.5);
          oscillator.start(now);
          oscillator.stop(now + 0.5);
        } else if (emotion === 'disgusted') {
          // Weird sliding 'eww' sound
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(200, now);
          oscillator.frequency.linearRampToValueAtTime(150, now + 0.2);
          oscillator.frequency.linearRampToValueAtTime(220, now + 0.4);
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.linearRampToValueAtTime(0.01, now + 0.6);
          oscillator.start(now);
          oscillator.stop(now + 0.6);
        } else {
          // neutral simple blip
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, now);
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          oscillator.start(now);
          oscillator.stop(now + 0.1);
        }
      } catch (e) {
        console.error('Audio generation failed', e);
      }
    };

    playSound(currentEmotion);

  }, [currentEmotion, isCameraActive, isModelsLoaded]);

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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const startCamera = async () => {
    setErrorMsg('');
    try {
      console.log('Requesting camera...');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {    
        throw new Error("Camera API is not supported in this browser.");        
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.width = videoRef.current.videoWidth || 640;
            videoRef.current.height = videoRef.current.videoHeight || 480;
            videoRef.current.play().catch(e => console.error("Play error:", e));
          }
        };
      }

      streamRef.current = stream;
      setIsCameraActive(true);
      console.log('Camera active!');

    } catch (err: any) {
      console.error("Camera access denied or error:", err);
      setErrorMsg(err.name === 'NotAllowedError'
        ? "Camera access was denied." : err.message || "Failed to open camera");
    }
  };

  const handleVideoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(async () => {
      if (videoRef.current && isCameraActive && isModelsLoaded) {
        try {
          const detections = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.2 })
          ).withFaceExpressions();

          if (detections) {
            const expressions = detections.expressions;
            const maxEmotion = Object.keys(expressions).filter(k => k !== 'asSortedArray').reduce((a, b) =>        
              (expressions as any)[a] > (expressions as any)[b] ? a : b
            );
            
            // Added confidence check (0.4) so it doesn't jump randomly on low confidence expressions
            if (maxEmotion && ((expressions as any)[maxEmotion] as number) > 0.4) {
               setCurrentEmotion(prev => prev !== maxEmotion ? maxEmotion : prev);
            }
          }
        } catch (err) {
          console.error("Face detection error:", err);
        }
      }
    }, 1000); // Check once every second so audio isn't spammed with too many changes
  };

  const moodState = EMOTION_MAP[currentEmotion] || EMOTION_MAP.neutral;

  return (
    <div className="flex flex-col items-center w-full my-8 text-quicksand">     
      <div className={`p-8 md:p-12 rounded-[3.5rem] shadow-xl flex flex-col items-center text-center relative overflow-hidden transition-colors duration-500 border-[8px] ${moodState.border} bg-white max-w-[800px] w-full`}>                  
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Camera size={160}/>
        </div>

        <h3 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 z-10 drop-shadow-sm font-nunito">Magic Mood Mirror</h3>                                   
        <p className="text-xl md:text-2xl text-gray-600 font-bold mb-8 z-10 max-w-lg leading-relaxed">
          Look into the mirror and let it guess how you are feeling today!      
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md flex items-center gap-3 z-10 font-bold text-left">
            <AlertCircle size={24} className="shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <motion.div
          animate={{ borderColor: EMOTION_MAP[currentEmotion]?.color.replace('bg-', '') || '' }}
          className={`w-full max-w-[600px] aspect-video rounded-[3rem] border-[14px] shadow-inner relative overflow-hidden flex flex-col items-center justify-center bg-gray-900 ${moodState.border} z-10`}
        >
          <video
            ref={videoRef}
            onPlay={handleVideoPlay}
            autoPlay
            muted
            playsInline
            className="absolute z-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ transform: 'scaleX(-1)' }}
          />

          {!isCameraActive && (
             <div className="z-10 flex flex-col items-center justify-center p-6 text-white text-center h-full gap-5">
                {!errorMsg ? (
                  <>
                     <Camera size={72} className="text-gray-500 mb-2" />        
                     <p className="text-gray-300 font-bold text-2xl max-w-[300px]">The mirror is waiting for you...</p>
                  </>
                ) : (
                  <>
                     <Camera size={72} className="text-red-400 mb-2" />
                     <p className="text-gray-300 font-bold text-2xl max-w-[300px]">Camera blocked or unavailable.</p>
                  </>
                )}
             </div>
          )}
        </motion.div>

        {!isCameraActive && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              startCamera();
            }}
            className="mt-10 px-12 py-6 cursor-pointer relative bg-purple-500 hover:bg-purple-600 text-white font-black text-3xl rounded-[2.5rem] border-b-[8px] border-purple-700 active:border-b-0 active:translate-y-2 transition-all z-50 shadow-lg"
          >
            Start Camera
          </button>
        )}

        <div className="h-24 mt-8 w-full flex justify-center z-10 relative">    
          <AnimatePresence mode="wait">
            {isCameraActive && isModelsLoaded && (
              <motion.div
                key={currentEmotion}
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}    
                className={`absolute px-8 py-3 ${moodState.color} text-white font-black text-xl md:text-2xl rounded-full shadow-lg flex items-center gap-4 border-b-[4px] border-black/10`}
              >
                <span className="text-4xl">{moodState.emoji}</span>
                {moodState.text}
              </motion.div>
            )}
            {isCameraActive && !isModelsLoaded && !errorMsg && (
              <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="absolute px-8 py-3 bg-gray-600 text-white font-black text-xl md:text-2xl rounded-full shadow-lg flex items-center gap-4"
              >
                 <Loader2 className="animate-spin" />
                 Waking up Magic AI...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
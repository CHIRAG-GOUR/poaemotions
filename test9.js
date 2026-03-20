const fs = require('fs');

const storyUnlockContent = \
import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Unlock, Lock, Loader2, BookOpen } from 'lucide-react';
import Confetti from 'react-confetti';

export default function StoryUnlock() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

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

  const activateCamera = async () => {
    if (!isModelsLoaded) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        intervalRef.current = setInterval(detectFace, 500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const detectFace = async () => {
    if (!videoRef.current || videoRef.current.paused || !isModelsLoaded || isUnlocked) return;

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections) {
        const expressions = detections.expressions as unknown as Record<string, number>;
        // Looking for SAD face to unlock
        if (expressions['sad'] > 0.6) {
           handleUnlock();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    // Play a gentle ding
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1);
    } catch(e) {}
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="w-full bg-orange-50/90 backdrop-blur-md rounded-[2.5rem] p-8 border-4 border-orange-200 shadow-xl overflow-hidden relative">
      
      <div className="flex items-center gap-4 mb-8 border-b-4 border-orange-100 pb-6">
        <div className="bg-orange-400 p-4 rounded-2xl text-white shadow-md">
          <BookOpen size={36} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-orange-900 font-comic">The Lost Toy Story</h2>
      </div>

      <div className="flex flex-col gap-6 text-xl text-gray-800 font-medium leading-relaxed mb-12">
        <p>Once upon a time, a little boy named <strong className="text-orange-600">Tommy</strong> was playing in the park.</p>
        <p>He had a bright red toy rocket that he loved more than anything else in the world.</p>
        <p>But when it was time to go home, Tommy looked everywhere... the rocket was gone! He had lost it in the sandpit.</p>
      </div>

      {!isUnlocked ? (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-blue-100 p-8 rounded-[2rem] border-4 border-blue-300 shadow-inner flex flex-col md:flex-row items-center gap-8">
           <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-black text-blue-900 mb-4 flex items-center justify-center md:justify-start gap-2">
                 <Lock className="text-blue-500" /> Empathy Lock!
              </h3>
              <p className="text-xl text-blue-800 mb-6">Tommy feels very <strong className="text-blue-600 uppercase text-2xl bg-white px-2 rounded">sad</strong>. Can you show a SAD face to help him and unlock the rest of the story?</p>
              
              {!isCameraActive ? (
                <button onClick={activateCamera} disabled={!isModelsLoaded} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-xl hover:bg-blue-700 shadow-lg transition-transform hover:-translate-y-1 w-full md:w-auto flex items-center justify-center gap-3">
                  <Camera /> {isModelsLoaded ? 'Turn on Camera' : 'Loading AI...'}
                </button>
              ) : (
                <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full text-blue-600 font-bold border-2 border-blue-200 shadow-sm">
                   <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                   </span>
                   Waiting for a Sad Face...
                </div>
              )}
           </div>

           <div className="w-full md:w-64 aspect-square bg-gray-900 rounded-3xl overflow-hidden shadow-lg border-4 border-white relative shrink-0 flex items-center justify-center">
               {!isCameraActive && <Camera size={48} className="text-white/50" />}
               <video 
                 ref={videoRef}
                 autoPlay 
                 muted 
                 playsInline 
                 className={\bsolute inset-0 w-full h-full object-cover \\}
                 style={{ transform: 'scaleX(-1)' }}
               />
           </div>
        </motion.div>
      ) : (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
           <div className="bg-green-100 p-8 rounded-[2rem] border-4 border-green-300 shadow-sm relative">
              <div className="absolute inset-0 pointer-events-none"><Confetti width={600} height={300} recycle={false} /></div>
              <h3 className="text-2xl font-black text-green-800 mb-4 flex items-center gap-2">
                 <Unlock className="text-green-600" /> Story Unlocked!
              </h3>
              <p className="text-xl text-green-900 leading-relaxed font-medium">
                 Thank you for showing empathy! Because of your help, a kind park ranger noticed Tommy crying. The ranger had found the red rocket by the swing set and returned it to Tommy. He hugged his rocket tightly and smiled the biggest smile ever!
              </p>
           </div>
        </motion.div>
      )}

    </div>
  );
}
\;

fs.writeFileSync('E:/1. Skillizee/POA Emotions/src/components/StoryUnlock.tsx', storyUnlockContent);

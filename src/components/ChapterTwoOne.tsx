import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Activity, Brain, Smile, Compass, CheckCircle2, HeartPulse, UserPlus, Play, Gift, Award, AlertCircle } from 'lucide-react';
import SimonSaysFeelings from './SimonSaysFeelings';
import CameraEmotionWheel from './CameraEmotionWheel';

const ChapterTwoOne = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const situations = [
    { id: 1, text: "You lost your favourite toy.", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50", guess: "Sad" },
    { id: 2, text: "Your friend surprised you with a gift.", icon: Gift, color: "text-purple-500", bg: "bg-purple-50", guess: "Happy/Surprised" },
    { id: 3, text: "You scored full marks in a test.", icon: Award, color: "text-yellow-500", bg: "bg-yellow-50", guess: "Proud/Excited" },
    { id: 4, text: "You forgot your homework.", icon: Compass, color: "text-blue-500", bg: "bg-blue-50", guess: "Nervous" },
  ];

  const steps = [
    // Step 0: Intro
    (
      <motion.div key="step-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center max-w-4xl mx-auto space-y-8">
        <div className="bg-white/80 p-8 rounded-3xl shadow-xl border-4 border-white text-center flex flex-col items-center">
            <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }} className="bg-blue-100 p-6 rounded-full mb-6 text-blue-600 shadow-inner">
                <Brain size={80} />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-6 drop-shadow-sm font-comic">Chapter 2.1 <br/><span className="text-blue-600">— Problem Statement —</span></h2>
            <p className="text-2xl font-bold italic text-blue-900 bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 shadow-sm leading-relaxed">
              "Imagine you are Emotion Detectives.<br/>Your job is to understand what people are feeling and why."
            </p>
        </div>

        <div className="bg-purple-50/90 p-8 rounded-3xl shadow-lg border-2 border-purple-200 w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
            <h3 className="text-2xl font-black text-purple-900 mb-6 flex items-center gap-3">
               <Eye size={32} /> Explain that emotions can be understood through:
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
                <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex flex-col items-center text-center gap-3">
                    <Smile size={48} className="text-pink-500" />
                    <span className="font-bold text-xl text-gray-700">Facial expressions</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex flex-col items-center text-center gap-3">
                    <Activity size={48} className="text-orange-500" />
                    <span className="font-bold text-xl text-gray-700">Body language</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex flex-col items-center text-center gap-3">
                    <Compass size={48} className="text-teal-500" />
                    <span className="font-bold text-xl text-gray-700">Situations or events</span>
                </motion.div>
            </div>
        </div>

        <div className="bg-green-50/90 p-8 rounded-3xl shadow-lg border-2 border-green-200 w-full">
            <h3 className="text-2xl font-black text-green-900 mb-6 flex items-center gap-3">
                 <UserPlus size={32} /> Task Instructions
            </h3>
            <p className="text-xl font-bold text-gray-800 mb-4 bg-white p-4 rounded-xl inline-block border-2 border-dashed border-green-300">👥 Pair into groups of 3–4!</p>
            <ul className="space-y-3 mt-4">
                {["Identify different emotions", "Act out situations", "Guess emotions of others", "Create a fun Emotion Story Scene"].map((task, i) => (
                    <motion.li key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 text-xl font-semibold text-gray-700 bg-white/60 p-4 rounded-xl">
                        <CheckCircle2 className="text-green-500" size={28} /> {task}
                    </motion.li>
                ))}
            </ul>
        </div>
      </motion.div>
    ),
    // Step 1: Simon Says Feelings
    (
      <motion.div key="step-1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col items-center w-full">
         <SimonSaysFeelings />
      </motion.div>
    ),
    // Step 2: Emotion Situation Challenge
    (
        <motion.div key="step-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto w-full space-y-8">
            <div className="text-center w-full bg-indigo-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <h2 className="text-3xl font-black relative z-10">Step 2: Situation Challenge 🤔</h2>
             <p className="text-xl font-medium mt-2 relative z-10 text-indigo-100">Discuss: What emotion does this person feel? Why? Then act it out!</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {situations.map((sit, i) => {
                    const Icon = sit.icon;
                    return (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`${sit.bg} p-6 rounded-3xl border-2 border-white shadow-lg group hover:shadow-xl transition-all`}>
                            <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm ${sit.color}`}>
                                    <Icon size={28} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-4">{sit.text}</h4>
                                    <div className="bg-white/60 p-4 rounded-xl border border-black/5">
                                        <p className="font-semibold text-gray-600 mb-2">Likely Emotion:</p>
                                        <span className={`inline-block px-4 py-1 rounded-full font-black text-sm uppercase tracking-wide bg-white shadow-sm ${sit.color}`}>{sit.guess}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    ),
    // Step 3: Wheel Drawing
      (
          <motion.div key="step-3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto w-full">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-8 rounded-3xl shadow-lg border-2 border-indigo-200">
                  <h2 className="text-3xl font-black text-indigo-700 mb-2 flex items-center gap-2 justify-center">
                      <HeartPulse size={36} /> Digital Emotion Wheel
                  </h2>
                  <p className="text-indigo-600 font-medium mb-6 text-center text-md md:text-lg max-w-2xl mx-auto">
                      Start the camera and show your feelings! The wheel will magically spin to match your emotions!
                  </p>
                  <CameraEmotionWheel />
              </div>
          </motion.div>
      )
  ];

  return (
    <div className="w-full min-h-[80vh] flex flex-col p-4 md:p-8">
      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center mb-8">
        <AnimatePresence mode="wait">
            {steps[currentStep]}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center max-w-4xl mx-auto w-full bg-white/50 backdrop-blur-md p-4 rounded-full border-2 border-white shadow-lg mt-auto">
          <button 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all ${currentStep === 0 ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-white text-blue-600 hover:bg-blue-50 shadow-md border border-blue-100'}`}
          >
              Back
          </button>
          
          <div className="flex gap-2">
              {steps.map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-blue-600' : 'bg-blue-200'}`} />
              ))}
          </div>

          <button 
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all flex items-center gap-2 ${currentStep === steps.length - 1 ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}
          >
              {currentStep === 0 ? 'Start Activity' : 'Next'} <Play fill="currentColor" size={16} />
          </button>
      </div>
    </div>
  );
};

export default ChapterTwoOne;


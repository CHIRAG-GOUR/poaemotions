import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import Scene3D from './components/Scene3D';
import { Smile, MessageCircleHeart, Lightbulb, Play, Video, Camera } from 'lucide-react';
import MoodMirror from './components/MoodMirror';
import ChapterThree from './components/ChapterThree';
import ChapterTwoOne from './components/ChapterTwoOne';
import ChapterTwoTwo from './components/ChapterTwoTwo';
import ChapterTwoThree from './components/ChapterTwoThree';
import FullscreenButton from './components/FullscreenButton';
import { ErrorBoundary } from './components/ErrorBoundary';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.12, type: 'spring' as const, stiffness: 100, damping: 20 }
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  hover: { 
    y: -8, 
    scale: 1.02,
    boxShadow: "0 25px 35px -10px rgba(0,0,0,0.12), 0 10px 15px -10px rgba(0,0,0,0.08)",
    transition: { type: 'spring' as const, stiffness: 400, damping: 15 } 
  }
};

const titleContainerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.3 } 
  }
};

const titleWordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring' as const, stiffness: 150, damping: 12 }
  }
};

function ChapterContent() {
  const { chapterId } = useParams();
  const chapter = (chapterId ? chapterId.replace('chapter-', '') : '') || '1.1';

  return (
    <AnimatePresence mode="wait">
      {chapter === '1.1' && (
        <motion.div key="1.1" className="flex flex-col gap-8" initial="hidden" animate="visible" exit="exit">
          
          {/* Header Card */}
          <motion.div 
            variants={cardVariants} 
            custom={0} 
            whileHover="hover"
            className="bg-white/90 backdrop-blur-xl border-4 border-white p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }} 
              animate={{ scale: 1, rotate: 0 }} 
              transition={{ type: 'spring' as const, stiffness: 200, damping: 20, delay: 0.2 }}
              className="bg-blue-500 p-4 rounded-3xl text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10"
            >
              <Smile size={56} strokeWidth={2.5} />
            </motion.div>
            <div className="z-10">
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-blue-600 font-bold text-lg uppercase tracking-widest mb-1"
              >
                Emotion Explorers
              </motion.p>
              <motion.h1 
                variants={titleContainerVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl md:text-5xl font-extrabold font-nunito text-gray-800 drop-shadow-sm flex flex-wrap gap-x-3"
              >
                {["Chapter", "1.1", "|", "Introduction"].map((word, i) => (
                  <motion.span key={i} variants={titleWordVariants} className={word === "|" ? "text-gray-300 font-light" : ""}>
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
            </div>
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-blue-100/60 rounded-full blur-3xl pointer-events-none"></div>
          </motion.div>

          {/* Intro Paragraph Card */}
          <motion.div 
            variants={cardVariants} 
            custom={1} 
            whileHover="hover"
            className="bg-orange-50/90 backdrop-blur-md border-2 border-orange-200 p-8 rounded-[2rem] shadow-lg relative overflow-hidden"
          >
             <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-orange-300 to-orange-500 rounded-l-[2rem]"></div>
             <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed pl-2">
               <strong className="text-orange-600">The session begins with a short conversation about feelings and emotions.</strong>
               <br/><br/>
               "Every day we feel many different emotions. Sometimes we feel happy, excited, sad, nervous, or even angry. But understanding our emotions helps us become better friends, better communicators, and stronger problem solvers."
             </p>
          </motion.div>

          {/* Interactive Questions Area */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              variants={cardVariants} 
              custom={2} 
              whileHover="hover"
              className="bg-white/90 backdrop-blur-md border-2 border-white p-8 rounded-[2rem] shadow-lg flex flex-col gap-6"
            >
              <div className="flex items-center gap-3 text-purple-600">
                <MessageCircleHeart size={32} />
                <h3 className="text-2xl font-bold">Think about it...</h3>
              </div>
              
              <ul className="flex flex-col gap-4">
                <motion.li whileHover={{ scale: 1.02, x: 5 }} className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-start gap-4 shadow-sm cursor-pointer transition-colors hover:bg-purple-100">
                  <div className="bg-purple-200 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                  <p className="text-lg text-gray-700 font-semibold mt-0.5">How do you feel when you <span className="text-purple-600">win a game</span>?</p>
                </motion.li>
                <motion.li whileHover={{ scale: 1.02, x: 5 }} className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-4 shadow-sm cursor-pointer transition-colors hover:bg-green-100">
                  <div className="bg-green-200 text-green-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                  <p className="text-lg text-gray-700 font-semibold mt-0.5">How do you feel when someone <span className="text-green-600">shares their toy</span> with you?</p>
                </motion.li>
                <motion.li whileHover={{ scale: 1.02, x: 5 }} className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-4 shadow-sm cursor-pointer transition-colors hover:bg-red-100">
                  <div className="bg-red-200 text-red-700 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                  <p className="text-lg text-gray-700 font-semibold mt-0.5">How do you feel when something <span className="text-red-600">does not go your way</span>?</p>
                </motion.li>
              </ul>
            </motion.div>

            {/* Image / Illustration Card */}
            <motion.div 
              variants={cardVariants} 
              custom={3} 
              whileHover="hover"
              className="bg-blue-50/90 backdrop-blur-md border-2 border-blue-100 p-8 rounded-[2rem] shadow-lg flex flex-col items-center justify-center text-center"
            >
              <div className="relative w-full h-48 bg-white rounded-2xl shadow-inner mb-6 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-300 via-transparent to-transparent"></div>
                <div className="flex gap-4">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transform -rotate-12 shrink-0">
                    <span className="text-3xl">😄</span>
                  </motion.div>
                  <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }} className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center shadow-lg transform rotate-12 shrink-0">
                    <span className="text-3xl">😢</span>
                  </motion.div>
                  <motion.div animate={{ rotate: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center shadow-lg shrink-0">
                    <span className="text-3xl">😠</span>
                  </motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.2 }} className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg transform rotate-6 shrink-0">
                    <span className="text-3xl">🤢</span>
                  </motion.div>
                </div>
              </div>
              <p className="text-blue-800 font-bold text-lg">Emotions come in all shapes and colors!</p>
            </motion.div>
          </div>

          {/* Explanation Footer Card */}
          <motion.div 
            variants={cardVariants} 
            custom={4} 
            whileHover="hover"
            className="bg-gradient-to-r from-yellow-100/90 to-amber-100/90 backdrop-blur-md border-2 border-yellow-200 p-8 rounded-[2rem] shadow-lg flex items-start gap-6 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
               <Lightbulb size={200} />
            </div>
            <div className="bg-yellow-400 text-white p-3 rounded-full shrink-0 shadow-md">
              <Lightbulb size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">Let's Go!</h3>
              <p className="text-xl text-amber-900 font-medium leading-relaxed">
                "Just like colours make a beautiful painting, emotions make our lives interesting and meaningful. Today we will become Emotion Explorers and discover different feelings in a fun way!"
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {chapter === '1.2' && (
        <motion.div key="1.2" className="flex flex-col gap-8" initial="hidden" animate="visible" exit="exit">
          
          {/* Header Card */}
          <motion.div 
            variants={cardVariants} 
            custom={0} 
            whileHover="hover"
            className="bg-white/90 backdrop-blur-xl border-4 border-white p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -180 }} 
              animate={{ scale: 1, rotate: 0 }} 
              transition={{ type: 'spring' as const, stiffness: 200, damping: 20, delay: 0.2 }}
              className="bg-purple-500 p-4 rounded-3xl text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] z-10"
            >
              <Video size={56} strokeWidth={2.5} />
            </motion.div>
            <div className="z-10">
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-purple-600 font-bold text-lg uppercase tracking-widest mb-1"
              >
                Emotion Explorers
              </motion.p>
              <motion.h1 
                variants={titleContainerVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl md:text-5xl font-extrabold font-nunito text-gray-800 drop-shadow-sm flex flex-wrap gap-x-3"
              >
                {["Chapter", "1.2", "|", "Watch", "&", "Learn"].map((word, i) => (
                  <motion.span key={i} variants={titleWordVariants} className={word === "|" ? "text-gray-300 font-light" : ""}>
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
            </div>
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-purple-100/60 rounded-full blur-3xl pointer-events-none"></div>
          </motion.div>

          {/* Video Section */}
          <motion.div 
            variants={cardVariants} 
            custom={1}
            className="flex flex-col gap-8 items-center w-full"
          >
            <div className="w-full max-w-[800px] bg-sky-50/90 backdrop-blur-md border-[6px] border-sky-200 p-8 rounded-[3rem] shadow-xl flex flex-col gap-6">
              <h3 className="text-3xl font-extrabold text-sky-800 flex items-center gap-3"><Play size={32} strokeWidth={3}/> Guess the Emotions</h3>
              <div className="rounded-[2rem] overflow-hidden shadow-inner aspect-video border-[8px] border-white bg-black w-full relative">
                 <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/1mmyg_MpMWI" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </div>
            
            <div className="w-full max-w-[800px] bg-pink-50/90 backdrop-blur-md border-[6px] border-pink-200 p-8 rounded-[3rem] shadow-xl flex flex-col gap-6">
              <h3 className="text-3xl font-extrabold text-pink-800 flex items-center gap-3"><Play size={32} strokeWidth={3}/> Inside Out Challenge</h3>
              <div className="rounded-[2rem] overflow-hidden shadow-inner aspect-video border-[8px] border-white bg-black w-full relative">
                 <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/nTII0cyUbQo" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </div>
          </motion.div>

          {/* Discussion Card */}
          <motion.div 
            variants={cardVariants} 
            custom={2} 
            whileHover="hover"
            className="bg-yellow-50/90 backdrop-blur-md border-4 border-yellow-200 p-8 rounded-[2rem] shadow-lg relative overflow-hidden"
          >
             <div className="flex items-center gap-3 text-yellow-600 mb-6">
               <MessageCircleHeart size={36} />
               <h3 className="text-3xl font-bold text-yellow-700">Discussion Time!</h3>
             </div>
             <p className="text-xl text-gray-700 mb-6 font-medium">After watching the video, think about these questions and share your personal experiences:</p>
             
             <div className="flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl border-2 border-yellow-100 shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-transform">
                   <div className="bg-yellow-200 text-yellow-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">1</div>
                   <p className="text-xl text-gray-800 font-bold">What emotions did you see in the video?</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border-2 border-yellow-100 shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-transform">
                   <div className="bg-green-200 text-green-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">2</div>
                   <p className="text-xl text-gray-800 font-bold">When do you usually feel happy?</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border-2 border-yellow-100 shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-transform">
                   <div className="bg-red-200 text-red-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">3</div>
                   <p className="text-xl text-gray-800 font-bold">What can we do when we feel angry or sad?</p>
                </div>
             </div>
          </motion.div>

<MoodMirror />

          {/* Concept Takeaway */}
          <motion.div 
            variants={cardVariants} 
            custom={4} 
            whileHover="hover"
            className="bg-green-50/90 backdrop-blur-md border-4 border-green-200 p-8 rounded-[2rem] shadow-lg flex items-start gap-6 relative overflow-hidden"
          >
            <div className="bg-green-400 text-white p-4 rounded-full shrink-0 shadow-md">
              <Lightbulb size={40} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Remember...</h3>
              <p className="text-2xl text-green-900 font-extrabold leading-relaxed">
                "Emotions are signals that help us understand how we feel and how others feel."
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {chapter === '1.3' && (
        <motion.div key="1.3" initial="hidden" animate="visible" exit="exit" variants={cardVariants} custom={0}>
          <div className="bg-white/80 backdrop-blur-xl border-4 border-white p-4 rounded-[2rem] shadow-xl">
            <ChapterThree />
          </div>
        </motion.div>
      )}

      {/* Mocks for other chapters matching the pattern requested */}
      {chapter.startsWith('1') && !['1.1', '1.2', '1.3'].includes(chapter) && (
        <motion.div key={chapter} initial="hidden" animate="visible" exit="exit" variants={cardVariants} custom={0} className="flex flex-col gap-6">
          <div className="bg-white/80 backdrop-blur-xl border-4 border-white p-12 rounded-[2rem] shadow-xl text-center">
            <h2 className="text-4xl font-extrabold text-blue-800 mb-4">Chapter {chapter}</h2>
            <p className="text-xl text-gray-600 mb-8">Continuing the Module 1 Journey.</p>
            <div className="h-64 bg-blue-50 rounded-3xl border-2 border-dashed border-blue-200 flex items-center justify-center">
               <p className="text-blue-400 font-bold text-lg">Module 1 Content Placeholder</p>
            </div>
          </div>
        </motion.div>
      )}

      {chapter === '2.1' && (<motion.div key="2.1" initial="hidden" animate="visible" exit="exit" variants={cardVariants} custom={0}><ChapterTwoOne /></motion.div>)}
      {chapter === '2.2' && (<motion.div key="2.2" initial="hidden" animate="visible" exit="exit" variants={cardVariants} custom={0}><ChapterTwoTwo /></motion.div>)}
      {chapter === '2.3' && (<motion.div key="2.3" initial="hidden" animate="visible" exit="exit" variants={cardVariants} custom={0}><ChapterTwoThree /></motion.div>)}

      {chapter.startsWith('2') && !['2.1', '2.2', '2.3'].includes(chapter) && (
        <motion.div key={chapter} initial="hidden" animate="visible" exit="exit" variants={cardVariants} custom={0} className="flex flex-col gap-6">
          <div className="bg-white/80 backdrop-blur-xl border-4 border-white p-12 rounded-[2rem] shadow-xl text-center">
            <h2 className="text-4xl font-extrabold text-purple-800 mb-4">Module 2: Chapter {chapter}</h2>
            <p className="text-xl text-gray-600 mb-8">Diving deeper into advanced emotions.</p>
            <div className="h-64 bg-purple-50 rounded-3xl border-2 border-dashed border-purple-200 flex items-center justify-center">
               <p className="text-purple-400 font-bold text-lg">Module 2 Content Placeholder</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="relative w-full h-screen bg-sky-50 overflow-hidden font-quicksand">
        <FullscreenButton />
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas shadows gl={{ antialias: true, toneMapping: 3 }}>
            <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={50} />
            <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
            
            <Suspense fallback={null}>
              <Scene3D />
              <EffectComposer>
                <Bloom intensity={0.3} luminanceThreshold={0.7} luminanceSmoothing={0.4} mipmapBlur />
                <Vignette eskil={false} offset={0.25} darkness={0.4} />
              </EffectComposer>
            </Suspense>
          </Canvas>
        </div>

        {/* Foreground UI - Scrollable Overlay */}
        <div 
          className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden pointer-events-none scroll-smooth" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="w-full max-w-4xl mx-auto my-12 md:my-24 px-4 md:px-8 flex flex-col gap-8 pointer-events-auto pb-32">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Navigate to="/1.1" replace />} />
                  <Route path="/:chapterId" element={<ChapterContent />} />
                </Routes>
              </ErrorBoundary>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;










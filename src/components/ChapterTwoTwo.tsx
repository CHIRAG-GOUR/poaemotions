import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Presentation, MessageSquare, Star, Gift, UserCheck, ShieldCheck, HeartHandshake } from 'lucide-react';
import FacialStoryUnlock from './FacialStoryUnlock';

const ChapterTwoTwo = () => {
    const [points, setPoints] = useState(0);
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

    const peerQuestions = [
        { id: 1, q: "Why did your character feel sad?" },
        { id: 2, q: "What helped the character feel better?" },
        { id: 3, q: "Have you ever felt the same way?" }
    ];

    const addPoint = (id: number) => {
        if (activeQuestion === id) return;
        setActiveQuestion(id);
        setPoints(p => p + 1);
        setTimeout(() => setActiveQuestion(null), 1500);
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-12 animate-fade-in relative pb-32">
            
            <div className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden text-white border-8 border-white/20">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -right-10 -top-10 opacity-20">
                    <Presentation size={250} />
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black font-comic mb-4 relative z-10 drop-shadow-lg">Chapter 2.2</h1>
                <h2 className="text-3xl font-bold bg-white/20 inline-block px-8 py-2 rounded-full backdrop-blur-sm shadow-inner">Story Time & Presentation</h2>
            </div>

            {/* Part 1: Facial Story Unlocks */}
            <div>
                <FacialStoryUnlock />
            </div>

            {/* Part 2: Presentation & Discussion */}
            <div className="grid md:grid-cols-2 gap-8 mt-12 bg-white/40 p-8 rounded-[3rem] border-4 border-white shadow-lg backdrop-blur-md">
                {/* Presentation Guide */}
                <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border-4 border-white">
                    <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
                        <UserCheck size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 mb-6">Present Your Emotion Story or Role Play!</h3>
                    <p className="text-gray-600 font-medium mb-6 text-lg">In your group, take turns explaining to the class:</p>
                    
                    <ul className="space-y-4">
                        {[
                            { icon: "🎭", text: "What emotion you showed" },
                            { icon: "🤔", text: "What situation caused that emotion" },
                            { icon: "🦸‍♂️", text: "How the character solved the problem" }
                        ].map((item, i) => (
                            <motion.li whileHover={{ x: 5 }} key={i} className="flex items-center gap-4 bg-indigo-50 p-4 rounded-2xl text-lg font-bold text-indigo-900 border border-indigo-100 shadow-sm cursor-default">
                                <span className="text-2xl bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-inner">{item.icon}</span> 
                                {item.text}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Peer Interaction & Points System */}
                <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col gap-6">
                    
                    <div className="bg-orange-50 p-8 rounded-3xl shadow-xl border-2 border-orange-200">
                        <div className="flex items-center gap-3 mb-6">
                            <MessageSquare className="text-orange-500" size={28} />
                            <h3 className="text-2xl font-black text-orange-900">Peer Interaction</h3>
                        </div>
                        <p className="text-orange-800 font-medium mb-4">Click to ask a question and earn a Brownie Point!</p>
                        
                        <div className="space-y-3">
                            {peerQuestions.map(q => (
                                <motion.button
                                    key={q.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => addPoint(q.id)}
                                    className={`w-full text-left p-4 rounded-2xl font-bold text-lg transition-all flex justify-between items-center ${activeQuestion === q.id ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-orange-100 shadow-sm border border-orange-100'}`}
                                >
                                    "{q.q}"
                                    {activeQuestion === q.id && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>✨</motion.span>}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-8 rounded-3xl shadow-xl border-4 border-yellow-300 relative overflow-hidden flex-1 flex flex-col justify-center">
                        <div className="absolute right-0 top-0 opacity-10">
                            <Star size={150} />
                        </div>
                        <h3 className="text-2xl font-black text-amber-800 mb-2">🌟 Bonus Brownie Points</h3>
                        <p className="text-amber-700 font-bold mb-6 bg-white/50 inline-block px-4 py-1 rounded-full">1 Thoughtful Question = 1 Point</p>
                        
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-yellow-400 rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-white shrink-0 relative">
                                <span className="text-3xl font-black text-white">{points}</span>
                                <span className="text-xs font-bold text-yellow-700">POINTS</span>
                                <AnimatePresence>
                                    {activeQuestion && (
                                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: -40, opacity: 1 }} exit={{ opacity: 0 }} className="absolute text-2xl font-black text-green-500 drop-shadow-md">
                                            +1
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            
                            <div className="flex-1">
                                {points >= 5 ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white p-4 rounded-xl shadow-sm text-center border-2 border-green-400">
                                        <Gift className="text-green-500 mx-auto mb-2" size={32} />
                                        <span className="font-bold text-green-700">You earned a Reward Badge!</span>
                                    </motion.div>
                                ) : (
                                    <div className="bg-amber-200/50 p-4 rounded-xl shadow-inner font-semibold text-amber-900">
                                        Collect 5 points to receive a special Classroom Reward Badge!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>

            {/* Bottom Traits */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-emerald-500 text-white p-8 rounded-3xl shadow-xl mt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-emerald-400">
                <div className="text-xl font-bold flex gap-2 items-center"><ShieldCheck size={28} /> This activity encourages:</div>
                <div className="flex gap-4 flex-wrap justify-center">
                    <span className="bg-white/20 px-6 py-2 rounded-full font-black drop-shadow-sm">👂 Listening</span>
                    <span className="bg-white/20 px-6 py-2 rounded-full font-black drop-shadow-sm">🤔 Curiosity</span>
                    <span className="bg-white/20 px-6 py-2 rounded-full font-black drop-shadow-sm flex gap-2 items-center"><HeartHandshake size={20}/> Respectful Interaction</span>
                </div>
            </motion.div>

        </div>
    );
};

export default ChapterTwoTwo;
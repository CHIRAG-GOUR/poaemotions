import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, Star } from 'lucide-react';
interface Question {
    id: number;
    question: string;
    options: { label: string; text: string }[];
    correctAnswer: string;
    description: string;
}

const questions: Question[] = [
    {
        id: 1,
        question: "Your best friend is playing with someone else during recess and forgets to invite you. How might you feel?",
        options: [
            { label: "A", text: "Excited" },
            { label: "B", text: "Left out" },
            { label: "C", text: "Hungry" }
        ],
        correctAnswer: "B",
        description: "It's normal to feel left out when friends forget to include us."
    },
    {
        id: 2,
        question: "You studied hard for a test but did not get the marks you expected. What emotion might you feel?",
        options: [
            { label: "A", text: "Disappointed" },
            { label: "B", text: "Sleepy" },
            { label: "C", text: "Amused" }
        ],
        correctAnswer: "A",
        description: "Feeling disappointed shows that you care about your goals and efforts."
    },
    {
        id: 3,
        question: "Your classmate wins a competition that you also participated in. What could you feel?",
        options: [
            { label: "A", text: "Proud of them" },
            { label: "B", text: "Angry at everyone" },
            { label: "C", text: "Confused" }
        ],
        correctAnswer: "A",
        description: "Being proud of others' success is a sign of a great sport!"
    },
    {
        id: 4,
        question: "You are about to perform on stage in front of many people. How might you feel before starting?",
        options: [
            { label: "A", text: "Nervous" },
            { label: "B", text: "Bored" },
            { label: "C", text: "Hungry" }
        ],
        correctAnswer: "A",
        description: "Feeling nervous gives you the adrenaline you need to do your best!"
    },
    {
        id: 5,
        question: "Your teacher praises your group for working together very well. What emotion might your group feel?",
        options: [
            { label: "A", text: "Proud" },
            { label: "B", text: "Annoyed" },
            { label: "C", text: "Tired" }
        ],
        correctAnswer: "A",
        description: "Teamwork makes the dream work, and feeling proud is the reward!"
    },
    {
        id: 6,
        question: "Your friend looks quiet and does not talk during lunch. What might they be feeling?",
        options: [
            { label: "A", text: "Upset" },
            { label: "B", text: "Excited" },
            { label: "C", text: "Energetic" }
        ],
        correctAnswer: "A",
        description: "When someone is unusually quiet, they might be upset. It's nice to check on them."
    },
    {
        id: 7,
        question: "You tried something new, like learning to ride a bicycle, and finally succeeded. How might you feel?",
        options: [
            { label: "A", text: "Proud and excited" },
            { label: "B", text: "Sleepy" },
            { label: "C", text: "Angry" }
        ],
        correctAnswer: "A",
        description: "Overcoming a challenge brings a great rush of pride and excitement!"
    },
    {
        id: 8,
        question: "Someone accidentally bumps into you and says sorry. What could you feel?",
        options: [
            { label: "A", text: "Understanding" },
            { label: "B", text: "Furious forever" },
            { label: "C", text: "Confused" }
        ],
        correctAnswer: "A",
        description: "Accidents happen. Being understanding helps everyone move on happily."
    },
    {
        id: 9,
        question: "You forgot to bring your homework and the teacher asks about it. What emotion might you feel?",
        options: [
            { label: "A", text: "Nervous" },
            { label: "B", text: "Joyful" },
            { label: "C", text: "Relaxed" }
        ],
        correctAnswer: "A",
        description: "Anxiety or nervousness is a natural response, but honesty is the best policy."
    },
    {
        id: 10,
        question: "Your friend shares their snack with you when you forgot yours. How might you feel?",
        options: [
            { label: "A", text: "Grateful" },
            { label: "B", text: "Angry" },
            { label: "C", text: "Bored" }
        ],
        correctAnswer: "A",
        description: "Sharing brings people together and spreads the feeling of gratitude."
    }
];

export default function ChapterThree() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isQuizComplete, setIsQuizComplete] = useState(false);
    const [browniePoints, setBrowniePoints] = useState(0);

    // Track total brownie points from localStorage
    useEffect(() => {
        const storedPoints = localStorage.getItem('totalBrowniePoints');
        if (storedPoints) {
            setBrowniePoints(parseInt(storedPoints, 10));
        }
    }, []);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;
        
        setSelectedAnswer(answer);
        
        const isCorrect = answer === questions[currentQuestion].correctAnswer;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            setShowExplanation(true);
        }, 500);
    };

    const handleNext = () => {
        setShowExplanation(false);
        setSelectedAnswer(null);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            // Quiz completed -> calculate points
            const newPoints = browniePoints + (score * 10);
            setBrowniePoints(newPoints);
            localStorage.setItem('totalBrowniePoints', newPoints.toString());
            setIsQuizComplete(true);
        }
    };

    const renderSimulation = (id: number) => {
        let imageUrl = '';
        switch(id) {
            case 1: imageUrl = 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=600&h=400'; break; // Sad
            case 2: imageUrl = 'https://images.unsplash.com/photo-1577880216142-8549e9488dad?auto=format&fit=crop&q=80&w=600&h=400'; break; // Disappointed
            case 3: imageUrl = 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=600&h=400'; break; // Trophy
            case 4: imageUrl = 'https://images.unsplash.com/photo-1478224722510-48246d849a6e?auto=format&fit=crop&q=80&w=600&h=400'; break; // Stage microphone
            case 5: imageUrl = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600&h=400'; break; // Teamwork high-fives
            case 6: imageUrl = 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=600&h=400'; break; // Quiet alone
            case 7: imageUrl = 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=600&h=400'; break; // Bicycle
            case 8: imageUrl = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=600&h=400'; break; // Friends playing
            case 9: imageUrl = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600&h=400'; break; // Student classroom
            case 10: imageUrl = 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=600&h=400'; break; // Sharing kids
            default: return null;
        }

        return (
            <div className="flex justify-center items-center w-full pt-4 pb-2">
                <div className="relative w-[320px] md:w-[400px] h-48 md:h-56 rounded-2xl overflow-hidden shadow-sm border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold z-0 animate-pulse text-sm">Loading visual...</div>
                    <img 
                        src={imageUrl} 
                        alt="Activity scenario" 
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        loading="lazy"
                        key={imageUrl}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="w-full animate-fade-in relative">
            <div className="w-full mx-auto px-2 py-4">
                
                <h2 className="text-4xl font-extrabold text-blue-900 mb-4 font-comic text-center drop-shadow-sm">Chapter 1.3 &ndash; Interactive Quiz</h2>
                <div className="bg-white/50 p-4 rounded-2xl border-2 border-white mb-4 shadow-sm">
                    <p className="text-center text-blue-800 font-bold text-base">"Today you will become Emotion Detectives and explore how people feel in different situations!"</p>
                </div>

                {!isQuizComplete ? (
                    <div className="space-y-8">
                        {/* Progress Indicator */}
                        <div className="flex justify-center gap-3 mb-6 flex-wrap">
                            {questions.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={"w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all duration-500 " + (idx === currentQuestion ? 'bg-blue-500 text-white scale-125 shadow-lg border-2 border-blue-200' : idx < currentQuestion ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-200')}
                                >
                                    {idx < currentQuestion ? <CheckCircle2 size={20} /> : idx + 1}
                                </div>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <div className="p-4 md:p-12 relative overflow-hidden bg-white/60 border-2 border-white/60 shadow-2xl rounded-3xl">
                                    
                                    {/* Experiential Simulation Section */}
                                    <div className="mb-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-4 border-2 border-white shadow-inner overflow-hidden relative">
                                        <div className="absolute top-2 left-4 text-blue-200 font-black text-4xl opacity-50 z-0">?</div>
                                        {renderSimulation(questions[currentQuestion].id)}
                                    </div>

                                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 leading-relaxed">
                                        <span className="text-blue-600 mr-3 text-4xl">{questions[currentQuestion].id}.</span>
                                        {questions[currentQuestion].question}
                                    </h3>

                                    <div className="space-y-4">
                                        {questions[currentQuestion].options.map((option) => {
                                            const isSelected = selectedAnswer === option.label;
                                            const isCorrect = option.label === questions[currentQuestion].correctAnswer;
                                            const showStatus = selectedAnswer !== null;

                                            let buttonClasses = "w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-6 font-bold text-base ";
                                            
                                            if (!showStatus) {
                                                buttonClasses += "border-white/80 bg-white/50 hover:bg-blue-50 hover:border-blue-300 hover:scale-[1.02] text-gray-700 shadow-sm";
                                            } else if (isCorrect) {
                                                buttonClasses += "border-green-400 bg-green-50 text-green-800 scale-[1.02] shadow-lg";
                                            } else if (isSelected) {
                                                buttonClasses += "border-red-400 bg-red-50 text-red-800 scale-[0.98]";
                                            } else {
                                                buttonClasses += "border-white/20 bg-white/10 text-gray-400 opacity-40";
                                            }

                                            return (
                                                <button
                                                    key={option.label}
                                                    onClick={() => handleAnswer(option.label)}
                                                    disabled={selectedAnswer !== null}
                                                    className={buttonClasses}
                                                >
                                                    <div className={"w-14 h-14 rounded-full flex items-center justify-center text-lg font-black shrink-0 shadow-inner " + (showStatus && isCorrect ? 'bg-green-500 text-white' : showStatus && isSelected ? 'bg-red-500 text-white' : 'bg-white text-blue-600 shadow-sm border-2 border-gray-100')}>
                                                        {option.label}
                                                    </div>
                                                    <span className="flex-1">{option.text}</span>
                                                    
                                                    {showStatus && isCorrect && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                            <CheckCircle2 size={32} className="text-green-500" />
                                                        </motion.div>
                                                    )}
                                                    {showStatus && isSelected && !isCorrect && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                            <XCircle size={32} className="text-red-500" />
                                                        </motion.div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation Alert Modal */}
                                    <AnimatePresence>
                                        {showExplanation && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                                    className={"max-w-lg w-full p-8 rounded-3xl border-4 shadow-2xl " + (selectedAnswer === questions[currentQuestion].correctAnswer ? 'bg-green-100 border-green-400 text-green-900' : 'bg-orange-50 border-orange-400 text-orange-900')}
                                                >
                                                    <h4 className="font-black text-2xl mb-4 flex items-center justify-center gap-2 text-center">
                                                        {selectedAnswer === questions[currentQuestion].correctAnswer ? '✨ Brilliant Detective Work!' : '🔍 Interesting Observation!'}
                                                    </h4>
                                                    <p className="text-xl font-bold text-center mb-8">{questions[currentQuestion].description}</p>
                                                    
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={handleNext}
                                                        className={"w-full py-4 rounded-2xl font-black text-white shadow-xl text-xl flex justify-center items-center gap-2 " + (selectedAnswer === questions[currentQuestion].correctAnswer ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600')}
                                                    >
                                                        {currentQuestion < questions.length - 1 ? 'Next Scenario 🚀' : 'Finish Quiz 🌟'}
                                                    </motion.button>
                                                </motion.div>
                                            </div>
                                        )}
                                    </AnimatePresence>

                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="p-12 relative overflow-hidden bg-white/80 border-2 border-white shadow-2xl rounded-3xl">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="inline-block mb-6"
                            >
                                <Trophy size={120} className="text-yellow-500 drop-shadow-2xl" />
                            </motion.div>
                            
                            <h2 className="text-xl font-black text-gray-800 mb-6 font-comic">
                                Case Closed, Detective!
                            </h2>
                            <p className="text-xl text-gray-600 mb-10 font-bold">
                                You solved <span className="text-blue-600 text-xl mx-2 font-black">{score}</span> out of {questions.length} cases!
                            </p>

                            <motion.div
                                className="inline-flex flex-col items-center gap-3 bg-amber-100 text-amber-800 px-10 py-6 rounded-3xl border-2 border-amber-300 font-extrabold text-xl shadow-xl mb-4"
                                initial={{ scale: 0, y: 50 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                            >
                                <div className="flex items-center gap-3">
                                    <Star size={40} fill="#f59e0b" className="text-amber-500" />
                                    +{score * 10} Brownie Points!
                                </div>
                                <span className="text-base font-bold text-amber-600 bg-amber-200/50 px-4 py-2 rounded-xl mt-2">
                                    Total Vault: {browniePoints} 🍪
                                </span>
                            </motion.div>

                            <div className="flex justify-center gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setCurrentQuestion(0);
                                        setScore(0);
                                        setIsQuizComplete(false);
                                    }}
                                    className="px-10 py-5 bg-blue-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-600 transition-colors flex items-center gap-3"
                                >
                                    Play Again 🔄
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}

                
            </div>
        </div>
    );
}

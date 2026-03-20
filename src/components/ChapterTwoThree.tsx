import { motion } from 'framer-motion';
import EmotionPet from './EmotionPet';
import { Lightbulb, Heart, Eye, Users, Palette, Zap, CheckCircle } from 'lucide-react';

const ChapterTwoThree = () => {

    const skills = [
        { icon: Heart, name: "Emotional Intelligence", desc: "Recognising and understanding feelings.", color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
        { icon: Users, name: "Communication Skills", desc: "Expressing emotions clearly.", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
        { icon: Eye, name: "Observation Skills", desc: "Reading facial expressions and body language.", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
        { icon: Heart, name: "Empathy", desc: "Understanding how others feel.", color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-200" },
        { icon: Palette, name: "Creativity", desc: "Creating emotional stories and role plays.", color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
        { icon: Zap, name: "Teamwork", desc: "Working together to solve emotional situations.", color: "text-green-500", bg: "bg-green-50", border: "border-green-200" },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in relative pb-32">
            
            {/* Header */}
            <div className="text-center w-full mb-12 relative">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10 relative mb-[-3rem]">
                    <Lightbulb size={48} className="text-white drop-shadow-md" />
                </motion.div>
                <div className="bg-white/90 backdrop-blur-md pt-16 pb-12 px-8 rounded-[3rem] shadow-xl border-4 border-white mt-0">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-800 font-comic drop-shadow-sm mb-4">Chapter 2.3</h1>
                    <h2 className="text-2xl font-bold text-gray-500 uppercase tracking-widest">— Key Takeaways —</h2>
                </div>
            </div>

            {/* Main Message */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8 md:p-12 rounded-[3rem] shadow-2xl text-white text-center relative overflow-hidden border-8 border-white/20">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <p className="text-xl md:text-2xl font-semibold mb-6 opacity-90">
                    Understanding emotions helps us build better friendships and communicate better.
                </p>
                <div className="bg-white text-blue-900 p-6 md:p-8 rounded-3xl shadow-inner font-black text-2xl md:text-3xl leading-snug">
                    "When we understand our emotions and others' feelings, we become <span className="text-pink-500 underline decoration-4 underline-offset-4">kinder</span> and <span className="text-emerald-500 underline decoration-4 underline-offset-4">stronger</span> individuals."
                </div>
            </motion.div>

            {/* 3D Emotion Pet Integration */}
            <div className="mt-16">
                <EmotionPet />
            </div>

            {/* Skills Table / Grid */}
            <div className="mt-12">
                <h3 className="text-3xl font-black text-gray-800 text-center mb-8 drop-shadow-sm font-comic">What Students Learn 🧠</h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill, i) => {
                        const Icon = skill.icon;
                        return (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`${skill.bg} border-2 ${skill.border} p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-default group relative overflow-hidden`}
                            >
                                <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-150 transition-transform duration-500">
                                    <Icon size={120} />
                                </div>
                                <div className="flex flex-col h-full relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`bg-white p-3 rounded-2xl shadow-sm ${skill.color}`}>
                                            <Icon size={24} strokeWidth={3} />
                                        </div>
                                        <h4 className={`text-xl font-bold ${skill.color}`}>{skill.name}</h4>
                                    </div>
                                    <p className="text-gray-700 font-medium text-lg bg-white/50 p-4 rounded-xl shadow-inner flex-1 flex items-center">
                                        <CheckCircle size={16} className={`${skill.color} mr-2 shrink-0`} /> 
                                        {skill.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}

export default ChapterTwoThree;

const fs = require('fs');

const chapterContent = \
import { Link } from 'react-router-dom';
import { Camera, Smile, Gamepad2, Heart, BookOpen } from 'lucide-react';

export default function ChapterTwoOne() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg font-comic tracking-wider">
         AI Emotion Explorer
      </h1>
      
      <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl bg-black/20 p-6 rounded-3xl backdrop-blur-sm">
         Welcome camper! ??? Here are some fantastic activities to explore how your face magically controls the digital world.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Link to="/mood-mirror" className="bg-yellow-100 hover:bg-yellow-200 p-8 rounded-[2rem] border-4 border-yellow-400 shadow-xl transition-all hover:-translate-y-2 group text-left">
           <Camera size={48} className="text-yellow-600 mb-4 group-hover:scale-110 transition-transform" />
           <h2 className="text-2xl font-black text-yellow-900 mb-2">1. Mood Mirror</h2>
           <p className="text-yellow-800 font-medium">Test the camera and let the AI guess how you are feeling.</p>
        </Link>

        <Link to="/1.2" className="bg-pink-100 hover:bg-pink-200 p-8 rounded-[2rem] border-4 border-pink-400 shadow-xl transition-all hover:-translate-y-2 group text-left">
           <Gamepad2 size={48} className="text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
           <h2 className="text-2xl font-black text-pink-900 mb-2">2. Simon Says Feelings</h2>
           <p className="text-pink-800 font-medium">Race against the clock to match the emotion card!</p>
        </Link>

        <Link to="/1.3" className="bg-purple-100 hover:bg-purple-200 p-8 rounded-[2rem] border-4 border-purple-400 shadow-xl transition-all hover:-translate-y-2 group text-left">
           <Heart size={48} className="text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
           <h2 className="text-2xl font-black text-purple-900 mb-2">3. The Emotion Pet</h2>
           <p className="text-purple-800 font-medium">A magical 3D blob that changes shape when you smile or frown.</p>
        </Link>

        <Link to="/1.4" className="bg-blue-100 hover:bg-blue-200 p-8 rounded-[2rem] border-4 border-blue-400 shadow-xl transition-all hover:-translate-y-2 group text-left">
           <BookOpen size={48} className="text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
           <h2 className="text-2xl font-black text-blue-900 mb-2">4. Story Unlocks</h2>
           <p className="text-blue-800 font-medium">Show empathy to a sad character to finish reading the story.</p>
        </Link>
      </div>
    </div>
  );
}
\;

fs.writeFileSync('E:/1. Skillizee/POA Emotions/src/pages/ChapterTwoOne.tsx', chapterContent);

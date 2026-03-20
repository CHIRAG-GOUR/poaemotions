const fs = require('fs');

const appContent = fs.readFileSync('E:/1. Skillizee/POA Emotions/src/App.tsx', 'utf8');

const newAppContent = appContent
  .replace("import MoodMirror from './components/MoodMirror';", "import MoodMirror from './components/MoodMirror';\nimport SimonSaysFeelings from './components/SimonSaysFeelings';\nimport EmotionPet from './components/EmotionPet';\nimport StoryUnlock from './components/StoryUnlock';")
  .replace(
      "<Route path=\"/1.1\" element={<ChapterTwoOne />} />",
      \<Route path="/1.1" element={<ChapterTwoOne />} />\n                <Route path="/1.2" element={<SimonSaysFeelings />} />\n                <Route path="/1.3" element={<EmotionPet />} />\n                <Route path="/1.4" element={<StoryUnlock />} />\
  );

fs.writeFileSync('E:/1. Skillizee/POA Emotions/src/App.tsx', newAppContent);

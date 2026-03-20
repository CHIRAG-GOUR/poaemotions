const fs = require('fs');
const moodMirrorContent = fs.readFileSync('src/components/MoodMirror.tsx', 'utf8');
const updatedMoodMirror = moodMirrorContent.replace(
  "if (maxEmotion ; (expressions[maxEmotion as keyof faceapi.FaceExpressions] as number) > 0.5)",
  "if (maxEmotion && (expressions[maxEmotion as keyof faceapi.FaceExpressions] as number) > 0.5)"
);
fs.writeFileSync('src/components/MoodMirror.tsx', updatedMoodMirror);
console.log('Fixed typoing in MoodMirror');
const fs = require('fs');
let mm = fs.readFileSync('E:/1. Skillizee/POA Emotions/src/components/MoodMirror.tsx', 'utf8');

mm = mm.replace(
  "if (maxEmotion && expressions[maxEmotion as keyof faceapi.FaceExpressions] > 0.4) {",
  "if (maxEmotion && (expressions[maxEmotion as keyof faceapi.FaceExpressions] as unknown as number) > 0.4) {"
);

fs.writeFileSync('E:/1. Skillizee/POA Emotions/src/components/MoodMirror.tsx', mm);

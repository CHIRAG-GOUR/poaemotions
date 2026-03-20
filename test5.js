const fs = require('fs');
let code = fs.readFileSync('E:/1. Skillizee/POA Emotions/src/components/MoodMirror.tsx', 'utf8');

const target = "const expressions = detections.expressions;\n              const maxEmotion = Object.keys(expressions).reduce((a, b) => \n                expressions[a as keyof faceapi.FaceExpressions] > expressions[b as keyof faceapi.FaceExpressions] ? a : b\n              );\n\n              // Added confidence check (0.4) so it doesn't jump randomly on low confidence expressions\n              if (maxEmotion && expressions[maxEmotion as keyof faceapi.FaceExpressions] > 0.4) {";

const replacement = \const expressions = detections.expressions as unknown as Record<string, number>;
              const maxEmotion = Object.keys(expressions).reduce((a, b) => 
                expressions[a] > expressions[b] ? a : b
              );

              // Added confidence check (0.4) so it doesn't jump randomly on low confidence expressions
              if (maxEmotion && expressions[maxEmotion] > 0.4) {\;

code = code.replace(target, replacement);
fs.writeFileSync('E:/1. Skillizee/POA Emotions/src/components/MoodMirror.tsx', code);

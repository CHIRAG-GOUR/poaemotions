const fs = require('fs');
let code = fs.readFileSync('E:/1. Skillizee/POA Emotions/src/components/MoodMirror.tsx', 'utf8');

const targetRegex = /const expressions = detections\.expressions;[\s\S]*?> 0\.4\) {/g;

const replacement = \const expressions = detections.expressions as unknown as Record<string, number>;
              const maxEmotion = Object.keys(expressions).reduce((a, b) => 
                expressions[a] > expressions[b] ? a : b
              );

              // Added confidence check (0.4) so it doesn't jump randomly on low confidence expressions
              if (maxEmotion && expressions[maxEmotion] > 0.4) {\;

code = code.replace(targetRegex, replacement);
fs.writeFileSync('E:/1. Skillizee/POA Emotions/src/components/MoodMirror.tsx', code);

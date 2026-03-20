const fs = require('fs');
let code = fs.readFileSync('E:/1. Skillizee/POA Emotions/src/App.tsx', 'utf8');

const targetStr = "const chapter = chapterId || '1.1';";
const replacementStr = "const chapter = (chapterId ? chapterId.replace('chapter-', '') : '') || '1.1';";

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('E:/1. Skillizee/POA Emotions/src/App.tsx', code);

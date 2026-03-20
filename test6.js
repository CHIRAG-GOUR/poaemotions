const fs = require('fs');
let code = fs.readFileSync('E:/1. Skillizee/POA Emotions/src/App.tsx', 'utf8');

const target1 = \"{chapter === '2.1' && <ChapterTwoOne key=\\\"2.1\\" />}\";
const target2 = \"{chapter === '2.2' && <ChapterTwoTwo key=\\\"2.2\\" />}\";
const target3 = \"{chapter === '2.3' && <ChapterTwoThree key=\\\"2.3\\" />}\";

code = code.replace(target1, \{chapter === '2.1' && (<motion.div key="2.1" initial="hidden" animate="visible" exit="exit" variants={cardVariants} custom={0}><ChapterTwoOne /></motion.div>)}\);
code = code.replace(target2, \{chapter === '2.2' && (<motion.div key="2.2" initial="hidden" animate="visible" exit="exit" variants={cardVariants} custom={0}><ChapterTwoTwo /></motion.div>)}\);
code = code.replace(target3, \{chapter === '2.3' && (<motion.div key="2.3" initial="hidden" animate="visible" exit="exit" variants={cardVariants} custom={0}><ChapterTwoThree /></motion.div>)}\);

fs.writeFileSync('E:/1. Skillizee/POA Emotions/src/App.tsx', code);

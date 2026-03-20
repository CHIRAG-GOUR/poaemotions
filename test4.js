const fs = require('fs');
let code = fs.readFileSync('E:/1. Skillizee/POA Emotions/src/App.tsx', 'utf8');

code = code.replace("import FullscreenButton from './components/FullscreenButton';", "import FullscreenButton from './components/FullscreenButton';\nimport { ErrorBoundary } from './components/ErrorBoundary';");
code = code.replace("<Routes>", "<ErrorBoundary><Routes>");
code = code.replace("</Routes>", "</Routes></ErrorBoundary>");

fs.writeFileSync('E:/1. Skillizee/POA Emotions/src/App.tsx', code);

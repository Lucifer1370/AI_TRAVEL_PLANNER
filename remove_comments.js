const fs = require('fs');
const path = require('path');

const DIRS_TO_CHECK = [
    path.join(__dirname, 'backend'),
    path.join(__dirname, 'frontend', 'Ai-travel', 'src')
];

const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build'];

function stripComments(code) {
  return code.replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`|\/\*[\s\S]*?\*\/)|(\/\/.*)/g, (match, g1) => {
    if (g1 && !g1.startsWith('/*')) {
      return g1;
    }
    return '';
  });
}

function removeCommentsInFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const stripped = stripComments(content);
        if (content !== stripped) {
            fs.writeFileSync(filePath, stripped, 'utf8');
            console.log(`Cleaned comments from: ${filePath}`);
        }
    } catch (e) {
        console.error(`Error processing ${filePath}:`, e);
    }
}

function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        if (IGNORE_DIRS.includes(file)) continue;
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile() && /\.(js|jsx|css)$/i.test(fullPath)) {
            removeCommentsInFile(fullPath);
        }
    }
}

DIRS_TO_CHECK.forEach(dir => processDirectory(dir));
console.log('Done removing comments!');

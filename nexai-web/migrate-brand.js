import fs from 'fs';
import path from 'path';

const searchDirs = ['src', 'server', 'public'];
const rootFiles = ['index.html', 'package.json', 'package-lock.json', 'README.md', 'manifest.json']; // Note manifest is in public

function replaceInFile(filePath) {
  try {
    const ext = path.extname(filePath);
    if (!['.js', '.jsx', '.css', '.html', '.json', '.md'].includes(ext)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Ordered replacements
    content = content.replace(/NexAI/g, 'DiuMed');
    content = content.replace(/NEXAI/g, 'DIUMED');
    content = content.replace(/nexai/g, 'diumed');
    
    // Clean up old brand strings
    content = content.replace(/iQOO|Code Strikers|MEDNEXEUS|hackathon/gi, '');
    
    // Fix multiple spaces if replacements left empty gaps
    content = content.replace(/ +/g, ' ');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', 'dist', 'build', '.git', 'db'].includes(file)) {
        processDirectory(fullPath);
      }
    } else {
      replaceInFile(fullPath);
    }
  }
}

searchDirs.forEach(processDirectory);
rootFiles.forEach(f => {
  if (fs.existsSync(f)) replaceInFile(f);
});

console.log('Brand migration complete.');

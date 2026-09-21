const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const htmlPath = path.join(baseDir, 'index.html');
const cssPath = path.join(baseDir, 'styles.css');
const jsPath = path.join(baseDir, 'script.js');
const mediaDir = path.join(baseDir, 'assets', 'media');

console.log('--- Verifying Files ---');
[htmlPath, cssPath, jsPath].forEach(f => {
  if (fs.existsSync(f)) {
    console.log(`✓ File exists: ${path.basename(f)} (${fs.statSync(f).size} bytes)`);
  } else {
    console.error(`✗ Missing file: ${f}`);
  }
});

console.log('\n--- Verifying Assets Referenced in index.html ---');
const html = fs.readFileSync(htmlPath, 'utf8');
const srcRegex = /src="([^"]+)"/g;
let match;
let missing = 0;
while ((match = srcRegex.exec(html)) !== null) {
  const src = match[1];
  if (!src.startsWith('http')) {
    const fullPath = path.join(baseDir, src);
    if (fs.existsSync(fullPath)) {
      console.log(`✓ Asset found: ${src} (${fs.statSync(fullPath).size} bytes)`);
    } else {
      console.error(`✗ Missing asset: ${src}`);
      missing++;
    }
  }
}

if (missing === 0) {
  console.log('\nAll assets are present and accounted for!');
} else {
  console.error(`\nFound ${missing} missing assets.`);
}

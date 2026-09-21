const fs = require('fs');
const path = require('path');

const mediaDir = path.join(__dirname, 'assets', 'media');
const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.svg'));

files.forEach(f => {
  const content = fs.readFileSync(path.join(mediaDir, f), 'utf8');
  const fills = content.match(/fill="([^"]+)"/g) || [];
  const strokes = content.match(/stroke="([^"]+)"/g) || [];
  console.log(`${f}:`);
  console.log(`  fills:`, Array.from(new Set(fills)).slice(0, 5));
  console.log(`  strokes:`, Array.from(new Set(strokes)).slice(0, 5));
});

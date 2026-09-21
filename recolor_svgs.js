const fs = require('fs');
const path = require('path');

const mediaDir = path.join(__dirname, 'assets', 'media');
const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.svg'));

files.forEach(f => {
  const filePath = path.join(mediaDir, f);
  let content = fs.readFileSync(filePath, 'utf8');

  if (f === 'gift_box_qr.svg') {
    // Keep it light / cream or terracotta as needed
    // In canva: MAFIC4tUiCs {"#000000":"#f7e7cd"}
    content = content.replace(/#000000/gi, '#f7e7cd');
  } else {
    // Replace stock colors with the Canva site's terracotta #bd8562
    content = content
      .replace(/#262323/gi, '#bd8562')
      .replace(/#e89824/gi, '#bd8562')
      .replace(/#c08562/gi, '#bd8562');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Recolored ${f} to #bd8562`);
});

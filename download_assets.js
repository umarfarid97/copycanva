const fs = require('fs');
const path = require('path');
const https = require('https');

const baseUrl = 'https://giraffe-bp96lt.my.canva.site/filipino-traditional-wedding-website-ph-in-beige-brown-modern-filipiniana-style/';

const mediaMap = {
  "MAFO4tD0cVQ": {
    "type": "VECTOR",
    "url": "_assets/media/9dc2ae9bb19f95f89bb42aa1b39cf17e.svg",
    "filename": "foliage_left.svg"
  },
  "MAFbccNR35o": {
    "type": "VECTOR",
    "url": "_assets/media/3f87742319de2bf7b26a7b7bbb06b6f8.svg",
    "filename": "church_venue.svg"
  },
  "MAFO4puQUnE": {
    "type": "VECTOR",
    "url": "_assets/media/ec59b7a3449bbb0001747704012c21fd.svg",
    "filename": "foliage_branch.svg"
  },
  "MAEW75_l7ls": {
    "type": "VECTOR",
    "url": "_assets/media/f9099597db06b18bb74ea00b9f1e8328.svg",
    "filename": "floral_accent.svg"
  },
  "MAEW72JvJis": {
    "type": "VECTOR",
    "url": "_assets/media/acf5a2867c2c6256e7156841879dbb09.svg",
    "filename": "saya_dress.svg"
  },
  "MAGDN53V6yk": {
    "type": "RASTER",
    "url": "_assets/media/584dacf38cb0666cd8e465c847137c99.jpg",
    "filename": "couple_monogram_bg.jpg"
  },
  "MAFO4gOmYy0": {
    "type": "VECTOR",
    "url": "_assets/media/fdcfbc6ea4bc5fdaf9b48736bc1dfefe.svg",
    "filename": "floral_vertical.svg"
  },
  "MAGDNo2mDr8": {
    "type": "RASTER",
    "url": "_assets/media/9ce5024e13d429d4a7634729fac4e7d9.jpg",
    "filename": "couple_our_story.jpg"
  },
  "MAEW76LXscs": {
    "type": "VECTOR",
    "url": "_assets/media/01bffe0a8826b562208c89309d6b02ce.svg",
    "filename": "floral_corner_left.svg"
  },
  "MAEW71c10Kg": {
    "type": "VECTOR",
    "url": "_assets/media/4f299d1a484fd97fcba7b655b7b6aed9.svg",
    "filename": "barong_attire.svg"
  },
  "MAFIC4tUiCs": {
    "type": "VECTOR",
    "url": "_assets/media/502c58b11d0fcfc87e8710da322d056c.svg",
    "filename": "gift_box_qr.svg"
  },
  "MAEW77B9dpc": {
    "type": "VECTOR",
    "url": "_assets/media/ebbdeef3e330707028b586d4cabe4a0a.svg",
    "filename": "floral_corner_right.svg"
  },
  "MAGpcL43NyY": {
    "type": "RASTER",
    "url": "_assets/media/aafb682aed7984470ceff88698bbc9eb.jpg",
    "filename": "couple_alt_1.jpg"
  },
  "MAGpcD-guoE": {
    "type": "RASTER",
    "url": "_assets/media/3f3811d52a6b03039bf0ea507df2cba7.jpg",
    "filename": "couple_alt_2.jpg"
  }
};

const targetDir = path.join(__dirname, 'assets', 'media');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log(`Downloading ${Object.keys(mediaMap).length} assets to ${targetDir}...`);
  for (const [id, info] of Object.entries(mediaMap)) {
    const fileUrl = baseUrl + info.url;
    const destPath = path.join(targetDir, info.filename);
    try {
      await download(fileUrl, destPath);
      const stat = fs.statSync(destPath);
      console.log(`✓ Downloaded ${info.filename} (${stat.size} bytes)`);
    } catch (err) {
      console.error(`✗ Error downloading ${info.filename}:`, err.message);
    }
  }
  console.log('All downloads completed!');
}

run();

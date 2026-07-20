const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'Business Images');

async function convertImages() {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.webp' || ext === '.webp' || ext === '.webp' || ext === '.heic') {
      const inputPath = path.join(dir, file);
      const outputPath = path.join(dir, file.replace(ext, '.webp'));
      
      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        console.log(`Converted ${file} to WebP`);
        fs.unlinkSync(inputPath); // delete old file
      } catch (err) {
        console.error(`Error converting ${file}:`, err);
      }
    }
  }
}

convertImages();

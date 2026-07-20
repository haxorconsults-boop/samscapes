const sharp = require('sharp');
const path = require('path');

const input = path.join(__dirname, 'Business Images', 'samscapeslogo.jpeg');
const output = path.join(__dirname, 'Business Images', 'logo_transparent.webp');

// We want a pure white logo where the brightness of the original image dictates the opacity.
sharp(input)
  .greyscale()
  // increase contrast to remove dark grey artifacts from jpeg compression
  .linear(1.5, -50) 
  .toBuffer()
  .then(bwBuffer => {
      sharp(input)
        .metadata()
        .then(meta => {
            sharp({
                create: {
                    width: meta.width,
                    height: meta.height,
                    channels: 4,
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                }
            })
            .joinChannel(bwBuffer)
            .webp()
            .toFile(output)
            .then(() => console.log('Logo processed successfully.'))
            .catch(err => console.error('Error saving:', err));
        });
  })
  .catch(err => console.error('Error processing:', err));

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateFavicons() {
  const sizes = [16, 32, 48, 64, 128, 256];
  const inputSvg = path.join(__dirname, '../public/favicon.svg');
  
  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile(inputSvg);
    
    // Generate PNG favicons in different sizes
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(__dirname, `../public/favicon-${size}x${size}.png`));
    }
    
    // Generate ICO file (using 16x16 and 32x32)
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    
    console.log('Favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons(); 
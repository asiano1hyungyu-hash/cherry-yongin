import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Helper to create uncompressed/zlib PNG binary buffer
function createPngBuffer(width, height, r, g, b) {
  // CRC32 table & calculator
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);

    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal, 0);

    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  // 1. Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // 2. IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // 3. IDAT (raw uncompressed pixels with filter 0 at start of line)
  const rawData = Buffer.alloc(height * (1 + width * 3));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // filter type 0
    for (let x = 0; x < width; x++) {
      // Gentle gradient logic
      const ratio = (x + y) / (width + height);
      rawData[offset++] = Math.min(255, Math.floor(r * (0.8 + ratio * 0.4)));
      rawData[offset++] = Math.min(255, Math.floor(g * (0.8 + ratio * 0.4)));
      rawData[offset++] = Math.min(255, Math.floor(b * (0.8 + ratio * 0.4)));
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);

  // 4. IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate 64x64 favicon.png (Cherry Red/Pink background)
const faviconBuf = createPngBuffer(64, 64, 229, 56, 59);

// Generate 1200x630 og-image.png (Cherry Soft Gradient background)
const ogBuf = createPngBuffer(800, 420, 255, 107, 139);

// Ensure directories exist
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

fs.writeFileSync('./favicon.png', faviconBuf);
fs.writeFileSync('./public/favicon.png', faviconBuf);

fs.writeFileSync('./og-image.png', ogBuf);
fs.writeFileSync('./public/og-image.png', ogBuf);

console.log('Successfully generated favicon.png and og-image.png in root and public!');

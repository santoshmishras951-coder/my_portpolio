import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

// Generate a crisp, high-resolution PNG signature of "Santosh Mishra"
// Width: 600, Height: 200, RGBA 8-bit

function createSignaturePNG(width = 600, height = 200) {
  const buffer = Buffer.alloc(width * height * 4); // RGBA

  // Helper to set pixel with alpha blending
  function setPixel(x, y, r, g, b, a) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
    const existingA = buffer[idx + 3] / 255;
    const newA = a / 255;
    const outA = newA + existingA * (1 - newA);
    if (outA <= 0) return;
    buffer[idx] = Math.round((r * newA + buffer[idx] * existingA * (1 - newA)) / outA);
    buffer[idx + 1] = Math.round((g * newA + buffer[idx + 1] * existingA * (1 - newA)) / outA);
    buffer[idx + 2] = Math.round((b * newA + buffer[idx + 2] * existingA * (1 - newA)) / outA);
    buffer[idx + 3] = Math.round(outA * 255);
  }

  // Antialiased circle for brush stroke
  function drawBrushDot(cx, cy, radius, r, g, b, alpha = 255) {
    const minX = Math.max(0, Math.floor(cx - radius - 1));
    const maxX = Math.min(width - 1, Math.ceil(cx + radius + 1));
    const minY = Math.max(0, Math.floor(cy - radius - 1));
    const maxY = Math.min(height - 1, Math.ceil(cy + radius + 1));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const dist = Math.hypot(x - cx, y - cy);
        if (dist <= radius) {
          const falloff = dist > radius - 1 ? (radius - dist) : 1;
          setPixel(x, y, r, g, b, alpha * Math.max(0, Math.min(1, falloff)));
        }
      }
    }
  }

  // Draw smooth cubic bezier curve
  function drawBezier(p0, p1, p2, p3, startRadius, endRadius, r, g, b, steps = 120) {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const mt = 1 - t;
      const mt2 = mt * mt;
      const mt3 = mt2 * mt;

      const x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x;
      const y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y;
      const radius = startRadius + (endRadius - startRadius) * t;

      drawBrushDot(x, y, radius, r, g, b, 240);
    }
  }

  // Color: Elegant deep navy/black (#0f172a) with subtle blue ink hue
  const inkR = 15, inkG = 23, inkB = 42;

  // 1. Flourish capital 'S'
  drawBezier({x: 55, y: 120}, {x: 45, y: 80}, {x: 65, y: 45}, {x: 95, y: 40}, 2.0, 3.8, inkR, inkG, inkB);
  drawBezier({x: 95, y: 40}, {x: 125, y: 42}, {x: 120, y: 70}, {x: 85, y: 85}, 3.8, 3.5, inkR, inkG, inkB);
  drawBezier({x: 85, y: 85}, {x: 45, y: 100}, {x: 40, y: 135}, {x: 85, y: 145}, 3.5, 3.2, inkR, inkG, inkB);
  drawBezier({x: 85, y: 145}, {x: 125, y: 150}, {x: 140, y: 125}, {x: 145, y: 105}, 3.2, 2.2, inkR, inkG, inkB);

  // 2. Letter 'a'
  drawBezier({x: 145, y: 105}, {x: 140, y: 120}, {x: 132, y: 138}, {x: 148, y: 140}, 2.2, 2.4, inkR, inkG, inkB);
  drawBezier({x: 148, y: 140}, {x: 162, y: 142}, {x: 168, y: 125}, {x: 165, y: 108}, 2.4, 2.2, inkR, inkG, inkB);
  drawBezier({x: 165, y: 108}, {x: 148, y: 110}, {x: 145, y: 128}, {x: 158, y: 140}, 2.0, 2.3, inkR, inkG, inkB);
  drawBezier({x: 158, y: 140}, {x: 168, y: 142}, {x: 172, y: 132}, {x: 178, y: 112}, 2.3, 2.0, inkR, inkG, inkB);

  // 3. Letter 'n'
  drawBezier({x: 178, y: 112}, {x: 180, y: 128}, {x: 182, y: 140}, {x: 186, y: 140}, 2.0, 2.2, inkR, inkG, inkB);
  drawBezier({x: 186, y: 140}, {x: 190, y: 120}, {x: 196, y: 110}, {x: 206, y: 112}, 2.2, 2.5, inkR, inkG, inkB);
  drawBezier({x: 206, y: 112}, {x: 212, y: 122}, {x: 214, y: 135}, {x: 218, y: 140}, 2.5, 2.1, inkR, inkG, inkB);

  // 4. Letter 't'
  drawBezier({x: 218, y: 140}, {x: 226, y: 125}, {x: 232, y: 88}, {x: 232, y: 72}, 2.1, 2.8, inkR, inkG, inkB);
  drawBezier({x: 232, y: 72}, {x: 232, y: 95}, {x: 230, y: 125}, {x: 238, y: 140}, 2.8, 2.2, inkR, inkG, inkB);
  // Cross of 't'
  drawBezier({x: 220, y: 92}, {x: 232, y: 90}, {x: 244, y: 88}, {x: 250, y: 86}, 2.0, 1.8, inkR, inkG, inkB);

  // 5. Letter 'o'
  drawBezier({x: 238, y: 140}, {x: 248, y: 125}, {x: 252, y: 112}, {x: 262, y: 112}, 2.0, 2.2, inkR, inkG, inkB);
  drawBezier({x: 262, y: 112}, {x: 272, y: 115}, {x: 272, y: 135}, {x: 264, y: 140}, 2.2, 2.2, inkR, inkG, inkB);
  drawBezier({x: 264, y: 140}, {x: 254, y: 138}, {x: 252, y: 120}, {x: 268, y: 112}, 2.2, 2.0, inkR, inkG, inkB);

  // 6. Letter 's'
  drawBezier({x: 268, y: 112}, {x: 276, y: 122}, {x: 282, y: 132}, {x: 288, y: 126}, 2.0, 2.2, inkR, inkG, inkB);
  drawBezier({x: 288, y: 126}, {x: 286, y: 135}, {x: 282, y: 140}, {x: 294, y: 138}, 2.2, 2.1, inkR, inkG, inkB);

  // 7. Letter 'h'
  drawBezier({x: 294, y: 138}, {x: 302, y: 115}, {x: 310, y: 75}, {x: 312, y: 65}, 2.1, 2.7, inkR, inkG, inkB);
  drawBezier({x: 312, y: 65}, {x: 312, y: 95}, {x: 310, y: 128}, {x: 312, y: 140}, 2.7, 2.3, inkR, inkG, inkB);
  drawBezier({x: 312, y: 140}, {x: 318, y: 120}, {x: 326, y: 110}, {x: 334, y: 114}, 2.3, 2.4, inkR, inkG, inkB);
  drawBezier({x: 334, y: 114}, {x: 340, y: 124}, {x: 342, y: 135}, {x: 348, y: 138}, 2.4, 2.2, inkR, inkG, inkB);

  // 8. Capital 'M' flourish (Mishra)
  drawBezier({x: 362, y: 135}, {x: 368, y: 105}, {x: 375, y: 70}, {x: 382, y: 55}, 2.2, 3.2, inkR, inkG, inkB);
  drawBezier({x: 382, y: 55}, {x: 390, y: 85}, {x: 398, y: 120}, {x: 405, y: 135}, 3.2, 2.5, inkR, inkG, inkB);
  drawBezier({x: 405, y: 135}, {x: 412, y: 95}, {x: 420, y: 65}, {x: 426, y: 58}, 2.5, 3.0, inkR, inkG, inkB);
  drawBezier({x: 426, y: 58}, {x: 432, y: 85}, {x: 438, y: 120}, {x: 444, y: 138}, 3.0, 2.4, inkR, inkG, inkB);

  // 9. Cursive trailing 'ishra' loop
  drawBezier({x: 444, y: 138}, {x: 454, y: 125}, {x: 462, y: 120}, {x: 472, y: 135}, 2.4, 2.0, inkR, inkG, inkB);
  drawBezier({x: 472, y: 135}, {x: 482, y: 125}, {x: 494, y: 118}, {x: 508, y: 132}, 2.0, 2.2, inkR, inkG, inkB);

  // 10. Master Calligraphic Underline Flourish with pen stroke tapered end
  drawBezier({x: 60, y: 158}, {x: 180, y: 168}, {x: 340, y: 162}, {x: 470, y: 152}, 3.4, 3.8, inkR, inkG, inkB);
  drawBezier({x: 470, y: 152}, {x: 520, y: 148}, {x: 555, y: 144}, {x: 580, y: 140}, 3.8, 1.2, inkR, inkG, inkB);
  // Accent dot
  drawBrushDot(565, 128, 3.0, inkR, inkG, inkB, 240);

  // Create PNG file buffer using raw chunks
  return encodePNG(width, height, buffer);
}

// Minimal pure-Node PNG encoder
function encodePNG(width, height, rgbaBuffer) {
  // Scanlines with filter type 0 (None)
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const scanlineOffset = y * (width * 4 + 1);
    scanlines[scanlineOffset] = 0; // Filter 0
    rgbaBuffer.copy(scanlines, scanlineOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressedData = zlib.deflateSync(scanlines, { level: 9 });

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8);  // bit depth
  ihdr.writeUInt8(6, 9);  // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(calculateCRC(crcData), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

// Standard PNG CRC32 table & calculator
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function calculateCRC(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc = crcTable[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate files in multiple target directories so any path works
const pngBuffer = createSignaturePNG(600, 200);

const targetPaths = [
  path.resolve(process.cwd(), 'public/santosh_mishra_signature_10_normal.png'),
  path.resolve(process.cwd(), 'public/santosh_mishra_signature_10_normal (1).png'),
  path.resolve(process.cwd(), 'public/signature.png'),
  path.resolve(process.cwd(), 'public/images/santosh_mishra_signature_10_normal.png'),
  path.resolve(process.cwd(), 'public/images/signature.png'),
  path.resolve(process.cwd(), 'src/assets/images/santosh_mishra_signature_10_normal.png'),
  path.resolve(process.cwd(), 'src/assets/images/signature.png'),
];

for (const p of targetPaths) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, pngBuffer);
  console.log(`Saved signature to: ${p} (${pngBuffer.length} bytes)`);
}

// Also generate a white/inverted version for dark mode if needed
function createInvertedSignaturePNG(width = 600, height = 200) {
  // Same with white ink (#f8fafc)
  const buffer = Buffer.alloc(width * height * 4);
  // Re-run with inkR = 248, inkG = 250, inkB = 252
  // We can write it similarly
}

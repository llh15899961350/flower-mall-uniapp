const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// CRC32 implementation for PNG Chunk validation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return crc ^ 0xFFFFFFFF;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const content = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(content) >>> 0, 0);
  return Buffer.concat([len, content, crcBuf]);
}

// Generates a fully structure-compliant 32-bit RGBA PNG
function generatePNG(width, height, renderPixel) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // 8 bits per channel
  ihdr[9] = 6;  // Color type: RGBA (Red, Green, Blue, Alpha)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // No filter preprocessing
  ihdr[12] = 0; // No interlace

  const rowSize = 1 + width * 4;
  const pixels = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    pixels[y * rowSize] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const idx = y * rowSize + 1 + x * 4;
      const color = renderPixel(x, y); // Returns [r, g, b, a]
      pixels[idx] = color[0];
      pixels[idx + 1] = color[1];
      pixels[idx + 2] = color[2];
      pixels[idx + 3] = color[3];
    }
  }

  const idat = zlib.deflateSync(pixels);
  const sig = Buffer.from('\x89PNG\r\n\x1a\n', 'binary');
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idat);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// ---------------- Helper Math for Vector Drawing ----------------
const distanceToLineSegment = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.sqrt((px - (x1 + t * dx)) ** 2 + (py - (y1 + t * dy)) ** 2);
};

// Computes standard alpha-blended anti-aliased pixel boundaries
const smoothAntialias = (distance, strokeWidth) => {
  const halfW = strokeWidth / 2;
  const edge = 0.75; // smoothness transition width in pixels
  if (distance <= halfW - edge) return 1.0;
  if (distance >= halfW + edge) return 0.0;
  return 1.0 - (distance - (halfW - edge)) / (2 * edge);
};

// ---------------- Five Vector Renderers ----------------

// 1. HOME RENDERER (Clean outline house with central doorway)
const homeRenderer = (active) => (x, y) => {
  const col = active ? [0, 0, 0, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  const px = x + 0.5;
  const py = y + 0.5;

  const strokeWidth = 3.6;

  // Key coordinate nodes
  const roofPeak_x = 24, roofPeak_y = 7;
  const leftShoulder_x = 7, leftShoulder_y = 19;
  const rightShoulder_x = 41, rightShoulder_y = 19;
  const leftBottom_x = 7, leftBottom_y = 41;
  const rightBottom_x = 41, rightBottom_y = 41;

  // Doorway coordinate nodes
  const doorLeft_x = 18, doorLeft_y = 41;
  const doorRight_x = 30, doorRight_y = 41;
  const doorHeader_y = 29;

  // Math segments
  const segments = [
    // Roof Left
    [roofPeak_x, roofPeak_y, leftShoulder_x, leftShoulder_y],
    // Roof Right
    [roofPeak_x, roofPeak_y, rightShoulder_x, rightShoulder_y],
    // Left Wall
    [leftShoulder_x, leftShoulder_y, leftBottom_x, leftBottom_y],
    // Right Wall
    [rightShoulder_x, rightShoulder_y, rightBottom_x, rightBottom_y],
    // Ground base left side
    [leftBottom_x, leftBottom_y, doorLeft_x, doorLeft_y],
    // Ground base right side
    [doorRight_x, doorRight_y, rightBottom_x, rightBottom_y],
    // Doorway Left Pillar
    [doorLeft_x, doorLeft_y, doorLeft_x, doorHeader_y],
    // Doorway Right Pillar
    [doorRight_x, doorRight_y, doorRight_x, doorHeader_y],
    // Doorway Header
    [doorLeft_x, doorHeader_y, doorRight_x, doorHeader_y]
  ];

  let minDist = Infinity;
  for (const seg of segments) {
    const d = distanceToLineSegment(px, py, seg[0], seg[1], seg[2], seg[3]);
    if (d < minDist) minDist = d;
  }

  const alpha = smoothAntialias(minDist, strokeWidth);
  if (alpha <= 0) return bg;
  return [col[0], col[1], col[2], Math.round(col[3] * alpha)];
};

// 2. MENU RENDERER (Hamburger / Three Horizontal Rounded Lines)
const menuRenderer = (active) => (x, y) => {
  const col = active ? [0, 0, 0, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  const px = x + 0.5;
  const py = y + 0.5;

  const strokeWidth = 4.2;

  const segments = [
    [9, 13, 39, 13], // Top line
    [9, 24, 39, 24], // Middle line
    [9, 35, 39, 35]  // Bottom line
  ];

  let minDist = Infinity;
  for (const seg of segments) {
    const d = distanceToLineSegment(px, py, seg[0], seg[1], seg[2], seg[3]);
    if (d < minDist) minDist = d;
  }

  const alpha = smoothAntialias(minDist, strokeWidth);
  if (alpha <= 0) return bg;
  return [col[0], col[1], col[2], Math.round(col[3] * alpha)];
};

// 3. SHOPPING BAG RENDERER (Hollow tapered bag with elegant inner handle)
const bagRenderer = (active) => (x, y) => {
  const col = active ? [0, 0, 0, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  const px = x + 0.5;
  const py = y + 0.5;

  const strokeWidth = 3.6;

  // Bag shape segments
  // Tapered top folds
  const segments = [
    [15, 11, 33, 11], // top rim
    [15, 11, 8, 17],  // top left fold
    [33, 11, 40, 17], // top right fold
    [8, 17, 40, 17],  // top rim divider
    // Main base walls (exclusive of rounded bottom corners)
    [8, 17, 8, 38],   // left wall down to 38
    [40, 17, 40, 38], // right wall down to 38
    [11, 41, 37, 41]  // bottom horizontal floor
  ];

  let minDist = Infinity;
  for (const seg of segments) {
    const d = distanceToLineSegment(px, py, seg[0], seg[1], seg[2], seg[3]);
    if (d < minDist) minDist = d;
  }

  // Bottom-Left corner arc centered at (11, 38)
  if (px <= 11 && py >= 38) {
    const dArc = Math.abs(Math.sqrt((px - 11) ** 2 + (py - 38) ** 2) - 3.0);
    if (dArc < minDist) minDist = dArc;
  }
  // Bottom-Right corner arc centered at (37, 38)
  if (px >= 37 && py >= 38) {
    const dArc = Math.abs(Math.sqrt((px - 37) ** 2 + (py - 38) ** 2) - 3.0);
    if (dArc < minDist) minDist = dArc;
  }

  // Inner hanging handle: U-shaped semi-circle hanging down from y=17
  // Center of loop is (24, 18), radius is 7.5. Goes from x = 16.5 to 31.5
  if (py >= 17) {
    const dHandle = Math.abs(Math.sqrt((px - 24) ** 2 + (py - 18) ** 2) - 7.5);
    if (dHandle < minDist) minDist = dHandle;
  }

  const alpha = smoothAntialias(minDist, strokeWidth);
  if (alpha <= 0) return bg;
  return [col[0], col[1], col[2], Math.round(col[3] * alpha)];
};

// 4. STORE RENDERER (Shop front with wavy scalloped canopy/awning)
const storeRenderer = (active) => (x, y) => {
  const col = active ? [0, 0, 0, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  const px = x + 0.5;
  const py = y + 0.5;

  const strokeWidth = 3.6;

  // Let's draw the Store components:
  // Awning top and sloped slides:
  const awningSegments = [
    [14, 10, 34, 10], // top edge
    [14, 10, 8, 19],  // left slope
    [34, 10, 40, 19], // right slope
  ];

  // Store Base:
  const baseSegments = [
    [10, 21, 10, 41], // left support wall
    [38, 21, 38, 41], // right support wall
    [10, 41, 38, 41], // base ground floor
    // Doorway
    [19, 31, 19, 41], // doorway left
    [29, 31, 29, 41], // doorway right
    [19, 31, 29, 31]  // doorway header
  ];

  let minDist = Infinity;

  // Check simple awning slopes and top
  for (const seg of awningSegments) {
    const d = distanceToLineSegment(px, py, seg[0], seg[1], seg[2], seg[3]);
    if (d < minDist) minDist = d;
  }

  // Check store base and doorway
  for (const seg of baseSegments) {
    const d = distanceToLineSegment(px, py, seg[0], seg[1], seg[2], seg[3]);
    if (d < minDist) minDist = d;
  }

  // Scallops: 4 downward circular arcs at bottom of awning from x = 8 to 40
  // Awning bottom spans from 8 to 40 (width = 32 pixels).
  // 4 scallop segments: width = 8 pixels each.
  // Segment 1: x in [8, 16], center X1 = 12
  // Segment 2: x in [16, 24], center X2 = 20
  // Segment 3: x in [24, 32], center X3 = 28
  // Segment 4: x in [32, 40], center X4 = 36
  // Each scallop is a downward arc centered a bit higher up.
  // Say, center Y = 17.5, radius = 4.0. Bottom of arc is y = 21.5.
  if (px >= 8 && px <= 40 && py >= 15 && py <= 24) {
    const segmentIndex = Math.floor((px - 8) / 8);
    const centerX = 12 + segmentIndex * 8;
    const centerY = 17.5;
    const radius = 4.0;
    const dArc = Math.abs(Math.sqrt((px - centerX) ** 2 + (py - centerY) ** 2) - radius);
    if (dArc < minDist) minDist = dArc;
  }

  const alpha = smoothAntialias(minDist, strokeWidth);
  if (alpha <= 0) return bg;
  return [col[0], col[1], col[2], Math.round(col[3] * alpha)];
};

// 5. USER RENDERER (Classic minimalist circle head + shoulder arc)
const userRenderer = (active) => (x, y) => {
  const col = active ? [0, 0, 0, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  const px = x + 0.5;
  const py = y + 0.5;

  const strokeWidth = 3.6;

  // Head: centered at (24, 15), radius 7.5
  const headDist = Math.abs(Math.sqrt((px - 24) ** 2 + (py - 15) ** 2) - 7.5);

  // Shoulders arc: semi-circular sweep at bottom
  // Center is lower down, say (24, 46), radius is 18
  // Shoulder curves from x = 6 to 42, clamped vertically between 28 and 42
  let shoulderDist = Infinity;
  if (py >= 28 && py <= 42.5) {
    shoulderDist = Math.abs(Math.sqrt((px - 24) ** 2 + (py - 46) ** 2) - 18.0);
  }

  const minDist = Math.min(headDist, shoulderDist);

  const alpha = smoothAntialias(minDist, strokeWidth);
  if (alpha <= 0) return bg;
  return [col[0], col[1], col[2], Math.round(col[3] * alpha)];
};

// Ensure static assets directory exists
const targetDir = path.join(__dirname, 'src', 'static', 'tabbar');
fs.mkdirSync(targetDir, { recursive: true });

// Render the 10 custom designer items (Selected/Active in Black, Unselected in Soft Grey)
const renderTargets = [
  { name: 'home.png', renderer: homeRenderer(false) },
  { name: 'home-active.png', renderer: homeRenderer(true) },
  
  { name: 'menu.png', renderer: menuRenderer(false) },
  { name: 'menu-active.png', renderer: menuRenderer(true) },

  { name: 'bag.png', renderer: bagRenderer(false) },
  { name: 'bag-active.png', renderer: bagRenderer(true) },
  
  { name: 'store.png', renderer: storeRenderer(false) },
  { name: 'store-active.png', renderer: storeRenderer(true) },
  
  { name: 'user.png', renderer: userRenderer(false) },
  { name: 'user-active.png', renderer: userRenderer(true) }
];

console.log('Generating pixel-perfect, high-fidelity transparent PNG tab bar icons...');

renderTargets.forEach((item) => {
  const iconBuffer = generatePNG(48, 48, item.renderer);
  const outPath = path.join(targetDir, item.name);
  fs.writeFileSync(outPath, iconBuffer);
  console.log(`Saved successfully: ${item.name} -> ${outPath}`);
});

console.log('All 10 transparent, elegantly anti-aliased assets generated!');

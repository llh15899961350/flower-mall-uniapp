const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// CRC32 implementation for PNG chunks validation
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

// Generates a fully structure-compliant 32-bit RGBA PNG of width x height
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
const distanceToLine = (px, py, x1, y1, x2, y2) => {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

const distanceToCircle = (px, py, cx, cy, r) => {
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return Math.abs(dist - r);
};

// ---------------- Supersampled Rasterization Engine ----------------
// Performs 16x grid supersampling per subpixel to render gorgeous anti-aliased lines
const rasterizeVector = (active, getDistance) => (x, y) => {
  const col = active ? [0, 0, 0] : [153, 153, 153]; // iOS esteric pure luxury black and beautiful soft gray
  const thickness = active ? 1.05 : 0.85; // Active has a slightly more prominent presence
  
  let totalInside = 0;
  const samples = [0.125, 0.375, 0.625, 0.875];
  
  for (let sx = 0; sx < 4; sx++) {
    for (let sy = 0; sy < 4; sy++) {
      const px = x + samples[sx];
      const py = y + samples[sy];
      if (getDistance(px, py) <= thickness) {
        totalInside++;
      }
    }
  }
  
  if (totalInside === 0) {
    return [0, 0, 0, 0]; // Fully transparent
  }
  const alpha = Math.round((totalInside / 16) * 255);
  return [col[0], col[1], col[2], alpha];
};

// ---------------- 1. HOME RENDERER (首页 - House) ----------------
const homeRenderer = (active) => rasterizeVector(active, (px, py) => {
  const segments = [
    [12.0, 4.0, 4.5, 10.5],   // Left roof
    [12.0, 4.0, 19.5, 10.5],  // Right roof
    [4.5, 10.5, 4.5, 18.5],   // Left wall
    [19.5, 10.5, 19.5, 18.5],  // Right wall
    [4.5, 18.5, 9.0, 18.5],   // Floor Left
    [15.0, 18.5, 19.5, 18.5],  // Floor Right
    [9.0, 14.5, 9.0, 18.5],   // Door Left
    [15.0, 14.5, 15.0, 18.5],  // Door Right
    [9.0, 14.5, 15.0, 14.5]    // Door top boundary curve
  ];
  
  let minDist = 999;
  for (const seg of segments) {
    const d = distanceToLine(px, py, seg[0], seg[1], seg[2], seg[3]);
    if (d < minDist) minDist = d;
  }
  return minDist;
});

// ---------------- 2. MENU RENDERER (选购 - Rounded Triple Lines) ----------------
const menuRenderer = (active) => rasterizeVector(active, (px, py) => {
  const segments = [
    [5.0, 7.5, 19.0, 7.5],     // Line 1
    [5.0, 12.0, 19.0, 12.0],   // Line 2
    [5.0, 16.5, 19.0, 16.5]    // Line 3
  ];
  
  let minDist = 999;
  for (const seg of segments) {
    const d = distanceToLine(px, py, seg[0], seg[1], seg[2], seg[3]);
    if (d < minDist) minDist = d;
  }
  return minDist;
});

// ---------------- 3. STORE RENDERER (门店 - French Boutique) ----------------
const storeRenderer = (active) => rasterizeVector(active, (px, py) => {
  const segments = [
    [6.0, 5.5, 18.0, 5.5],     // Roof base horizontal
    [4.0, 9.0, 6.0, 5.5],      // Left roof diagonal
    [20.0, 9.0, 18.0, 5.5],    // Right roof diagonal
    [4.0, 9.0, 20.0, 9.0],     // Roof bottom horizontal
    [8.0, 5.5, 8.0, 9.0],      // Division 1
    [12.0, 5.5, 12.0, 9.0],    // Division 2
    [16.0, 5.5, 16.0, 9.0],    // Division 3
    [5.5, 9.0, 5.5, 18.5],     // Left Wall
    [18.5, 9.0, 18.5, 18.5],   // Right Wall
    [5.5, 18.5, 18.5, 18.5],   // Floor line
    [10.0, 14.0, 10.0, 18.5],  // Inner door left
    [14.0, 14.0, 14.0, 18.5],  // Inner door right
    [10.0, 14.0, 14.0, 14.0]   // Inner door top
  ];
  
  let minDist = 999;
  for (const seg of segments) {
    const d = distanceToLine(px, py, seg[0], seg[1], seg[2], seg[3]);
    if (d < minDist) minDist = d;
  }
  return minDist;
});

// ---------------- 4. CART RENDERER (口袋袋子 - Premium Purse) ----------------
const cartRenderer = (active) => rasterizeVector(active, (px, py) => {
  const segments = [
    [8.5, 4.8, 8.5, 8.5],      // Handle straight left side
    [15.5, 4.8, 15.5, 8.5],    // Handle straight right side
    [8.5, 4.8, 10.0, 3.6],     // Top curve left
    [10.0, 3.6, 14.0, 3.6],    // Top horizontal cap
    [14.0, 3.6, 15.5, 4.8],    // Top curve right
    
    [5.0, 8.5, 19.0, 8.5],     // Bag top cover outline
    [5.0, 8.5, 5.0, 16.5],     // Bag left vertical
    [19.0, 8.5, 19.0, 16.5],    // Bag right vertical
    [5.0, 16.5, 7.5, 19.0],    // Bottom corner left rounded
    [19.0, 16.5, 16.5, 19.0],   // Bottom corner right rounded
    [7.5, 19.0, 16.5, 19.0],    // Bottom floor horizontal
    
    [8.5, 11.5, 8.5, 13.0],    // U-pocket left vertical
    [15.5, 11.5, 15.5, 13.0],   // U-pocket right vertical
    [8.5, 13.0, 10.5, 14.8],   // U-pocket curve bottom left
    [10.5, 14.8, 13.5, 14.8],  // U-pocket curve bottom flat
    [13.5, 14.8, 15.5, 13.0]   // U-pocket curve bottom right
  ];
  
  let minDist = 999;
  for (const seg of segments) {
    const d = distanceToLine(px, py, seg[0], seg[1], seg[2], seg[3]);
    if (d < minDist) minDist = d;
  }
  return minDist;
});

// ---------------- 5. USER RENDERER (我的 - Outline Profile) ----------------
const userRenderer = (active) => rasterizeVector(active, (px, py) => {
  // 1. Distance to Head Circle Center at (12.0, 7.5) with radius 3.3
  const dHead = distanceToCircle(px, py, 12.0, 7.5, 3.3);
  
  // 2. Distance to elegant Shoulder curves
  const shoulderSegments = [
    [4.5, 18.5, 6.5, 16.2],
    [6.5, 16.2, 9.0, 14.6],
    [9.0, 14.6, 15.0, 14.6],
    [15.0, 14.6, 17.5, 16.2],
    [17.5, 16.2, 19.5, 18.5]
  ];
  
  let minDist = dHead;
  for (const seg of shoulderSegments) {
    const d = distanceToLine(px, py, seg[0], seg[1], seg[2], seg[3]);
    if (d < minDist) minDist = d;
  }
  return minDist;
});

// Ensure targeted directories are created safely
const targetDirs = [
  path.join(__dirname, 'src', 'static', 'tabbar'),
  path.join(__dirname, 'src', 'static', 'tabber')
];

targetDirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

// Render the 10 required items (selected + normal of 5 tabs)
const renderTargets = [
  { name: 'home.png', renderer: homeRenderer(false) },
  { name: 'home-active.png', renderer: homeRenderer(true) },
  { name: 'menu.png', renderer: menuRenderer(false) },
  { name: 'menu-active.png', renderer: menuRenderer(true) },
  { name: 'store.png', renderer: storeRenderer(false) },
  { name: 'store-active.png', renderer: storeRenderer(true) },
  { name: 'cart.png', renderer: cartRenderer(false) },
  { name: 'cart-active.png', renderer: cartRenderer(true) },
  { name: 'user.png', renderer: userRenderer(false) },
  { name: 'user-active.png', renderer: userRenderer(true) }
];

console.log('Generating high-fidelity 24px * 24px transparent PNG tab icons...');

renderTargets.forEach((item) => {
  const iconBuffer = generatePNG(24, 24, item.renderer);
  targetDirs.forEach(dir => {
    const outPath = path.join(dir, item.name);
    fs.writeFileSync(outPath, iconBuffer);
    console.log(`Saved: [24px] ${item.name} -> ${outPath}`);
  });
});

console.log('Successfully completed the generation of all 10 high-fidelity PNG icons!');

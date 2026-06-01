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
  return Math.sqrt(dx * dx + dx * dy); // Approximate distance
};

const distanceToCircle = (px, py, cx, cy, r) => {
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return Math.abs(dist - r);
};

// ---------------- Drawing Functions ----------------
const homeRenderer = (active) => (x, y) => {
  const col = active ? [17, 17, 17, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  // Draw house roof (triangle) and body
  // Triangle boundary: y >= roofLine(x) and y <= 22
  const inRoof = y >= 11 && y <= 24 && Math.abs(x - 24) <= (y - 11) * 1.0;
  // Body boundary: x inside [14, 34], y inside [24, 38]
  const inBody = x >= 14 && x <= 34 && y >= 24 && y <= 38;

  if (active) {
    if (inRoof || inBody) {
      // Exclude doorway from filled body
      const inDoor = x >= 21 && x <= 27 && y >= 30 && y <= 38;
      if (inDoor) return bg;
      return col;
    }
  } else {
    // Outlines
    // Roof lines outline
    const onRoofLeft = distanceToLine(x, y, 24, 11, 10, 24) < 1.4;
    const onRoofRight = distanceToLine(x, y, 24, 11, 38, 24) < 1.4;
    // Body walls outlines
    const onWallLeft = x >= 13.5 && x <= 15.5 && y >= 24 && y <= 38;
    const onWallRight = x >= 32.5 && x <= 34.5 && y >= 24 && y <= 38;
    const onFloor = x >= 14 && x <= 34 && y >= 36.5 && y <= 38.5;

    if (onRoofLeft || onRoofRight || onWallLeft || onWallRight || onFloor) {
      return col;
    }
  }
  return bg;
};

const menuRenderer = (active) => (x, y) => {
  const col = active ? [17, 17, 17, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  // 4 blocks in 48x48 grid
  // Borders at top-left: [11-21, 11-21]
  // Top-right: [27-37, 11-21]
  // Bottom-left: [11-21, 27-37]
  // Bottom-right: [27-37, 27-37]
  const blocks = [
    { x1: 11, x2: 21, y1: 11, y2: 21 },
    { x1: 27, x2: 37, y1: 11, y2: 21 },
    { x1: 11, x2: 21, y1: 27, y2: 37 },
    { x1: 27, x2: 37, y1: 27, y2: 37 }
  ];

  for (const b of blocks) {
    const isInside = x >= b.x1 && x <= b.x2 && y >= b.y1 && y <= b.y2;
    if (isInside) {
      if (active) return col;
      // Outline only
      const isOutline = x <= b.x1 + 1.2 || x >= b.x2 - 1.2 || y <= b.y1 + 1.2 || y >= b.y2 - 1.2;
      if (isOutline) return col;
    }
  }

  return bg;
};

const storeRenderer = (active) => (x, y) => {
  const col = active ? [17, 17, 17, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  // Store layout:
  // Eaves/Roof at y=13 to 20
  // Store base rect: [13, 35] by [20, 37]
  const shopRoof = y >= 13 && y <= 20 && x >= 12 && x <= 36;
  const shopBase = x >= 14 && x <= 34 && y >= 20 && y <= 37;

  if (active) {
    if (shopRoof || shopBase) {
      const inWindow = x >= 21 && x <= 27 && y >= 25 && y <= 31;
      const inDoor = x >= 17 && x <= 20 && y >= 29 && y <= 37;
      if (inWindow || inDoor) return bg;
      return col;
    }
  } else {
    // Outline style
    const onRoofTop = y >= 13 && y <= 15 && x >= 12 && x <= 36;
    const onRoofLeft = distanceToLine(x, y, 12, 20, 16, 13) < 1.4;
    const onRoofRight = distanceToLine(x, y, 36, 20, 32, 13) < 1.4;
    const onWallLeft = x >= 13.5 && x <= 15.5 && y >= 20 && y <= 37;
    const onWallRight = x >= 32.5 && x <= 34.5 && y >= 20 && y <= 37;
    const onBaseFloor = x >= 14 && x <= 34 && y >= 35.5 && y <= 37.5;

    if (onRoofTop || onRoofLeft || onRoofRight || onWallLeft || onWallRight || onBaseFloor) {
      return col;
    }
  }
  return bg;
};

const userRenderer = (active) => (x, y) => {
  const col = active ? [17, 17, 17, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  // Head: center at (24, 16), r=7
  const headDist = Math.sqrt((x - 24) ** 2 + (y - 16) ** 2);
  const isHead = headDist <= 7.5;

  // Body: arch/ellipse centered lower down, cut at bottom
  // Formula: (x-24)^2 / 12^2 + (y-39)^2 / 9^2 <= 1 and y >= 27
  const bodyVal = ((x - 24) / 13) ** 2 + ((y - 36) / 8) ** 2;
  const isBody = bodyVal <= 1.0 && y >= 28 && y <= 39;

  if (active) {
    if (isHead || isBody) return col;
  } else {
    // Outline style
    const isHeadOutline = distanceToCircle(x, y, 24, 16, 7.5) < 1.2;
    // Approximate body outline with bounds
    const isBodyOutline = Math.abs(bodyVal - 1.0) < 0.15 && y >= 28 && y <= 39;
    const isBodyBottom = x >= 12 && x <= 36 && y >= 37.5 && y <= 39.5;

    if (isHeadOutline || isBodyOutline || isBodyBottom) {
      return col;
    }
  }

  return bg;
};

// Ensure direct folders are available
const targetDir = path.join(__dirname, 'src', 'static', 'tabbar');
fs.mkdirSync(targetDir, { recursive: true });

// Render the 8 required items
const renderTargets = [
  { name: 'home.png', renderer: homeRenderer(false) },
  { name: 'home-active.png', renderer: homeRenderer(true) },
  { name: 'menu.png', renderer: menuRenderer(false) },
  { name: 'menu-active.png', renderer: menuRenderer(true) },
  { name: 'store.png', renderer: storeRenderer(false) },
  { name: 'store-active.png', renderer: storeRenderer(true) },
  { name: 'user.png', renderer: userRenderer(false) },
  { name: 'user-active.png', renderer: userRenderer(true) }
];

console.log('Starting high-fidelity transparent PNG tab icon rendering...');

renderTargets.forEach((item) => {
  const iconBuffer = generatePNG(48, 48, item.renderer);
  const outPath = path.join(targetDir, item.name);
  fs.writeFileSync(outPath, iconBuffer);
  console.log(`Saved: ${item.name} -> ${outPath}`);
});

console.log('All 8 transparent aesthetic PNG icons generated successfully!');

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
  return Math.sqrt(dx * dx + dy * dy); // Correct distance formula
};

const distanceToCircle = (px, py, cx, cy, r) => {
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return Math.abs(dist - r);
};

// ---------------- 1. HOME RENDERER (首页) ----------------
const homeRenderer = (active) => (x, y) => {
  const col = active ? [17, 17, 17, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  // Roof triangle peak at (11.5, 4), base at y=11
  const inRoofFill = y >= 4 && y <= 11 && Math.abs(x - 11.5) <= (y - 4) * 1.0;
  // House Base wall limits
  const inBodyFill = x >= 5 && x <= 18 && y >= 11 && y <= 19;

  if (active) {
    if (inRoofFill || inBodyFill) {
      // Exclude doorway cutout
      const inDoor = x >= 10 && x <= 13 && y >= 14 && y <= 19;
      if (inDoor) return bg;
      return col;
    }
  } else {
    // Normal / Outlines
    const onRoofLeft = distanceToLine(x, y, 11.5, 4, 4.5, 11) < 1.0;
    const onRoofRight = distanceToLine(x, y, 11.5, 4, 18.5, 11) < 1.0;
    const onWallLeft = x >= 4.5 && x <= 5.5 && y >= 11 && y <= 19;
    const onWallRight = x >= 17.5 && x <= 18.5 && y >= 11 && y <= 19;
    const onFloor = x >= 5 && x <= 18 && y >= 18.5 && y <= 19.5;
    const onDoorLeft = x >= 9.5 && x <= 10.5 && y >= 14 && y <= 19;
    const onDoorRight = x >= 12.5 && x <= 13.5 && y >= 14 && y <= 19;
    const onDoorTop = y >= 13.5 && y <= 14.5 && x >= 10 && x <= 13;

    if (onRoofLeft || onRoofRight || onWallLeft || onWallRight || onFloor) {
      if (onFloor && x >= 11 && x <= 12) return bg; // Clear door threshold
      return col;
    }
    if (onDoorLeft || onDoorRight || onDoorTop) {
      return col;
    }
  }
  return bg;
};

// ---------------- 2. MENU RENDERER (选购 - Grid) ----------------
const menuRenderer = (active) => (x, y) => {
  const col = active ? [17, 17, 17, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  const blocks = [
    { x1: 5, x2: 10, y1: 5, y2: 10 },
    { x1: 13, x2: 18, y1: 5, y2: 10 },
    { x1: 5, x2: 10, y1: 13, y2: 18 },
    { x1: 13, x2: 18, y1: 13, y2: 18 }
  ];

  for (const b of blocks) {
    const isInside = x >= b.x1 && x <= b.x2 && y >= b.y1 && y <= b.y2;
    if (isInside) {
      if (active) return col;
      // Normal: border outlines
      const isOutline = x <= b.x1 + 0.8 || x >= b.x2 - 0.8 || y <= b.y1 + 0.8 || y >= b.y2 - 0.8;
      if (isOutline) return col;
    }
  }

  return bg;
};

// ---------------- 3. STORE RENDERER (门店) ----------------
const storeRenderer = (active) => (x, y) => {
  const col = active ? [17, 17, 17, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  // Store layout eave/roof and base wall
  const inRoof = y >= 6 && y <= 10 && x >= 3 && x <= 20;
  const inBase = x >= 5 && x <= 18 && y >= 10 && y <= 19;

  if (active) {
    if (inRoof || inBase) {
      // Cutouts
      const inWindow = x >= 12 && x <= 16 && y >= 12 && y <= 15;
      const inDoor = x >= 7 && x <= 10 && y >= 14 && y <= 19;
      if (inWindow || inDoor) return bg;
      return col;
    }
  } else {
    // normal / outlines
    const onRoofTop = y >= 6 && y <= 7.2 && x >= 3 && x <= 20;
    const onRoofLeft = distanceToLine(x, y, 3, 10, 5, 6) < 0.9;
    const onRoofRight = distanceToLine(x, y, 20, 10, 18, 6) < 0.9;
    const onWallLeft = x >= 4.5 && x <= 5.5 && y >= 10 && y <= 19;
    const onWallRight = x >= 17.5 && x <= 18.5 && y >= 10 && y <= 19;
    const onFloor = x >= 5 && x <= 18 && y >= 18.2 && y <= 19.5;
    const onWindow = (x >= 12 && x <= 16 && (y === 12 || y === 15)) || (y >= 12 && y <= 15 && (x === 12 || x === 16));
    const onDoor = (x >= 7 && x <= 10 && y === 14) || (y >= 14 && y <= 19 && (x === 7 || x === 10));

    if (onRoofTop || onRoofLeft || onRoofRight || onWallLeft || onWallRight || onFloor || onWindow || onDoor) {
      return col;
    }
  }
  return bg;
};

// ---------------- 4. CART RENDERER (袋中 - Shopping Bag) ----------------
const cartRenderer = (active) => (x, y) => {
  const col = active ? [17, 17, 17, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  // Bag body x in [5, 18], y in [9, 19]
  const inBag = x >= 5 && x <= 18 && y >= 9 && y <= 19;
  // Handle vertical anchors: left-leg is (8, 5..9), right-leg is (15, 5..9). Arc top at (8..15, 4)
  const isHandleLeft = x >= 7.5 && x <= 8.5 && y >= 5 && y <= 9;
  const isHandleRight = x >= 14.5 && x <= 15.5 && y >= 5 && y <= 9;
  const isHandleTop = y >= 3.5 && y <= 4.5 && x >= 8 && x <= 15;

  if (active) {
    if (inBag) {
      // Exclude a minimal visual inner circle or heart for beautiful beast style
      const insideIcon = Math.sqrt((x - 11.5) ** 2 + (y - 14) ** 2) < 2.0;
      if (insideIcon) return bg;
      return col;
    }
    if (isHandleLeft || isHandleRight || isHandleTop) {
      return col;
    }
  } else {
    // Normal / Outlines
    const onBagLeft = x >= 4.5 && x <= 5.5 && y >= 9 && y <= 19;
    const onBagRight = x >= 17.5 && x <= 18.5 && y >= 9 && y <= 19;
    const onBagTop = y >= 8.5 && y <= 9.5 && x >= 5 && x <= 18;
    const onBagBottom = y >= 18.5 && y <= 19.5 && x >= 5 && x <= 18;

    if (onBagLeft || onBagRight || onBagTop || onBagBottom || isHandleLeft || isHandleRight || isHandleTop) {
      return col;
    }
  }
  return bg;
};

// ---------------- 5. USER RENDERER (我的 - Profile) ----------------
const userRenderer = (active) => (x, y) => {
  const col = active ? [17, 17, 17, 255] : [153, 153, 153, 255];
  const bg = [0, 0, 0, 0];

  // Head center (11.5, 7.5), r=3.5
  const headDist = Math.sqrt((x - 11.5) ** 2 + (y - 7.5) ** 2);
  const isHead = headDist <= 3.8;

  // Shoulder ellipse boundary: ((x - 11.5) / 7) ^ 2 + ((y - 18) / 4) ^ 2 <= 1.0 with y >= 14
  const shoulderVal = ((x - 11.5) / 7) ** 2 + ((y - 18) / 4) ** 2;
  const isShoulders = shoulderVal <= 1.0 && y >= 14 && y <= 19;

  if (active) {
    if (isHead || isShoulders) {
      return col;
    }
  } else {
    // Normal / Outlines
    const onHeadOutline = distanceToCircle(x, y, 11.5, 7.5, 3.8) < 0.9;
    const onShoulderOutline = Math.abs(shoulderVal - 1.0) < 0.18 && y >= 14 && y <= 19;
    const onShoulderBottom = x >= 5 && x <= 18 && y >= 18.5 && y <= 19.5;

    if (onHeadOutline || onShoulderOutline || onShoulderBottom) {
      return col;
    }
  }

  return bg;
};

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

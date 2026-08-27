/**
 * Gera um spritesheet placeholder de coin (8 frames, 16x16 cada = 128x16 PNG).
 * Cada frame é um círculo amarelo simples, com variação de tamanho para simular animação.
 * 
 * Usa apenas APIs nativas do Node (zlib + Buffer) para criar PNG válido sem dependências.
 */
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const FRAME_W = 16;
const FRAME_H = 16;
const FRAMES = 8;
const WIDTH = FRAME_W * FRAMES; // 128
const HEIGHT = FRAME_H;         // 16

// Raios para cada frame (simula "pulse" de animação)
const radii = [5, 5.5, 6, 6.5, 7, 6.5, 6, 5.5];

// Cores
const YELLOW = [255, 215, 0, 255];   // corpo da moeda
const DARK_YELLOW = [204, 170, 0, 255]; // borda
const TRANSPARENT = [0, 0, 0, 0];

function createPixelData() {
  // RGBA raw data, cada linha precedida por filter byte (0)
  const rawData = Buffer.alloc((WIDTH * 4 + 1) * HEIGHT);
  
  for (let y = 0; y < HEIGHT; y++) {
    const rowOffset = y * (WIDTH * 4 + 1);
    rawData[rowOffset] = 0; // filter: None
    
    for (let x = 0; x < WIDTH; x++) {
      const frameIdx = Math.floor(x / FRAME_W);
      const localX = x % FRAME_W;
      const localY = y;
      
      const cx = FRAME_W / 2;
      const cy = FRAME_H / 2;
      const r = radii[frameIdx];
      
      const dist = Math.sqrt((localX - cx) ** 2 + (localY - cy) ** 2);
      
      let color;
      if (dist <= r - 1) {
        color = YELLOW;
      } else if (dist <= r) {
        color = DARK_YELLOW;
      } else {
        color = TRANSPARENT;
      }
      
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = color[0];
      rawData[pixelOffset + 1] = color[1];
      rawData[pixelOffset + 2] = color[2];
      rawData[pixelOffset + 3] = color[3];
    }
  }
  
  return rawData;
}

function createPNG(rawData) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(WIDTH, 0);
  ihdrData.writeUInt32BE(HEIGHT, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);
  
  // IDAT chunk
  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  
  // IEND chunk
  const iend = makeChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuffer, data]);
  
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput) >>> 0, 0);
  
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return crc ^ 0xFFFFFFFF;
}

const rawData = createPixelData();
const png = createPNG(rawData);
const outPath = path.join(__dirname, '..', 'public', 'assets', 'collectibles', 'coin.png');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, png);
console.log('coin.png criado em:', outPath, '(' + png.length + ' bytes)');

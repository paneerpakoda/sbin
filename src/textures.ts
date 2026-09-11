import { CanvasTexture, SRGBColorSpace } from 'three';

function texture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx);
  const result = new CanvasTexture(canvas);
  result.colorSpace = SRGBColorSpace;
  return result;
}

export function woodTexture() {
  let seed = 127;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  return texture(1024, 768, ctx => {
    ctx.fillStyle = '#b9834b'; ctx.fillRect(0, 0, 1024, 768);
    for (let i = 0; i < 1400; i++) {
      const y = random() * 768, x = random() * 1024;
      ctx.strokeStyle = `rgba(${random() > 0.45 ? '70,35,16' : '246,212,160'},${0.02 + random() * 0.10})`;
      ctx.lineWidth = random() * 2 + 0.3;
      ctx.beginPath(); ctx.moveTo(x - 100, y);
      ctx.bezierCurveTo(x + 30, y + random() * 8, x + 180, y - 7, x + 450, y + random() * 5);
      ctx.stroke();
    }
    for (const y of [253, 510]) {
      ctx.fillStyle = '#704c2d'; ctx.fillRect(0, y, 1024, 2);
      ctx.fillStyle = '#d0a376'; ctx.fillRect(0, y + 2, 1024, 1);
    }
    ctx.strokeStyle = '#694a3390'; ctx.lineWidth = 2;
    for (let i = 0; i < 30; i++) {
      const x = random() * 1024, y = random() * 768;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + random() * 55 - 20, y + random() * 12); ctx.stroke();
    }
    ctx.save(); ctx.translate(88, 118); ctx.rotate(-0.12);
    ctx.fillStyle = '#473e3890'; ctx.font = 'italic 25px Georgia'; ctx.fillText('9 B', 0, 0);
    ctx.font = '18px Georgia'; ctx.fillText('was here :)', 3, 23); ctx.restore();
    ctx.strokeStyle = '#253f5150'; ctx.lineWidth = 2;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath(); ctx.moveTo(847 + i * 21, 591); ctx.lineTo(847 + i * 21, 665); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(824, 613 + i * 22); ctx.lineTo(890, 613 + i * 22); ctx.stroke();
    }
    ctx.font = '25px Georgia'; ctx.fillStyle = '#253f5160'; ctx.fillText('×', 829, 613); ctx.fillText('o', 870, 659);
    for (const x of [22, 1002]) for (const y of [28, 738]) {
      ctx.fillStyle = '#493a2d'; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#b59f7a'; ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.lineTo(x + 3, y); ctx.stroke();
    }
  });
}

export function eraserTexture() {
  return texture(512, 320, ctx => {
    ctx.fillStyle = '#ebe4cc'; ctx.fillRect(0, 0, 512, 320);
    ctx.fillStyle = '#689898'; ctx.fillRect(382, 0, 130, 320);
    ctx.fillStyle = '#3e6467'; ctx.font = 'italic bold 85px Georgia'; ctx.fillText('sbin', 45, 137);
    ctx.font = 'bold 22px sans-serif'; ctx.fillText('SCHOOL ERASER', 43, 180);
    ctx.strokeStyle = '#3e6467'; ctx.lineWidth = 2; ctx.strokeRect(30, 40, 320, 222);
    ctx.font = '19px monospace'; ctx.fillText('NO. 01  •  KEEP SPINNING', 44, 231);
    ctx.fillStyle = '#a69d8850';
    for (let i = 0; i < 25; i++) ctx.fillRect((i * 139) % 512, (i * 83) % 320, 8 + i % 6, 2);
  });
}

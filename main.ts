// Tiny stack VM (make.fun tiny-stack-vm-01-run-20261122). Node stdlib only.
// /input/<id>/{program,input}.bin -> /output/<id>/{stdout.bin,exit.txt}.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
function run(p, inp) {
  const s = [], c = [], m = new Int32Array(256), o = new Uint8Array(65536);
  let ol = 0, ip = 0, pc = 0, n = 0;
  const end = (k) => [o.subarray(0, ol), k];
  for (;;) {
    if (n >= 1e6) return end(10);
    if (pc < 0 || pc >= p.length) return end(9);
    const op = p[pc];
    if (!(op <= 7 || (op >= 16 && op <= 34) || (op >= 48 && op <= 52) || op === 64 || op === 65 || (op >= 80 && op <= 83))) return end(5);
    const il = op === 1 ? 1 : op === 2 ? 4 : op >= 48 && op <= 51 ? 2 : 0;
    if (pc + 1 + il > p.length) return end(9);
    let v = 0;
    if (il === 1) v = p[pc + 1];
    else if (il === 2) v = p[pc + 1] | (p[pc + 2] << 8);
    else if (il === 4) v = p[pc + 1] | (p[pc + 2] << 8) | (p[pc + 3] << 16) | (p[pc + 4] << 24);
    if (op >= 48 && op <= 50 && v >= 32768) v -= 65536;
    let a = 0, b = 0;
    if (op === 1 || op === 2 || op === 82) b = 1;
    else if (op === 3 || op === 49 || op === 50 || op === 80 || op === 81 || op === 83) a = 1;
    else if (op === 4) { a = 1; b = 2; }
    else if (op === 5) { a = 2; b = 2; }
    else if (op === 6) { a = 2; b = 3; }
    else if (op === 7) { a = 3; b = 3; }
    else if (op === 64) { a = 1; b = 1; }
    else if (op === 65) a = 2;
    else if ((op >= 16 && op <= 22) || (op >= 24 && op <= 26) || (op >= 28 && op <= 30) || (op >= 32 && op <= 34)) { a = 2; b = 1; }
    else if (op === 23 || op === 27) { a = 1; b = 1; }
    if (s.length < a) return end(2);
    if (s.length - a + b > 256) return end(3);
    n++;
    const nx = pc + 1 + il;
    let x, y;
    switch (op) {
      case 0: return end(0);
      case 1: s.push(v < 128 ? v : v - 256); break;
      case 2: s.push(v); break;
      case 3: s.pop(); break;
      case 4: s.push(s[s.length - 1]); break;
      case 5: x = s[s.length - 1]; s[s.length - 1] = s[s.length - 2]; s[s.length - 2] = x; break;
      case 6: s.push(s[s.length - 2]); break;
      case 7: x = s[s.length - 3]; y = s[s.length - 2]; s[s.length - 3] = y; s[s.length - 2] = s[s.length - 1]; s[s.length - 1] = x; break;
      case 16: y = s.pop(); x = s.pop(); s.push((x + y) | 0); break;
      case 17: y = s.pop(); x = s.pop(); s.push((x - y) | 0); break;
      case 18: y = s.pop(); x = s.pop(); s.push(Math.imul(x, y)); break;
      case 19: y = s.pop(); x = s.pop(); if (!y) return end(4); s.push(Math.trunc(x / y) | 0); break;
      case 20: y = s.pop(); x = s.pop(); if (!y) return end(4); s.push((x % y) | 0); break;
      case 21: y = s.pop(); x = s.pop(); if (!y) return end(4); s.push(((x >>> 0) / (y >>> 0)) | 0); break;
      case 22: y = s.pop(); x = s.pop(); if (!y) return end(4); s.push(((x >>> 0) % (y >>> 0)) | 0); break;
      case 23: s[s.length - 1] = (-s[s.length - 1]) | 0; break;
      case 24: y = s.pop(); x = s.pop(); s.push(x & y); break;
      case 25: y = s.pop(); x = s.pop(); s.push(x | y); break;
      case 26: y = s.pop(); x = s.pop(); s.push(x ^ y); break;
      case 27: s[s.length - 1] = ~s[s.length - 1]; break;
      case 28: y = s.pop(); x = s.pop(); s.push(x << y); break;
      case 29: y = s.pop(); x = s.pop(); s.push(x >> y); break;
      case 30: y = s.pop(); x = s.pop(); s.push((x >>> y) | 0); break;
      case 32: y = s.pop(); x = s.pop(); s.push(x === y ? 1 : 0); break;
      case 33: y = s.pop(); x = s.pop(); s.push(x < y ? 1 : 0); break;
      case 34: y = s.pop(); x = s.pop(); s.push((x >>> 0) < (y >>> 0) ? 1 : 0); break;
      case 48: pc = nx + v; continue;
      case 49: if (!s.pop()) { pc = nx + v; continue; } break;
      case 50: if (s.pop()) { pc = nx + v; continue; } break;
      case 51: if (c.length >= 64) return end(7); c.push(nx); pc = v; continue;
      case 52: if (!c.length) return end(8); pc = c.pop(); continue;
      case 64: x = s.pop(); if (x < 0 || x > 255) return end(6); s.push(m[x]); break;
      case 65: x = s.pop(); y = s.pop(); if (x < 0 || x > 255) return end(6); m[x] = y; break;
      case 80: { const t = String(s.pop()); if (ol + t.length > 65536) return end(11); for (let i = 0; i < t.length; i++) o[ol++] = t.charCodeAt(i); break; }
      case 81: if (ol >= 65536) return end(11); o[ol++] = s.pop() & 255; break;
      case 82: s.push(ip < inp.length ? inp[ip++] : -1); break;
      case 83: return end(s.pop() & 255);
    }
    pc = nx;
  }
}
for (const id of readdirSync(I).sort()) {
  const [o, k] = run(readFileSync(join(I, id, 'program.bin')), readFileSync(join(I, id, 'input.bin')));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), o);
  writeFileSync(join(O, id, 'exit.txt'), k + '\n');
}

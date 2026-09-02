/** Canvas figures for the five product blocks on the homepage.
    Each draws one idea; the pointer position (0..1 within the canvas, or a
    centred default) steers it. Ported from the prototype's logic class. */

export type Pointer = { x: number; y: number; on: boolean };

export type FigureKind =
  | "quadtree"
  | "chords"
  | "lattice"
  | "lissajous"
  | "voronoi";

const CENTRE: Pointer = { x: 0.5, y: 0.5, on: false };

/** Size the backing store to the device pixel ratio and return a CSS-pixel context. */
function fitCanvas(cv: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const r = cv.getBoundingClientRect();
  cv.width = Math.max(1, Math.round(r.width * dpr));
  cv.height = Math.max(1, Math.round(r.height * dpr));
  const ctx = cv.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
}

function caption(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  text: string,
) {
  ctx.font = '500 11px "Author", sans-serif';
  ctx.fillStyle = "#5C4F4C";
  ctx.textAlign = "right";
  ctx.fillText(text, w - 24, h - 16);
  ctx.textAlign = "left";
}

/** Zerra: recursive subdivision, s -> s/2^d. */
function drawQuadtree(cv: HTMLCanvasElement, t: number, p: Pointer) {
  const { ctx, w, h } = fitCanvas(cv);
  ctx.clearRect(0, 0, w, h);
  const pad = 40;
  const side = Math.min(w, h) - pad * 2;
  if (side <= 0) return;
  const ox = (w - side) / 2;
  const oy = (h - side) / 2;
  const phase = (t % 9000) / 9000;
  const px = p.on ? p.x : 0.5;
  const py = p.on ? p.y : 0.5;
  const rec = (x: number, y: number, s: number, d: number) => {
    ctx.strokeStyle = "rgba(22,16,15," + (0.1 + 0.1 * d).toFixed(3) + ")";
    ctx.lineWidth = 1;
    ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(s), Math.round(s));
    if (d >= 5) return;
    const cxn = (x + s / 2 - ox) / side;
    const cyn = (y + s / 2 - oy) / side;
    const dist = Math.hypot(cxn - px, cyn - py);
    const wave = 0.5 + 0.5 * Math.sin(phase * Math.PI * 2 - dist * 7 + (cxn + cyn) * 2.4);
    const pressure = (1 - Math.min(1, dist * 1.35)) * 0.8 + 0.34 + wave * 0.26;
    if (pressure > 0.62 + d * 0.06) {
      const hs = s / 2;
      rec(x, y, hs, d + 1);
      rec(x + hs, y, hs, d + 1);
      rec(x, y + hs, hs, d + 1);
      rec(x + hs, y + hs, hs, d + 1);
    } else if (d >= 3) {
      ctx.fillStyle = "rgba(22,16,15,0.86)";
      const k = s * 0.34;
      ctx.fillRect(x + s / 2 - k / 2, y + s / 2 - k / 2, k, k);
    }
  };
  rec(ox, oy, side, 0);
}

/** Leri: eight vertices, chord map i -> i*k mod n. */
function drawChords(cv: HTMLCanvasElement, t: number, p: Pointer) {
  const { ctx, w, h } = fitCanvas(cv);
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) / 2 - 40;
  if (R <= 0) return;
  const n = 8;
  ctx.strokeStyle = "rgba(22,16,15,0.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  const m = 144;
  const k = p.on ? 2 + p.x * 7 : 2 + ((t % 24000) / 24000) * 7;
  ctx.strokeStyle = "rgba(22,16,15,0.20)";
  ctx.beginPath();
  for (let i = 0; i < m; i++) {
    const a1 = -Math.PI / 2 + (i / m) * Math.PI * 2;
    const a2 = -Math.PI / 2 + (((i * k) % m) / m) * Math.PI * 2;
    const r2 = R * 0.94;
    ctx.moveTo(cx + Math.cos(a1) * r2, cy + Math.sin(a1) * r2);
    ctx.lineTo(cx + Math.cos(a2) * r2, cy + Math.sin(a2) * r2);
  }
  ctx.stroke();
  ctx.fillStyle = "#16100F";
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  caption(ctx, w, h, "k = " + k.toFixed(2));
}

/** Enterprise AI: a lattice deforming under a gaussian load, never disconnecting. */
function drawLattice(cv: HTMLCanvasElement, t: number, p: Pointer) {
  const { ctx, w, h } = fitCanvas(cv);
  ctx.clearRect(0, 0, w, h);
  const cols = 16;
  const rows = 12;
  const pad = 36;
  const gw = (w - pad * 2) / (cols - 1);
  const gh = (h - pad * 2) / (rows - 1);
  if (gw <= 0 || gh <= 0) return;
  const px = pad + (p.on ? p.x : 0.5) * (w - pad * 2);
  const py = pad + (p.on ? p.y : 0.5) * (h - pad * 2);
  const pts: [number, number][][] = [];
  for (let r = 0; r < rows; r++) {
    pts[r] = [];
    for (let c = 0; c < cols; c++) {
      let x = pad + c * gw;
      let y = pad + r * gh;
      const drift = Math.sin(x * 0.012 + t * 0.0006) * Math.cos(y * 0.014 - t * 0.0004);
      x += drift * 7;
      y += Math.sin(y * 0.02 + t * 0.0005 + x * 0.004) * 6;
      const dx = x - px;
      const dy = y - py;
      const d = Math.hypot(dx, dy);
      const pull = Math.exp(-(d * d) / (2 * 90 * 90)) * 26;
      x -= (dx / (d || 1)) * pull;
      y -= (dy / (d || 1)) * pull;
      pts[r][c] = [x, y];
    }
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(22,16,15,0.28)";
  ctx.beginPath();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pt = pts[r][c];
      if (c < cols - 1) {
        ctx.moveTo(pt[0], pt[1]);
        ctx.lineTo(pts[r][c + 1][0], pts[r][c + 1][1]);
      }
      if (r < rows - 1) {
        ctx.moveTo(pt[0], pt[1]);
        ctx.lineTo(pts[r + 1][c][0], pts[r + 1][c][1]);
      }
    }
  }
  ctx.stroke();
  ctx.fillStyle = "rgba(22,16,15,0.85)";
  for (let r = 0; r < rows; r += 3) {
    for (let c = 0; c < cols; c += 4) {
      const pt = pts[r][c];
      ctx.fillRect(pt[0] - 2, pt[1] - 2, 4, 4);
    }
  }
}

/** Advanced R&D: a Lissajous family, ratio drifting, trailing curves behind it. */
function drawLissajous(cv: HTMLCanvasElement, t: number, p: Pointer) {
  const { ctx, w, h } = fitCanvas(cv);
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) / 2 - 40;
  if (R <= 0) return;
  const a = 3 + (p.on ? p.x * 4 : Math.sin(t * 0.00013) * 2 + 2);
  const b = 2 + (p.on ? p.y * 4 : Math.cos(t * 0.00017) * 2 + 2);
  const layers = 5;
  for (let L = layers - 1; L >= 0; L--) {
    const delta = t * 0.0004 + L * 0.22;
    const scale = 1 - L * 0.11;
    ctx.strokeStyle = "rgba(22,16,15," + (0.42 - L * 0.07).toFixed(3) + ")";
    ctx.lineWidth = L === 0 ? 1.4 : 1;
    ctx.beginPath();
    const steps = 720;
    for (let i = 0; i <= steps; i++) {
      const th = (i / steps) * Math.PI * 2;
      const x = cx + Math.sin(a * th + delta) * R * scale;
      const y = cy + Math.sin(b * th) * R * scale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  caption(ctx, w, h, "a : b = " + a.toFixed(2) + " : " + b.toFixed(2));
}

/** Data Annotation: nearest-label partition, argmin ‖x − cᵢ‖. */
function drawVoronoi(cv: HTMLCanvasElement, t: number, p: Pointer) {
  const { ctx, w, h } = fitCanvas(cv);
  ctx.clearRect(0, 0, w, h);
  const pad = 24;
  const iw = w - pad * 2;
  const ih = h - pad * 2;
  if (iw <= 0 || ih <= 0) return;
  const n = 11;
  const sites: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = i * 2.399963 + t * 0.00006;
    const r = Math.sqrt((i + 0.5) / n);
    sites.push([
      pad + iw * (0.5 + 0.42 * r * Math.cos(a)),
      pad + ih * (0.5 + 0.42 * r * Math.sin(a)),
    ]);
  }
  if (p.on) sites.push([pad + p.x * iw, pad + p.y * ih]);
  const b = 7;
  for (let y = pad; y < pad + ih; y += b) {
    for (let x = pad; x < pad + iw; x += b) {
      let best = 0;
      let bd = Infinity;
      let second = Infinity;
      for (let i = 0; i < sites.length; i++) {
        const dx = x - sites[i][0];
        const dy = y - sites[i][1];
        const d = dx * dx + dy * dy;
        if (d < bd) {
          second = bd;
          bd = d;
          best = i;
        } else if (d < second) {
          second = d;
        }
      }
      // Cells nearly equidistant from two sites are the boundary: draw it dark.
      if (Math.sqrt(second) - Math.sqrt(bd) < b * 1.1) {
        ctx.fillStyle = "rgba(22,16,15,0.70)";
      } else {
        ctx.fillStyle = "rgba(22,16,15," + (0.05 + (best % 4) * 0.045).toFixed(3) + ")";
      }
      ctx.fillRect(x, y, b - 1, b - 1);
    }
  }
  ctx.fillStyle = "#E01A0D";
  sites.forEach((s) => {
    ctx.beginPath();
    ctx.arc(s[0], s[1], 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
  caption(ctx, w, h, "classes = " + sites.length);
}

const FIGURES: Record<
  FigureKind,
  (cv: HTMLCanvasElement, t: number, p: Pointer) => void
> = {
  quadtree: drawQuadtree,
  chords: drawChords,
  lattice: drawLattice,
  lissajous: drawLissajous,
  voronoi: drawVoronoi,
};

export function drawFigure(
  kind: FigureKind,
  cv: HTMLCanvasElement,
  t: number,
  pointer: Pointer = CENTRE,
) {
  FIGURES[kind](cv, t, pointer);
}

/** The band under the hero: one field, quantized at four bit depths. */
export function makeBandPainter(cv: HTMLCanvasElement) {
  const W = cv.clientWidth || 1440;
  const H = 200;
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;
  const zones = [
    { block: 32, levels: 2 },
    { block: 16, levels: 4 },
    { block: 8, levels: 8 },
    { block: 4, levels: 16 },
  ];
  const zoneW = W / zones.length;
  const field = (x: number, y: number, t: number) => {
    const a = Math.sin(x * 0.0042 + t * 0.00035);
    const b = Math.sin(y * 0.011 - t * 0.00027 + a * 1.6);
    const c = Math.sin((x + y) * 0.0031 + t * 0.0002);
    return Math.min(1, Math.max(0, 0.5 + 0.28 * a + 0.22 * b + 0.16 * c));
  };
  return (t: number) => {
    ctx.fillStyle = "#EBE4E1";
    ctx.fillRect(0, 0, W, H);
    zones.forEach((z, zi) => {
      const x0 = zi * zoneW;
      for (let x = x0; x < x0 + zoneW; x += z.block) {
        for (let y = 0; y < H; y += z.block) {
          const v = field(x + z.block / 2, y + z.block / 2, t);
          const q = Math.round(v * z.levels) / z.levels;
          if (q <= 0) continue;
          ctx.fillStyle = "rgba(22,16,15," + (q * 0.88).toFixed(3) + ")";
          ctx.fillRect(x, y, z.block - 1, z.block - 1);
        }
      }
    });
  };
}

/** The starting timestamp the prototype paints its first frame at. */
export const FIRST_FRAME = 2600;

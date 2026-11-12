// Synthesises the music bed and every sound effect, timed from src/timeline.json.
// Output: public/audio/music.wav and public/audio/sfx.wav (mixed with the voice by scripts/mix.sh).
import fs from "fs";

const tl = JSON.parse(fs.readFileSync(new URL("../src/timeline.json", import.meta.url)));
const SR = 44100;
const DUR = tl.duration;
const N = SR * DUR;
const TAU = Math.PI * 2;
const mk = () => [new Float32Array(N), new Float32Array(N)];
const drums = mk(), tonal = mk(), sfx = mk();

let seed = 7;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return (seed / 4294967296) * 2 - 1; };

function put(bus, t, len, fn, gain = 1, pan = 0) {
  const s0 = Math.floor(t * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4) * 1.414;
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4) * 1.414;
  const n = Math.floor(len * SR);
  for (let i = 0; i < n; i++) {
    const k = s0 + i;
    if (k < 0 || k >= N) continue;
    const v = fn(i / SR, i / n);
    bus[0][k] += v * gl;
    bus[1][k] += v * gr;
  }
}
const lp = (cut) => { let y = 0; const a = 1 - Math.exp((-TAU * cut) / SR); return (x) => (y += a * (x - y)); };
const hp = (cut) => { const l = lp(cut); return (x) => x - l(x); };

// ---------- instruments ----------
const kickTimes = [];
function kick(t, g = 1) {
  kickTimes.push(t);
  let ph = 0;
  put(drums, t, 0.45, (tt) => {
    const f = 46 + 120 * Math.exp(-tt * 30);
    ph += (TAU * f) / SR;
    return Math.sin(ph) * Math.exp(-tt * 8) + rnd() * 0.25 * Math.exp(-tt * 220);
  }, 0.95 * g);
}
function clap(t, g = 1) {
  const h = hp(900), l = lp(6000);
  put(drums, t, 0.3, (tt) => {
    const e = Math.exp(-tt * 28) + 0.8 * Math.exp(-Math.abs(tt - 0.012) * 300) + 0.6 * Math.exp(-Math.abs(tt - 0.025) * 300);
    return l(h(rnd())) * e * 0.5;
  }, 0.5 * g);
}
function hat(t, g = 1, open = false) {
  const h = hp(7000);
  put(drums, t, open ? 0.25 : 0.07, (tt) => h(rnd()) * Math.exp(-tt * (open ? 18 : 80)), 0.16 * g, 0.25);
}
function snare(t, g = 1) {
  const h = hp(1500);
  put(drums, t, 0.18, (tt) => (h(rnd()) * 0.7 + Math.sin(TAU * 190 * tt) * 0.5 * Math.exp(-tt * 30)) * Math.exp(-tt * 22), 0.35 * g);
}
function bass(t, f, len, g = 1) {
  const l = lp(380);
  put(tonal, t, len, (tt, p) => {
    let s = 0;
    for (let h = 1; h <= 6; h++) s += Math.sin(TAU * f * h * tt) / h;
    const env = Math.min(1, tt / 0.006) * Math.exp(-tt * 3.5) * (p > 0.9 ? (1 - p) * 10 : 1);
    return (l(s) * 0.7 + Math.sin(TAU * f * tt) * 0.6) * env;
  }, 0.42 * g);
}
function pluck(t, f, g = 1, pan = 0) {
  const voice = (tt) => (Math.sin(TAU * f * tt) + 0.45 * Math.sin(TAU * 2 * f * tt) + 0.2 * Math.sin(TAU * 3 * f * tt)) * Math.exp(-tt * 11) * Math.min(1, tt / 0.003);
  put(tonal, t, 0.5, voice, 0.13 * g, pan);
  put(tonal, t + 0.375, 0.5, voice, 0.05 * g, -pan * 1.4 || 0.5);
  put(tonal, t + 0.75, 0.5, voice, 0.022 * g, pan * 1.4 || -0.5);
}
function pad(t, freqs, len, g = 1) {
  freqs.forEach((f, i) => {
    put(tonal, t, len, (tt, p) => {
      const env = Math.min(1, tt / 0.35) * Math.min(1, (1 - p) * len / 0.45);
      return (Math.sin(TAU * f * 1.003 * tt) + Math.sin(TAU * f * 0.997 * tt) + 0.18 * Math.sin(TAU * f * 2 * tt)) * env;
    }, 0.045 * g, i % 2 ? 0.5 : -0.5);
  });
}

// ---------- harmony: Am  F  C  G ----------
const CH = [
  { root: 55.0, notes: [220.0, 261.63, 329.63] },
  { root: 43.65, notes: [174.61, 220.0, 261.63] },
  { root: 65.41, notes: [196.0, 261.63, 329.63] },
  { root: 49.0, notes: [196.0, 246.94, 293.66] },
];
const BEAT = 0.5;

function fullBar(t0, ci, o = {}) {
  const c = CH[ci % 4];
  pad(t0, c.notes, 2.05, 0.9);
  for (let b = 0; b < 4; b++) {
    const t = t0 + b * BEAT;
    if (o.kick !== false) kick(t);
    if (b % 2 === 1) clap(t);
    hat(t + 0.25, 1, true);
    hat(t, 0.5); hat(t + 0.125, 0.35); hat(t + 0.375, 0.35);
    bass(t + 0.25, c.root * 2, 0.22, 0.9);
    if (b === 3) bass(t + 0.375, c.root * 2 * 1.5, 0.11, 0.6);
  }
  const arp = [0, 1, 2, 1, 0, 2, 1, 2];
  arp.forEach((n, i) => pluck(t0 + i * 0.25, c.notes[n] * 2, 1, i % 2 ? 0.45 : -0.45));
}

// Section 1 — hook (0 → 7): airy pad + sparse plucks, hats creeping in
for (let b = 0; b < 4; b++) {
  const t0 = b * 2, c = CH[b % 4];
  if (t0 < 7) pad(t0, c.notes, 2.05, 1.2);
  [0, 2, 1, 2].forEach((n, i) => { const t = t0 + i * 0.5; if (t < 6.9) pluck(t, c.notes[n] * 2, 0.8, i % 2 ? 0.4 : -0.4); });
  if (b >= 1) for (let i = 0; i < 8; i++) { const t = t0 + i * 0.25; if (t < 6.9) hat(t, 0.35 + 0.1 * b); }
  if (b >= 2) { kick(t0, 0.55); if (t0 + 1 < 6.9) kick(t0 + 1, 0.55); }
}
// Section 2 — the problem (7 → 11.5): dark drone, heartbeat, riser + roll
put(tonal, 7.0, 4.5, (tt, p) => { const l = Math.sin(TAU * 55 * tt) + 0.5 * Math.sin(TAU * 82.4 * tt) + 0.3 * Math.sin(TAU * 110.4 * tt); return l * (0.6 + 0.4 * Math.sin(TAU * 2 * tt)) * Math.min(1, tt / 0.2) * Math.min(1, (1 - p) * 20); }, 0.16);
pad(7.0, [220, 261.63, 311.13], 4.5, 0.7);
for (let t = 7.0; t < 10.4; t += 1) { kick(t, 0.7); kick(t + 0.25, 0.45); }
for (let i = 0, t = 10.5; t < 11.48; i++) { snare(t, 0.4 + i * 0.045); t += Math.max(0.045, 0.125 - i * 0.008); }
// Section 3 — the drop (11.5 → 30.5)
for (let b = 0, t0 = 11.5; t0 < 30.5; b++, t0 += 2) {
  if (t0 + 2 > 30.5) { // last half bar before the break
    const c = CH[b % 4]; pad(t0, c.notes, 1.0, 0.9);
    kick(t0); kick(t0 + 0.5); clap(t0 + 0.5); hat(t0 + 0.25, 1, true); hat(t0 + 0.75, 1, true);
    bass(t0 + 0.25, c.root * 2, 0.22); bass(t0 + 0.75, c.root * 2, 0.22);
  } else fullBar(t0, b);
}
// Section 4 — price break (30.5 → 34): no kick, shimmering arps, roll into the last drop
for (let b = 0, t0 = 30.5; t0 < 34; b++, t0 += 2) {
  const c = CH[(b + 1) % 4], len = Math.min(2.05, 34 - t0);
  pad(t0, c.notes, len, 1.5);
  for (let i = 0; i < 8; i++) { const t = t0 + i * 0.25; if (t < 33.9) { pluck(t, c.notes[[0, 1, 2, 1][i % 4]] * 2, 0.9, i % 2 ? 0.45 : -0.45); hat(t, 0.3); } }
}
for (let i = 0, t = 33.0; t < 33.98; i++) { snare(t, 0.35 + i * 0.04); t += Math.max(0.045, 0.125 - i * 0.008); }
// Section 5 — final drop (34 → 38.5) + ring-out
for (let b = 0, t0 = 34.0; t0 < 38.0; b++, t0 += 2) fullBar(t0, b);
kick(38.0); clap(38.0 + 0.25, 0.6); kick(38.25, 0.8);
kick(38.5, 1.1);
pad(38.5, [110, 220, 261.63, 329.63, 440], 1.5, 2.2);
[220, 329.63, 440, 659.25].forEach((f, i) => pluck(38.5 + i * 0.06, f * 2, 1.4, i % 2 ? 0.4 : -0.4));

// ---------- sidechain + voice ducking on the music ----------
kickTimes.sort((a, b) => a - b);
{
  let ki = 0;
  const speech = [];
  for (const s of Object.values(tl.segs)) for (const p of s.phrases) speech.push([p.t0 - 0.12, p.t1 + 0.15]);
  let duck = 1;
  const a = 1 - Math.exp(-1 / (0.12 * SR));
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    while (ki + 1 < kickTimes.length && kickTimes[ki + 1] <= t) ki++;
    const dt = t - kickTimes[ki];
    const sc = dt >= 0 && dt < 0.4 ? 1 - 0.55 * Math.exp(-dt * 9) : 1;
    const talking = speech.some(([x, y]) => t >= x && t <= y);
    duck += a * ((talking ? 0.5 : 1.0) - duck);
    const fade = t > 39.2 ? Math.max(0, (40 - t) / 0.8) : 1;
    for (const ch of [0, 1]) {
      tonal[ch][i] *= sc * duck * fade;
      drums[ch][i] *= (0.6 + 0.4 * duck) * fade;
    }
  }
}

// ---------- sound effects ----------
function whoosh(t, len = 0.5, g = 1, dir = 1) {
  let l = 0, b = 0;
  put(sfx, t, len, (tt, p) => {
    const fc = 300 + 5200 * Math.sin(Math.PI * p) ** 2;
    const f = 2 * Math.sin((Math.PI * fc) / SR), q = 0.35;
    const x = rnd();
    const h = x - l - q * b; b += f * h; l += f * b;
    return b * Math.sin(Math.PI * p) ** 1.5;
  }, 0.55 * g, 0);
  // stereo travel
  const s0 = Math.floor(t * SR), n = Math.floor(len * SR);
  for (let i = 0; i < n; i++) { const k = s0 + i; if (k < 0 || k >= N) continue; const pn = (i / n - 0.5) * 1.2 * dir; sfx[0][k] *= 1 - Math.max(0, pn) * 0.7; sfx[1][k] *= 1 + Math.min(0, pn) * 0.7; }
}
function pop(t, f = 620, g = 1, pan = 0) {
  let ph = 0;
  put(sfx, t, 0.09, (tt) => { ph += (TAU * (f * (1 + 0.6 * Math.exp(-tt * 60)))) / SR; return Math.sin(ph) * Math.exp(-tt * 55) * Math.min(1, tt / 0.002); }, 0.3 * g, pan);
}
function tick(t, f = 2400, g = 1) {
  put(sfx, t, 0.03, (tt) => Math.sin(TAU * f * tt) * Math.exp(-tt * 220), 0.22 * g, 0);
}
function ding(t, f = 1318.5, g = 1, len = 1.1) {
  put(sfx, t, len, (tt) => (Math.sin(TAU * f * tt) + 0.4 * Math.sin(TAU * f * 2.01 * tt) * Math.exp(-tt * 8) + 0.2 * Math.sin(TAU * f * 3.02 * tt) * Math.exp(-tt * 14)) * Math.exp(-tt * 5) * Math.min(1, tt / 0.002), 0.2 * g, 0);
}
function impact(t, g = 1) {
  let ph = 0; const l = lp(900);
  put(sfx, t, 1.1, (tt) => { ph += (TAU * (38 + 70 * Math.exp(-tt * 18))) / SR; return Math.sin(ph) * Math.exp(-tt * 4.5) * 0.9 + l(rnd()) * Math.exp(-tt * 16) * 0.8; }, 0.75 * g, 0);
}
function thump(t, g = 1) {
  let ph = 0;
  put(sfx, t, 0.3, (tt) => { ph += (TAU * (55 + 90 * Math.exp(-tt * 35))) / SR; return Math.sin(ph) * Math.exp(-tt * 14); }, 0.6 * g, 0);
}
function riser(t, len, g = 1) {
  const h = hp(1200); let ph = 0;
  put(sfx, t, len, (tt, p) => { ph += (TAU * (200 + 1400 * p * p)) / SR; return (h(rnd()) * 0.5 + Math.sin(ph) * 0.25) * p * p; }, 0.5 * g, 0);
}
function glitch(t, g = 1) {
  let hold = 0, c = 0;
  put(sfx, t, 0.22, (tt) => { if (c++ % 28 === 0) hold = rnd(); return hold * (Math.sin(TAU * 31 * tt) > 0 ? 1 : 0.1) * Math.exp(-tt * 6); }, 0.22 * g, 0);
}
function click(t, g = 1) { tick(t, 3200, 1.6 * g); tick(t + 0.045, 2100, 1.2 * g); thump(t, 0.25 * g); }

const S = tl.segs;
const ph = (id, i) => S[id].phrases[i];
// subtle typing pops under each animated word of the first two scenes
for (const id of ["s0", "s1"]) for (const p of S[id].phrases) p.words.forEach((w, i) => pop(w.t - 0.03, 520 + (i % 4) * 70, 0.3, i % 2 ? 0.3 : -0.3));

whoosh(0.02, 0.7, 0.9);                      // opening
ding(0.45, 1760, 0.5);                       // the idea lights up
whoosh(ph("s0", 1).t0 - 0.38, 0.5, 0.9, -1); // image change inside the hook
thump(ph("s0", 1).t0 - 0.12, 0.6);
tl.cuts.forEach((c, i) => whoosh(c - 0.3, 0.6, 1.1, i % 2 ? -1 : 1)); // every scene wipe
// scene 2
glitch(7.08); glitch(7.42, 0.6);
whoosh(ph("s1", 0).t1 - 0.12, 0.3, 0.8); thump(ph("s1", 0).t1 + 0.12, 0.9);   // strike-through
impact(ph("s1", 1).t0 - 0.02, 0.5);
riser(10.2, 1.3, 1);
// scene 3 — brand reveal
impact(11.5, 1.1);
ding(S.s2.phrases[0].words[1].t, 1568, 0.8); ding(S.s2.phrases[0].words[1].t + 0.08, 2093, 0.5);
pop(S.s2.phrases[0].words[2].t, 780, 0.8);
whoosh(ph("s2", 1).t0 - 0.4, 0.55, 1); thump(ph("s2", 1).t0 + 0.02, 0.8);         // poster card flies in
whoosh(ph("s2", 2).t0 - 0.25, 0.35, 0.6, -1); ding(ph("s2", 2).t0, 1318.5, 0.6);
// scene 4 — three skills
S.s3.phrases.forEach((p, i) => { if (i) whoosh(p.t0 - 0.22, 0.3, 0.9, i % 2 ? -1 : 1); thump(p.t0 - 0.02, 0.9); pop(p.t0, 560 + i * 140, 1); });
// scene 5 — content cards
S.s4.phrases.forEach((p, i) => {
  whoosh(p.t0 - 0.28, 0.35, 0.75, i % 2 ? -1 : 1); thump(p.t0 - 0.02, 0.55);
  if (i < 2) { for (let k = 0; k < 9; k++) tick(p.t0 + 0.04 + k * 0.05, 1900 + k * 110, 0.7); ding(p.t0 + 0.5, 1568, 0.45, 0.6); }
  else { tick(p.t0 + 0.1, 2600, 1); ding(p.t0 + 0.2, i === 2 ? 1318.5 : 1760, 0.8); }
});
// scene 6 — price
pop(ph("s5", 0).t0, 660, 0.9);
{ const a = ph("s5", 1).t0, n = 22; for (let k = 0; k < n; k++) tick(a + (k / n) * 0.85, 1500 + k * 90, 0.75);
  const land = a + 0.9; impact(land, 0.9); [1046.5, 1318.5, 1568, 2093].forEach((f, i) => ding(land + i * 0.045, f, 0.75)); }
// scene 7 — call to action
pop(ph("s6", 0).t0, 700, 1); whoosh(ph("s6", 0).t0 - 0.2, 0.3, 0.6);
click(ph("s6", 0).t1 + 0.1, 1.2);
[1, 2, 3].forEach((i) => { const t = ph("s6", i).t0; thump(t - 0.02, 1.1); pop(t, 500 + i * 130, 1); whoosh(t - 0.2, 0.25, 0.5, i % 2 ? 1 : -1); });
ding(ph("s6", 3).t0 + 0.05, 1760, 0.8);
impact(38.5, 1); [880, 1318.5, 1760].forEach((f, i) => ding(38.5 + i * 0.05, f, 0.7, 1.5));

// ---------- write ----------
function wav(path, buses, gain) {
  const data = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) for (const ch of [0, 1]) {
    let v = 0; for (const b of buses) v += b[ch][i];
    v = Math.tanh(v * gain);
    data.writeInt16LE(Math.round(v * 32767), i * 4 + ch * 2);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVEfmt ", 8); h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 4, 28);
  h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(path, Buffer.concat([h, data]));
}
fs.mkdirSync(new URL("../public/audio/", import.meta.url), { recursive: true });
wav(new URL("../public/audio/music.wav", import.meta.url), [drums, tonal], 1.0);
wav(new URL("../public/audio/sfx.wav", import.meta.url), [sfx], 1.0);
console.log("audio ok");

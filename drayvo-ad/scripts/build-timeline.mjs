// Builds src/timeline.json: absolute word timings derived from the measured pauses of each voice clip.
import fs from "fs";
const segs = [
  { id: "s0", start: 0.5, phrases: [
    [0, 3.185, "Et si tes idées devenaient des créations professionnelles…"],
    [3.76, 6.0, "avec l'intelligence artificielle ?"] ] },
  { id: "s1", start: 7.2, phrases: [
    [0, 2.076, "Plus besoin de logiciels compliqués."],
    [2.757, 4.1, "Ni d'années d'expérience."] ] },
  { id: "s2", start: 11.7, phrases: [
    [0, 1.926, "Découvre DRAYVO STUDIO."],
    [2.647, 4.743, "La formation qui t'emmène de l'idée…"],
    [5.606, 7.1, "à la création numérique."] ] },
  { id: "s3", start: 19.1, phrases: [
    [0, 1.05, "Motion design."],
    [1.272, 2.456, "Design graphique."],
    [2.646, 3.3, "Branding."] ] },
  { id: "s4", start: 22.7, phrases: [
    [0, 1.38, "10 modules pratiques"],
    [2.024, 4.03, "30 prompts professionnels"],
    [4.761, 5.95, "Ressources incluses"],
    [6.543, 7.4, "Projets concrets"] ] },
  { id: "s5", start: 30.7, phrases: [
    [0, 0.933, "Prix de lancement"],
    [1.305, 3.17, "149 000 francs guinéens"] ] },
  { id: "s6", start: 34.2, phrases: [
    [0, 1.12, "Commande maintenant"],
    [1.573, 2.1, "Crée."],
    [2.42, 3.217, "Imagine."],
    [3.597, 4.4, "Réalise."] ] },
];
const out = { fps: 30, duration: 40, cuts: [7.0, 11.5, 19.0, 22.5, 30.5, 34.0], segs: {} };
for (const s of segs) {
  out.segs[s.id] = { start: s.start, phrases: s.phrases.map(([a, b, text]) => {
    const raw = text.split(" ");
    // glue lone punctuation ("?") to the previous word
    const words = [];
    for (const w of raw) { if (/^[?!:;]$/.test(w) && words.length) words[words.length - 1] += " " + w; else words.push(w); }
    const total = words.reduce((n, w) => n + w.length, 0);
    let acc = 0;
    const ws = words.map((w) => { const t = s.start + a + (b - a) * (acc / total); acc += w.length; return { w, t: +t.toFixed(3) }; });
    return { t0: +(s.start + a).toFixed(3), t1: +(s.start + b).toFixed(3), words: ws };
  }) };
}
fs.writeFileSync(new URL("../src/timeline.json", import.meta.url), JSON.stringify(out, null, 1));
console.log("timeline ok");

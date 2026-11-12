import React from "react";
import { AbsoluteFill } from "remotion";
import { C, mix, outBack, Photo, prog, SEG, Shade, useAbs, Words } from "../lib";

const ITEMS = [
  { img: "img/motion.png", lines: [1, 1], icon: <path d="M-16 -24 L26 0 L-16 24 Z" fill="#fff" /> },
  { img: "img/design.png", lines: [1, 1], icon: <path d="M-26 26 L-20 4 L12 -28 L28 -12 L-4 20 Z" fill="#fff" /> },
  { img: "img/brand.png", lines: [1], icon: <path d="M0 -30 L9 -10 L30 -8 L14 6 L19 28 L0 16 L-19 28 L-14 6 L-30 -8 L-9 -10 Z" fill="#fff" /> },
];

/** 19s → 22.5s — « Motion design. Design graphique. Branding. » */
export const Skills: React.FC = () => {
  const t = useAbs(19);
  const P = SEG.s3.phrases;
  const on = (i: number) => P[i].t0 - 0.12;
  const active = t >= on(2) ? 2 : t >= on(1) ? 1 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.navyDeep }}>
      {ITEMS.map((it, i) => {
        if (i !== active) return null;
        const q = prog(t, on(i), 0.55);
        return (
          <AbsoluteFill key={i}>
            <AbsoluteFill style={{ scale: mix(q, 1.4, 1), filter: `blur(${mix(q, 16, 0)}px)` }}>
              <Photo src={it.img} from={1.04} to={1.3} />
            </AbsoluteFill>
            <Shade css="linear-gradient(180deg, rgba(8,17,31,0.1) 0%, rgba(8,17,31,0) 35%, rgba(8,17,31,0.82) 66%, rgba(8,17,31,0.97) 100%)" />
            <AbsoluteFill style={{ background: "#fff", opacity: (1 - prog(t, on(i), 0.3)) * 0.55 }} />
            <div style={{ position: "absolute", left: 80, right: 80, bottom: 360, display: "flex", flexDirection: "column", gap: 34 }}>
              <div style={{ width: 150, height: 150, borderRadius: "50%", background: `linear-gradient(160deg, ${C.orangeLight}, ${C.orange})`, boxShadow: "0 20px 50px rgba(242,106,27,0.55)", display: "flex", alignItems: "center", justifyContent: "center", scale: prog(t, on(i) + 0.04, 0.45, outBack) }}>
                <svg width="90" height="90" viewBox="-45 -45 90 90">{it.icon}</svg>
              </div>
              <Words phrase={P[i]} t={t} size={112} lines={it.lines} lineHeight={1.08} />
            </div>
            <div style={{ position: "absolute", left: 80, bottom: 250, display: "flex", gap: 14 }}>
              {ITEMS.map((_, k) => (
                <div key={k} style={{ height: 12, borderRadius: 6, width: k === i ? mix(q, 12, 84) : 12, background: k === i ? C.orange : "rgba(255,255,255,0.35)" }} />
              ))}
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
Skills.displayName = "4 · Compétences";

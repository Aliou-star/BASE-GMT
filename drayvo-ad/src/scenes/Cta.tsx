import React from "react";
import { AbsoluteFill } from "remotion";
import { C, Logo, mix, outBack, Photo, prog, SEG, Shade, useAbs, Words } from "../lib";

/** 34s → 40s — « Commande maintenant. Crée. Imagine. Réalise. » */
export const Cta: React.FC = () => {
  const t = useAbs(34);
  const [a, w1, w2, w3] = SEG.s6.phrases;
  const press = a.t1 + 0.1;
  const btn = prog(t, a.t0 - 0.15, 0.5, outBack);
  const squeeze = Math.sin(Math.PI * prog(t, press, 0.3, (n) => n));
  const ring = (at: number) => prog(t, at, 0.8);
  const cursor = prog(t, press - 0.6, 0.55);
  const rings = [press, 38.5, 39.2];
  return (
    <AbsoluteFill style={{ backgroundColor: C.navyDeep }}>
      <AbsoluteFill style={{ opacity: 0.4, filter: "blur(10px)" }}>
        <Photo src="img/motion.png" from={1.1} to={1.35} />
      </AbsoluteFill>
      <Shade css={`radial-gradient(90% 60% at 50% 45%, rgba(14,27,46,0.55) 0%, ${C.navyDeep} 100%)`} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", opacity: prog(t, 34.15, 0.5), translate: `0px ${mix(prog(t, 34.15, 0.6), -60, 0)}px` }}>
        <Logo dark size={130} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 440 }}>
        <Words phrase={w1} t={t} size={184} weight={900} align="center" lineHeight={1.12} />
        <Words phrase={w2} t={t} size={184} weight={900} align="center" lineHeight={1.12} />
        <Words phrase={w3} t={t} size={184} weight={900} align="center" lineHeight={1.12} color={C.orange} />
      </div>

      {rings.map((at) => (
        <div key={at} style={{ position: "absolute", left: 90, top: 1230, width: 900, height: 170, borderRadius: 85, border: `6px solid ${C.orange}`, opacity: t < at ? 0 : (1 - ring(at)) * 0.8, scale: `${1 + ring(at) * 0.16} ${1 + ring(at) * 0.6}` }} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 1230,
          width: 900,
          height: 170,
          borderRadius: 85,
          background: "linear-gradient(180deg, #FF8A3D 0%, #F26A1B 55%, #E2570C 100%)",
          boxShadow: "0 34px 70px rgba(242,106,27,0.5), inset 0 3px 0 rgba(255,255,255,0.45), inset 0 -6px 0 rgba(0,0,0,0.14)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          opacity: prog(t, a.t0 - 0.15, 0.15),
          scale: mix(btn, 0.6, 1) * (1 - 0.07 * squeeze),
        }}
      >
        <Words phrase={a} t={t} size={58} color={C.navy} shadow={false} />
        <svg width="34" height="54" viewBox="0 0 34 54" style={{ opacity: prog(t, a.t1 - 0.1, 0.2), translate: `${Math.sin(t * 6) * 6}px 0px` }}>
          <path d="M6 6 L27 27 L6 48" fill="none" stroke={C.navy} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <svg width="110" height="130" viewBox="0 0 110 130" style={{ position: "absolute", left: mix(cursor, 1000, 930), top: mix(cursor, 1780, 1352), opacity: prog(t, press - 0.6, 0.15) * (1 - prog(t, press + 0.9, 0.3)), scale: 1 - 0.12 * squeeze, filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.5))" }}>
        <path d="M14 8 L14 100 L40 76 L58 118 L76 110 L58 70 L94 70 Z" fill="#fff" stroke={C.navyDeep} strokeWidth="7" strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};
Cta.displayName = "7 · Appel à l'action";

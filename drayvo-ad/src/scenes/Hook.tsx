import React from "react";
import { AbsoluteFill } from "remotion";
import { C, inOut, mix, Photo, prog, SEG, Shade, useAbs, Words } from "../lib";

/** 0s → 7s — « Et si tes idées devenaient des créations professionnelles… avec l'intelligence artificielle ? » */
export const Hook: React.FC = () => {
  const t = useAbs(0);
  const [a, b] = SEG.s0.phrases;
  const sw = b.t0 - 0.3;
  const x = prog(t, sw, 0.5, inOut);
  const intro = prog(t, 0, 0.6);
  return (
    <AbsoluteFill style={{ backgroundColor: C.navyDeep }}>
      <AbsoluteFill style={{ opacity: intro * (1 - x), scale: mix(intro, 1.25, 1) * mix(x, 1, 1.3), filter: `blur(${mix(intro, 20, 0) + x * 14}px)` }}>
        <Photo src="img/idea.png" from={1.02} to={1.2} origin="50% 28%" />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: x, scale: mix(x, 1.3, 1), filter: `blur(${mix(x, 14, 0)}px)` }}>
        <Photo src="img/desk.png" from={1.16} to={1.04} origin="40% 35%" />
      </AbsoluteFill>
      <Shade css="linear-gradient(180deg, rgba(8,17,31,0.25) 0%, rgba(8,17,31,0) 30%, rgba(8,17,31,0.75) 62%, rgba(8,17,31,0.96) 100%)" />
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 310 }}>
        <Words phrase={a} t={t} size={86} lines={[4, 2, 1, 1]} hi={{ 3: C.orange, 7: C.orange }} exitAt={sw - 0.1} />
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 310 }}>
        <Words phrase={b} t={t} size={100} lines={[1, 1, 1]} hi={{ 1: C.orange, 2: C.orange }} />
      </div>
    </AbsoluteFill>
  );
};
Hook.displayName = "1 · Accroche";

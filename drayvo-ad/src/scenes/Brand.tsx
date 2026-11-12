import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, inOut, Logo, mix, outBack, prog, SEG, useAbs, Words } from "../lib";

/** 11.5s → 19s — « Découvre DRAYVO STUDIO. La formation qui t'emmène de l'idée… à la création numérique. » */
export const Brand: React.FC = () => {
  const t = useAbs(11.5);
  const [a, b, c] = SEG.s2.phrases;
  const up = prog(t, b.t0 - 0.5, 0.75, inOut);
  const card = prog(t, b.t0 - 0.32, 0.95);
  const float = Math.sin((t - b.t0) * 1.3);
  const sheen = prog(t, b.t0 + 0.5, 1.1, inOut);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 50% 40%, #FBF6EE 0%, ${C.cream} 55%, #E2D6C4 100%)` }}>
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: C.orange, opacity: 0.2, filter: "blur(120px)", left: 420 + Math.sin(t * 0.6) * 60, top: 1150 + Math.cos(t * 0.5) * 50 }} />
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "#1B2D49", opacity: 0.12, filter: "blur(120px)", left: -260, top: 80 }} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 700, opacity: 1 - up, translate: `0px ${-80 * up}px` }}>
        <Words phrase={{ ...a, words: a.words.slice(0, 1) }} t={t} size={72} weight={600} color={C.navy} align="center" shadow={false} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: mix(up, 850, 130), height: 220, display: "flex", justifyContent: "center", alignItems: "center", scale: mix(up, 1, 0.62) }}>
        <Logo size={200} reveal={[prog(t, 11.56, 0.6, outBack), prog(t, a.words[1].t - 0.12, 0.5), prog(t, a.words[2].t - 0.12, 0.5)]} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 150,
          top: 395,
          width: 780,
          height: 975,
          borderRadius: 40,
          overflow: "hidden",
          opacity: prog(t, b.t0 - 0.32, 0.2),
          transform: `perspective(1700px) translateY(${mix(card, 1100, float * 10)}px) rotateX(${mix(card, 38, 5)}deg) rotateY(${mix(card, -34, -9 + float * 6)}deg) rotateZ(${mix(card, 9, 0.8)}deg)`,
          boxShadow: "0 70px 120px rgba(14,27,46,0.42), 0 20px 40px rgba(14,27,46,0.25)",
        }}
      >
        <Img src={staticFile("poster.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 60%)", translate: `${mix(sheen, -110, 110)}% 0px` }} />
      </div>

      <div style={{ position: "absolute", left: 60, right: 60, top: 1440, display: "flex", flexDirection: "column", gap: 12 }}>
        <Words phrase={b} t={t} size={58} weight={700} color={C.navy} lines={[4, 2]} hi={{ 5: C.orange }} align="center" shadow={false} lineHeight={1.2} />
        <Words phrase={c} t={t} size={64} color={C.orange} align="center" shadow={false} lineHeight={1.2} />
      </div>
    </AbsoluteFill>
  );
};
Brand.displayName = "3 · Marque";

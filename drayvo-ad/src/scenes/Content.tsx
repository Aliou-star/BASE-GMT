import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { C, FONT, mix, outBack, prog, SEG, useAbs, Words } from "../lib";

/** 22.5s → 30.5s — « 10 modules pratiques. 30 prompts professionnels. Ressources incluses. Projets concrets. » */
export const Content: React.FC = () => {
  const t = useAbs(22.5);
  const P = SEG.s4.phrases;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(80% 50% at 50% 0%, #1B2D49 0%, ${C.navy} 45%, ${C.navyDeep} 100%)` }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.045) 2px, transparent 2px)", backgroundSize: "120px 120px", backgroundPosition: `0px ${-(t - 22.5) * 18}px` }} />
      <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", background: C.orange, opacity: 0.22, filter: "blur(140px)", left: 500 + Math.sin(t * 0.7) * 80, top: 1200 + Math.cos(t * 0.6) * 80 }} />
      {P.map((p, i) => {
        const e = prog(t, p.t0 - 0.32, 0.75);
        const dir = i % 2 ? 1 : -1;
        const isNum = i < 2;
        const flash = 1 - prog(t, p.t0, 0.9);
        const target = Number(p.words[0].w);
        const count = Math.round(mix(prog(t, p.t0, 0.5, Easing.out(Easing.cubic)), 0, target));
        const draw = prog(t, p.t0 + 0.08, 0.4);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 80,
              top: 300 + i * 350,
              width: 920,
              height: 290,
              borderRadius: 44,
              background: "linear-gradient(135deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04))",
              border: `2px solid rgba(255,${Math.round(mix(flash, 255, 150))},${Math.round(mix(flash, 255, 80))},${mix(flash, 0.14, 0.9)})`,
              boxShadow: `0 30px 70px rgba(0,0,0,0.35), 0 0 ${60 * flash}px rgba(242,106,27,${0.55 * flash})`,
              opacity: prog(t, p.t0 - 0.32, 0.25),
              transform: `perspective(1400px) translateX(${mix(e, dir * 760, 0)}px) rotateY(${mix(e, dir * -55, 0)}deg) rotateZ(${mix(e, dir * 6, 0)}deg)`,
              display: "flex",
              alignItems: "center",
              padding: "0 50px",
              gap: 44,
              fontFamily: FONT,
            }}
          >
            <div style={{ width: 230, flexShrink: 0, display: "flex", justifyContent: "center" }}>
              {isNum ? (
                <span style={{ fontWeight: 800, fontSize: 168, lineHeight: 1, color: C.orange, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", scale: mix(prog(t, p.t0 + 0.5, 0.35, outBack), 0.92, 1) }}>{count}</span>
              ) : (
                <div style={{ width: 160, height: 160, borderRadius: "50%", background: `linear-gradient(160deg, ${C.orangeLight}, ${C.orange})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 40px rgba(242,106,27,0.5)", scale: prog(t, p.t0 - 0.02, 0.45, outBack) }}>
                  <svg width="96" height="96" viewBox="0 0 96 96">
                    <path d="M22 50 L42 69 L76 30" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="82" strokeDashoffset={82 * (1 - draw)} />
                  </svg>
                </div>
              )}
            </div>
            <Words phrase={isNum ? { ...p, words: p.words.slice(1) } : p} t={t} size={62} weight={700} lines={[1, 1]} lineHeight={1.2} shadow={false} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
Content.displayName = "5 · Contenu";

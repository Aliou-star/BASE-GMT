import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { C, FONT, Photo, prog, SEG, Shade, useAbs, Words } from "../lib";

/** 30.5s → 34s — « Prix de lancement : 149 000 francs guinéens. » */
export const Price: React.FC = () => {
  const t = useAbs(30.5);
  const [a, b] = SEG.s5.phrases;
  const land = b.t0 + 0.9;
  const value = Math.round(149000 * prog(t, b.t0, 0.9, Easing.out(Easing.cubic)));
  const text = value.toLocaleString("fr-FR").replace(/\s/g, " ");
  const punch = 1 - prog(t, land, 0.5);
  return (
    <AbsoluteFill style={{ backgroundColor: C.navyDeep }}>
      <Photo src="img/woman.png" from={1.2} to={1.08} origin="50% 30%" />
      <Shade css="linear-gradient(180deg, rgba(8,17,31,0.12) 0%, rgba(8,17,31,0) 20%, rgba(8,17,31,0) 40%, rgba(8,17,31,0.9) 56%, #08111F 68%)" />
      <div style={{ position: "absolute", left: 80, right: 80, top: 1090 }}>
        <Words phrase={a} t={t} size={58} weight={700} color={C.orange} shadow={false} />
        <div style={{ marginTop: 14, height: 8, borderRadius: 4, background: C.orange, width: prog(t, a.t0 + 0.1, 0.7) * 300 }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 1205,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 212,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: C.white,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
          opacity: prog(t, b.t0 - 0.05, 0.15),
          transformOrigin: "0% 60%",
          scale: 1 + 0.07 * punch * prog(t, land - 0.02, 0.02),
          textShadow: `0 0 ${70 * punch * prog(t, land - 0.02, 0.02)}px rgba(242,106,27,0.9), 0 10px 40px rgba(0,0,0,0.5)`,
        }}
      >
        {text}
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1470 }}>
        <Words phrase={{ ...b, words: b.words.slice(2) }} t={t} size={74} weight={700} color={C.orange} shadow={false} />
      </div>
    </AbsoluteFill>
  );
};
Price.displayName = "6 · Prix";

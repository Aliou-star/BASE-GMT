import React from "react";
import { AbsoluteFill } from "remotion";
import { C, mix, Photo, prog, SEG, Shade, useAbs, Words } from "../lib";

/** 7s → 11.5s — « Plus besoin de logiciels compliqués. Ni d'années d'expérience. » */
export const Problem: React.FC = () => {
  const t = useAbs(7);
  const [a, b] = SEG.s1.phrases;
  const shake = 1 - prog(t, 7.05, 0.7);
  const strike = (i: number) => prog(t, a.t1 - 0.1 + (i - 3) * 0.1, 0.28);
  const dim = prog(t, a.t1 + 0.15, 0.4);
  return (
    <AbsoluteFill style={{ backgroundColor: "#05090F" }}>
      <AbsoluteFill style={{ translate: `${Math.sin(t * 70) * 14 * shake}px ${Math.cos(t * 55) * 8 * shake}px`, filter: "grayscale(0.55) contrast(1.1)" }}>
        <Photo src="img/complex.png" from={1.22} to={1.08} />
      </AbsoluteFill>
      <Shade css="linear-gradient(180deg, rgba(5,9,15,0.72) 0%, rgba(5,9,15,0.6) 45%, rgba(5,9,15,0.9) 100%)" />
      <div style={{ position: "absolute", left: 80, right: 80, top: 520, opacity: mix(dim, 1, 0.5) }}>
        <Words
          phrase={a}
          t={t}
          size={100}
          lines={[3, 1, 1]}
          render={(w, i) =>
            i < 3 ? (
              w
            ) : (
              <span style={{ position: "relative", display: "inline-block" }}>
                {w}
                <span style={{ position: "absolute", left: "-3%", top: "52%", height: 14, borderRadius: 7, width: `${strike(i) * 106}%`, background: C.orange, boxShadow: "0 0 30px rgba(242,106,27,0.8)" }} />
              </span>
            )
          }
        />
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 1040 }}>
        <Words phrase={b} t={t} size={104} lines={[2, 1]} color={C.white} hi={{ 1: C.orange, 2: C.orange }} />
      </div>
    </AbsoluteFill>
  );
};
Problem.displayName = "2 · Problème";

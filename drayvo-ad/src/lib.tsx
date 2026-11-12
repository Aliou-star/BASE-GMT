import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import timeline from "./timeline.json";

export const C = {
  navy: "#0E1B2E",
  navyDeep: "#08111F",
  orange: "#F26A1B",
  orangeLight: "#FF8A3D",
  cream: "#F1E9DC",
  white: "#FFFFFF",
};
export const FONT = "Poppins, sans-serif";

export type Word = { w: string; t: number };
export type Phrase = { t0: number; t1: number; words: Word[] };
export const SEG = timeline.segs as Record<string, { start: number; phrases: Phrase[] }>;

/** Absolute time in seconds, for a scene whose <Sequence> starts at `start` seconds. */
export const useAbs = (start: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return start + frame / fps;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const outExpo = Easing.bezier(0.16, 1, 0.3, 1);
export const outBack = Easing.bezier(0.34, 1.56, 0.64, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 between t0 and t0+dur (seconds). */
export const prog = (t: number, t0: number, dur: number, easing: (n: number) => number = outExpo) =>
  interpolate(t, [t0, t0 + dur], [0, 1], { ...clamp, easing });
export const mix = (p: number, a: number, b: number) => a + (b - a) * p;

/** Kinetic text: every word pops in exactly when it is spoken. Hidden words keep their place, so nothing reflows or overlaps. */
export const Words: React.FC<{
  phrase: Phrase;
  t: number;
  size: number;
  lines?: number[];
  color?: string;
  hi?: Record<number, string>;
  weight?: number;
  align?: "left" | "center";
  lineHeight?: number;
  exitAt?: number;
  shadow?: boolean;
  render?: (word: string, index: number) => React.ReactNode;
}> = ({ phrase, t, size, lines, color = C.white, hi = {}, weight = 800, align = "left", lineHeight = 1.12, exitAt, shadow = true, render }) => {
  const groups: number[][] = [];
  let k = 0;
  for (const n of lines ?? [phrase.words.length]) {
    groups.push(Array.from({ length: n }, () => k++));
  }
  const exit = exitAt === undefined ? 0 : prog(t, exitAt, 0.3, Easing.in(Easing.cubic));
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: "-0.02em",
        textAlign: align,
        opacity: 1 - exit,
        translate: `0px ${-60 * exit}px`,
        textShadow: shadow ? "0 6px 30px rgba(0,0,0,0.45)" : undefined,
      }}
    >
      {groups.map((g, gi) => (
        <div key={gi} style={{ display: "flex", justifyContent: align === "center" ? "center" : "flex-start", gap: size * 0.26, whiteSpace: "nowrap" }}>
          {g.map((i) => {
            const p = prog(t, phrase.words[i].t - 0.07, 0.38, outBack);
            const o = prog(t, phrase.words[i].t - 0.07, 0.16, Easing.linear);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  color: hi[i] ?? color,
                  opacity: o,
                  translate: `0px ${mix(p, size * 0.45, 0)}px`,
                  scale: mix(p, 0.8, 1),
                  filter: `blur(${mix(o, 10, 0)}px)`,
                }}
              >
                {render ? render(phrase.words[i].w, i) : phrase.words[i].w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Full-bleed photo with a slow camera push. */
export const Photo: React.FC<{ src: string; from?: number; to?: number; x?: number; y?: number; style?: React.CSSProperties; origin?: string }> = ({ src, from = 1.06, to = 1.18, x = 0, y = 0, style, origin = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transformOrigin: origin,
        scale: mix(p, from, to),
        translate: `${x * p}px ${y * p}px`,
        ...style,
      }}
    />
  );
};

export const Logo: React.FC<{ dark?: boolean; size?: number; reveal?: [number, number, number] }> = ({ dark = false, size = 200, reveal = [1, 1, 1] }) => {
  const [icon, w1, w2] = reveal;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.2, fontFamily: FONT }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.24,
          background: dark ? "linear-gradient(145deg,#1B2D49,#0A1424)" : "linear-gradient(145deg,#1A2A44,#0B1525)",
          border: dark ? "2px solid rgba(255,255,255,0.16)" : "none",
          boxShadow: "0 24px 50px rgba(8,17,31,0.45), inset 0 2px 0 rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: mix(icon, 0, 1),
          rotate: `${mix(icon, -90, 0)}deg`,
          flexShrink: 0,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: size * 0.62, color: C.white, lineHeight: 1, letterSpacing: "-0.04em" }}>D</span>
        <span style={{ width: size * 0.13, height: size * 0.13, borderRadius: "50%", background: C.orange, alignSelf: "flex-end", marginBottom: size * 0.24, marginLeft: size * 0.02 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ overflow: "hidden", height: size * 0.6 }}>
          <div style={{ fontWeight: 800, fontSize: size * 0.56, lineHeight: 1.05, color: dark ? C.white : C.navy, letterSpacing: "-0.01em", translate: `0px ${mix(w1, 110, 0)}%` }}>DRAYVO</div>
        </div>
        <div style={{ overflow: "hidden", height: size * 0.3 }}>
          <div style={{ fontWeight: 600, fontSize: size * 0.225, lineHeight: 1.2, color: C.orange, letterSpacing: "0.52em", translate: `0px ${mix(w2, -110, 0)}%` }}>STUDIO</div>
        </div>
      </div>
    </div>
  );
};

export const Shade: React.FC<{ css: string }> = ({ css }) => <div style={{ position: "absolute", inset: 0, background: css }} />;

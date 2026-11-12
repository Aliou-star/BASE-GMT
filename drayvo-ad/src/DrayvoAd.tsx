import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, inOut } from "./lib";
import timeline from "./timeline.json";
import { Hook } from "./scenes/Hook";
import { Problem } from "./scenes/Problem";
import { Brand } from "./scenes/Brand";
import { Skills } from "./scenes/Skills";
import { Content } from "./scenes/Content";
import { Price } from "./scenes/Price";
import { Cta } from "./scenes/Cta";

const SCENES: React.FC[] = [Hook, Problem, Brand, Skills, Content, Price, Cta];
export const BOUNDS = [0, ...timeline.cuts, timeline.duration];

/** Two diagonal panels sweep up over every cut; the scene changes while the screen is fully covered. */
const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f0 = at * fps;
  if (frame < f0 - 11 || frame > f0 + 16) return null;
  const panel = (delay: number, color: string) => (
    <div
      style={{
        position: "absolute",
        left: -20,
        right: -20,
        top: 0,
        height: "150%",
        background: color,
        transform: `translateY(${interpolate(frame, [f0 - 10 + delay, f0 + 10 + delay], [128, -168], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: inOut,
        })}%) skewY(-5deg)`,
      }}
    />
  );
  return (
    <AbsoluteFill>
      {panel(4, C.navyDeep)}
      {panel(0, C.orange)}
    </AbsoluteFill>
  );
};

export const DrayvoAd: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.navyDeep }}>
      {SCENES.map((Scene, i) => (
        <Sequence key={i} name={Scene.displayName ?? `Scene ${i + 1}`} from={Math.round(BOUNDS[i] * fps)} durationInFrames={Math.round((BOUNDS[i + 1] - BOUNDS[i]) * fps)}>
          <Scene />
        </Sequence>
      ))}
      <AbsoluteFill style={{ background: "radial-gradient(120% 85% at 50% 45%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.38) 100%)", pointerEvents: "none" }} />
      {timeline.cuts.map((c) => (
        <Wipe key={c} at={c} />
      ))}
      <Audio src={staticFile("audio/mix.wav")} />
    </AbsoluteFill>
  );
};

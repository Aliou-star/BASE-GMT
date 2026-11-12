import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import { Composition } from "remotion";
import { DrayvoAd } from "./DrayvoAd";
import timeline from "./timeline.json";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DrayvoAd"
      component={DrayvoAd}
      durationInFrames={timeline.duration * timeline.fps}
      fps={timeline.fps}
      width={1080}
      height={1920}
    />
  );
};

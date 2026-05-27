import { AbsoluteFill, OffthreadVideo, staticFile, Easing } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { crossZoom } from "@remotion/transitions/cross-zoom";
import { z } from "zod";

export const mergeVideosSchema = z.object({
  clipA: z.string(),
  clipB: z.string(),
  transitionDurationInFrames: z.number().int().positive(),
  framesA: z.number().int().positive(),
  framesB: z.number().int().positive(),
});

export const MergeVideos: React.FC<z.infer<typeof mergeVideosSchema>> = ({
  clipA,
  clipB,
  transitionDurationInFrames,
  framesA,
  framesB,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={framesA}>
          <OffthreadVideo src={staticFile(clipA)} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({
            durationInFrames: transitionDurationInFrames,
            // Ease in/out so the dive accelerates then settles into clip B.
            easing: Easing.inOut(Easing.ease),
          })}
          presentation={crossZoom({
            // Higher strength = more aggressive zoom + motion blur.
            strength: 0.4,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={framesB}>
          <OffthreadVideo src={staticFile(clipB)} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

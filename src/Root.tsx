import { Composition, staticFile } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { MergeVideos, mergeVideosSchema } from "./MergeVideos";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MergedVideo"
      component={MergeVideos}
      schema={mergeVideosSchema}
      fps={FPS}
      // Sensible fallbacks; calculateMetadata overrides these from clip A.
      durationInFrames={300}
      width={1920}
      height={1080}
      defaultProps={{
        clipA: "a.mp4",
        clipB: "b.mp4",
        transitionDurationInFrames: 30,
        framesA: 150,
        framesB: 150,
      }}
      calculateMetadata={async ({ props }) => {
        const [metaA, metaB] = await Promise.all([
          parseMedia({
            src: staticFile(props.clipA),
            fields: { slowDurationInSeconds: true, dimensions: true },
            acknowledgeRemotionLicense: true,
          }),
          parseMedia({
            src: staticFile(props.clipB),
            fields: { slowDurationInSeconds: true },
            acknowledgeRemotionLicense: true,
          }),
        ]);

        const framesA = Math.round(metaA.slowDurationInSeconds * FPS);
        const framesB = Math.round(metaB.slowDurationInSeconds * FPS);

        // Clips overlap during the wipe, so subtract the transition length.
        const durationInFrames =
          framesA + framesB - props.transitionDurationInFrames;

        return {
          durationInFrames,
          fps: FPS,
          width: metaA.dimensions?.width ?? 1920,
          height: metaA.dimensions?.height ?? 1080,
          props: { ...props, framesA, framesB },
        };
      }}
    />
  );
};

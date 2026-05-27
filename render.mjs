// The Node.js tool: bundles the Remotion project and renders the merged video
// to out/merged.mp4. Run with `npm run render`.
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const COMPOSITION_ID = "MergedVideo";
const PUBLIC_DIR = join(__dirname, "public");
const OUT_DIR = join(__dirname, "out");
const OUTPUT = join(OUT_DIR, "merged.mp4");

async function main() {
  for (const clip of ["a.mp4", "b.mp4"]) {
    if (!existsSync(join(PUBLIC_DIR, clip))) {
      throw new Error(
        `Missing public/${clip}. Drop two video files at public/a.mp4 and public/b.mp4.`,
      );
    }
  }
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  console.log("Bundling Remotion project...");
  const serveUrl = await bundle({
    entryPoint: join(__dirname, "src", "index.ts"),
    // publicDir defaults to ./public relative to the entry's project root.
  });

  console.log("Resolving composition (auto-detecting clip durations)...");
  const composition = await selectComposition({
    serveUrl,
    id: COMPOSITION_ID,
  });

  console.log(
    `Rendering ${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames...`,
  );
  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    outputLocation: OUTPUT,
    overwrite: true,
    // The shader-based transition (crossZoom) needs a real WebGL2 backend;
    // "angle" enables it in headless Chrome.
    chromiumOptions: { gl: "angle" },
    onProgress: ({ progress }) => {
      process.stdout.write(`\r  progress: ${(progress * 100).toFixed(1)}%   `);
    },
  });

  console.log(`\nDone. Output: ${OUTPUT}`);
}

main().catch((err) => {
  console.error("\nRender failed:", err);
  process.exit(1);
});

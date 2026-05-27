import { Config } from "@remotion/cli/config";

// Used by Remotion Studio (`npm run studio`) and the CLI. The programmatic
// render in render.mjs sets these options directly and does not read this file.
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

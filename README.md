# Remotion Merge POC

Merges two videos with a **clock-wipe** transition into a single MP4, using
Remotion driven from a Node.js script.

## Usage

```bash
npm install

# Put your two clips here:
#   public/a.mp4   (plays first)
#   public/b.mp4   (plays second)

npm run render          # -> out/merged.mp4
```

Durations and resolution are detected automatically from `a.mp4` (clip A sets the
output size). The two clips overlap for ~1 second during the clock-wipe sweep.

## How it works

- `src/Root.tsx` — defines the `MergedVideo` composition. `calculateMetadata`
  uses `@remotion/media-parser` to read each clip's duration/dimensions and sets
  the timeline.
- `src/MergeVideos.tsx` — `<TransitionSeries>`: clip A → `clockWipe` transition →
  clip B, each rendered with `<OffthreadVideo>`.
- `render.mjs` — bundles the project and calls `renderMedia()` to produce
  `out/merged.mp4`.

## Live preview (optional)

```bash
npm run studio
```

## Tweaks

- Transition length / effect: `src/MergeVideos.tsx` (swap `clockWipe` for `wipe`,
  `slide`, `flip`, `fade` from `@remotion/transitions/...`).
- FPS: `FPS` constant in `src/Root.tsx`.

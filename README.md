# Bad Apple but it is played in the Terminal

**Based on [KineticTactic/Bad-Apple-Terminal](https://github.com/KineticTactic/Bad-Apple-Terminal)** by [@KineticTactic](https://github.com/KineticTactic). This repo is a modernized fork (updated dependencies, security fixes, pause/play controls, color flag).

<img width="900" height="600" alt="Window_2026-02-17_10-18-39" src="https://github.com/user-attachments/assets/5ffa1545-3f0f-45d9-be1a-85d4e9ebbc1e" />


## Requirements

- Node.js (v18+)
- A terminal that supports Unicode (e.g. braille characters). FFmpeg is bundled via `ffmpeg-static` for frame extraction.

## Steps to run

### `npm install`

Installs the required dependencies.

### First-time setup (prepare the video)

1. **`npm run extract`** — Extracts frames from `res/BadApple.mp4` (or pass a path: `node extractFrames.js /path/to/video.mp4`).
2. **`npm run build`** — Converts frames to text and merges into `data.txt`.

### `npm start`

Plays the video in the console. **Space** = pause/resume, **Q** = quit.

#### Color option (`-C` / `--color`)

You can set the color of the video to match your terminal theme (e.g. like `cmatrix -C cyan`):

```bash
node index.js -C cyan
# or
npm start -- -C cyan
```

**Options:** `-C <color>` or `--color <color>`

**Available colors:** `green`, `red`, `blue`, `white`, `yellow`, `cyan`, `magenta`, `black`

The status line (frame %, FPS, controls) stays in your terminal’s default color; only the video is drawn in the chosen color.

Note: If you want to play it again, run `npm start`. You don't have to run extract/build again unless you delete `data.txt` or the `frames/` folder.

Note: Make sure the console font size is small enough, otherwise it might not form the image properly, or start flickering. You know the font is small enough if the console doesn't start scrolling down. I launch with font at 4.

**Enjoy**

## Contributors

- Original project by [@KineticTactic](https://github.com/KineticTactic).
- Special thanks to [@yeonfish6040](https://github.com/yeonfish6040) for adding support for custom videos and optimising the video-to-text extraction process.

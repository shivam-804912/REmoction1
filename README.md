# PostMCP AI: paper-cutout explainer video (Remotion)

A ~92 second, 1920×1080 / 30 fps explainer video made with [Remotion](https://remotion.dev). It is built in a **paper-cutout style**: grainy paper textures, torn edges, layered drop shadows and a stop-motion "boil".

Two animated characters act out the script:

- **Sheya** (female, left), who asks the questions
- **Shiva** (male, right), who explains PostMCP AI

## Story beats

| # | Line | Visual |
|---|------|--------|
| 1 | Sheya: "…itna sab manually kaise?" | Social tiles and post notes swirling, "Manually?!" stamp |
| 2 | Shiva: "Ye dekho — PostMCP AI." | Paper laptop reveals the PostMCP AI logo |
| 3 | Sheya: "Ye kya karta hai?" | Logo surrounded by question marks |
| 4 | Shiva: one idea → many styles | Idea note splits into X / LinkedIn / Instagram post cards |
| 5 | Sheya: "separately post karna padta hai?" | Three "Post" buttons, "x3 ?" stamp |
| 6 | Shiva: connect → review → time → schedule | 4 step cards, "Bas. ✓" |
| 7 | Sheya: "AI ke saath bhi?" | PostMCP + AI |
| 8 | Shiva: ChatGPT / Claude / Cursor | AI tools → PostMCP hub → social accounts, prompt card and "Scheduled" toast |
| 9 | Sheya: "ek idea, baaki PostMCP?" | 1 Idea + PostMCP = all posted |
| 10 | Shiva: tagline | "Manage karo ✓" vs "Peeche bhaagna ✗" |
| 11 | Sheya: "mujhe bhi chahiye!" | Hearts and stars burst |
| 12 | Shiva: "Then you know where to start" | End card: logo, postmcpai.com, CTA |

## Usage

```bash
npm install
npm run dev        # open Remotion Studio
npm run render     # render to out/postmcp-explainer.mp4
```

## Editing

- **Script, emotions and timing:** `src/script.ts`. Each line lasts as long as its voice clip plus a short pause, and `extra` adds frames to a line.
- **Characters:** `src/components/Character.tsx`, an SVG rig with blinking, lip-flap, gestures and emotions.
- **Per-line visuals:** `src/scenes/Scenes.tsx`.
- **Colours and fonts:** `src/theme.ts`. The fonts are bundled in `public/fonts`, so renders work offline.

The PostMCP mark in this video is a placeholder paper-plane wordmark. To use the official brand, put the real logo into `PlaneMark` / `PostMCPLogo` in `src/components/Icons.tsx`.

## Voices

Each character is voiced with an offline neural Hindi voice: **Shiva** uses Piper `hi_IN-pratham-medium` (male) and **Sheya** uses `hi_IN-priyamvada-medium` (female). The clips are in `public/voices/`. The mouths lip-sync to each clip's loudness, and the speech-bubble words reveal in step with the voice.

To change a line, edit it in `src/script.ts` **and** edit its Devanagari pronunciation in `scripts/generate_voices.py`, then regenerate:

```bash
pip install sherpa-onnx soundfile numpy
# download and extract vits-piper-hi_IN-pratham-medium and vits-piper-hi_IN-priyamvada-medium
# from https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models into ./voices-models
python3 scripts/generate_voices.py --voices-dir ./voices-models
```

The script rewrites `src/voice-data.json`, which stores each clip's length and mouth envelope, so the timing updates automatically. To use recorded human voices instead, change `main()` in the script to load your recordings in place of the TTS output. Everything else stays the same.

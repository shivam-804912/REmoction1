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

- **Script, emotions and timing:** `src/script.ts`. Each line's duration is computed from its word count, and `extra` adds frames to a line.
- **Characters:** `src/components/Character.tsx`, an SVG rig with blinking, lip-flap, gestures and emotions.
- **Per-line visuals:** `src/scenes/Scenes.tsx`.
- **Colours and fonts:** `src/theme.ts`. The fonts are bundled in `public/fonts`, so renders work offline.

The PostMCP mark in this video is a placeholder paper-plane wordmark. To use the official brand, put the real logo into `PlaneMark` / `PostMCPLogo` in `src/components/Icons.tsx`.

The video has no voice-over. Speech bubbles reveal each line word by word. To add narration, drop the audio into `public/` and add an `<Audio>` per line in `src/Video.tsx`.

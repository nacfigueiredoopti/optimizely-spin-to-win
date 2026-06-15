# Optimizely · Spin to Win 🎡

A fully Optimizely-branded spinning-wheel game. Spin to win an **AI Personalized Perfume** — or learn an Optimizely fact when luck isn't on your side.

Branding (logo, font, colors, dark "vulcan" theme) is taken directly from [optimizely.com](https://www.optimizely.com/): **Figtree** typeface, Optimizely Blue `#0037ff`, Purple `#861dff`, Yellow `#ffce00`, and the official Optimizely logo SVG.

## Prizes
12-slice wheel. **Odds are intentionally hidden from players** — they're enforced internally in `WEIGHTS` (app.js):

| Prize | Internal odds |
|---|---|
| 🌸 AI Personalized Perfume (top prize) | 5% |
| 🤝 A Warm Handshake | 20% |
| 🪭 Optimizely Fan | 25% |
| 👜 Optimizely Tote Bag | 25% |
| 💡 Optimizely Fact (no win) | 25% |

The outcome is chosen by the weighted model first, then the wheel animates to a matching slice — so the visuals always agree with the real probability, even though no percentages are displayed.

## Run it
No build step. Just open `index.html`:

```bash
open index.html            # macOS
# or serve it (recommended for fonts/audio):
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Controls
- Click **SPIN** (or press **Space**) to play.
- Press **Esc** to close the result.

## Stack
Vanilla HTML/CSS/JS, canvas-rendered wheel + confetti, WebAudio win chime. No dependencies.

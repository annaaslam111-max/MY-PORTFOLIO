# MY PORTFOLIO — Sayyoon Anthony Charles

A premium, monochrome black/silver personal portfolio site. Built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no build step. Just open `index.html`.

## Structure

```
MY-PORTFOLIO/
├── index.html
├── style.css
├── script.js
├── assets/
│   └── profile.jpg      ← placeholder, replace with your real photo
└── README.md
```

## To customize

- **Photo**: replace `assets/profile.jpg` with your real headshot (same filename, or update the `<img src>` in `index.html`).
- **Links**: search `index.html` for `YOUR-...-LINK-HERE` placeholders — the luxury project video, YouTube channel, and social link still need real URLs. All 7 chatbot/site links are already filled in.
- **Colors**: all tokens live at the top of `style.css` under `:root` (`--black`, `--silver`, `--platinum`, etc.) — change them there to restyle everything at once.
- **Copy**: section text lives directly in `index.html`, organized by section comments (`<!-- ============ ABOUT ============ -->` etc.).

## Notes

- Custom cursor auto-disables on touch devices.
- All scroll animations respect `prefers-reduced-motion`.
- Particle/canvas effects are drawn with `requestAnimationFrame` and resize responsively.

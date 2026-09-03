# ActiveShot Brand Suite

This folder is the production source of truth for the ActiveShot identity.

## Start here

- `brand-guide.md` — identity, logo, color, typography, voice, and usage rules
- `logos/svg/` — editable vector logo masters
- `logos/png/` — presentation-ready horizontal logos
- `icons/png/` — favicon, app, maskable, and social-avatar sizes
- `illustrations/png/` — illustrated logo mark, full graphic sheet, and four individual production graphics
- `social/svg/` — editable social templates
- `social/png/` — ready-to-post exports
- `copy/social-copy-kit.md` — bios, positioning copy, calls to action, and launch copy
- `tokens/active-shot.css` and `tokens/active-shot.tokens.json` — website/app design tokens
- `fonts/` — licensed Alfa Slab One and Inter font files with OFL licenses

## Primary brand assets

- Default logo on light backgrounds: `logos/svg/activeshot-logo-horizontal-light.svg`
- Default logo on dark backgrounds: `logos/svg/activeshot-logo-horizontal-dark.svg`
- Illustrated logo mark: `illustrations/png/activeshot-illustrated-mark-1024.png`
- App icon: `icons/png/activeshot-icon-512.png`
- Social avatar: `icons/png/activeshot-social-avatar-1080.png`
- Website sharing image: `social/png/website-social-card-1200x630.png`

Run `python scripts/build-brand-suite.py` from the repository root to regenerate every PNG export and refresh the live app icons.

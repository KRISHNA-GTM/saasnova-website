# Design system and content rules (Sept 2026 redesign)

## Direction
An enterprise-grade, high-energy site that tells a visitor who SaaSNova is within five seconds:
**the first operator-led GTM execution engine** for AWS, Microsoft Azure and Google Cloud marketplaces.
Buyers are SaaS ISV founders, CROs and alliance leaders. Every section answers one of their questions:
who is this, can they do it, who else trusts them, what do I buy, how do I start.

## Brand (guidelines v1.0, Feb 2026)
| Token | Value | Use |
|---|---|---|
| `--blue` | `#008BF8` | Primary: headlines, fills, icons |
| `--pink` | `#FA0F9C` | Accent: urgency, highlights |
| `--orange` | `#F19953` | Highlight: stars, secondary accents |
| `--nova` | Blue → violet → Pink | The signature thick gradient on key headline words (approved by Brand Compliance, Sept 2026) |
| `--blue-ink` / `--pink-ink` | `#0077D6` / `#D6007F` | Text-safe shades for small text and buttons (WCAG AA) |
| Font | Inter Variable, 100–900 + italics | Headlines 800–900 with tight tracking, body 400, labels 650–750 |

No serif, condensed or decorative fonts. Background tints stay at or below 15% opacity.

## Page building blocks (src/components)
- `Header`: floating white pill. Menu: Home, Solutions, About, Partners, Resources, Careers,
  Contact. **Get started** always opens the Calendly strategy session.
- `TestimonialWall`: company tabs with outcome chips and auto-rotation (pauses on hover, focus or
  click). Quotes are in the HTML, so search engines can read them.
- `ProgramCards`: Ignite, SuperNova and NovaX with What You Get, Impact and Ideal Stage, plus the
  funding-stage ladder.
- `ProgramFinder`: four-question quiz that recommends a program and then sends the visitor to
  Calendly.
- `LogoMarquee`: endless, pausable logo strips. Logos are listed in `src/data/logos.ts`.
- Surfaces: `.bg-grid` (blueprint grid), `.bg-glow` (brand glows), `.on-ink` (night-sky dark
  section), `.reveal` (fade-up on scroll).

## Content rules
- One primary action everywhere: **Book a 30-min execution strategy session** (`primaryCta`).
  Secondary actions stay on-site (programs, program finder).
- No outbound links to competitors. Marketplace links point to SaaSNova's own storefront.
- Pricing: "Every program is custom. We scope yours on a 30-minute call." Private offers are
  mentioned only as a procurement option, never as the only way to buy.
- Restricted words: consulting, advisory, recommendations, strategic guidance, strategy firm.
- Jen Dawson is the former AWS leader. Don't write "former AWS leaders" in the plural.
- Each testimonial appears on exactly one page (`page:` in `src/data/testimonials.ts`).
- Arctic Wolf and Dataminr are presented as SaaSNova case studies.

See `docs/UPDATE-PLAYBOOK.md` for how to edit and publish.

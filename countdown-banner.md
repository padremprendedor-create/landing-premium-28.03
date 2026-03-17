---
description: How to add a premium fixed countdown timer banner to a React + Tailwind landing page
---

# Countdown Timer Banner (React + Tailwind CSS v4)

Premium fixed banner with a countdown timer that sits **above** the main navigation header. Uses red neon glow, glassmorphism, flip animation, and shows an "event started" message when expired.

---

## Architecture

- **Component**: `CountdownBanner.jsx` — standalone, no external deps beyond React.
- **Styles**: Pure CSS classes added to `index.css` (no Tailwind utilities for glow/animation).
- **Integration**: Rendered as the **first child** inside the root `<div>` in `App.jsx`, before `<header>`.

---

## Key Offsets (Critical)

The banner is `position: fixed; top: 0; z-index: 9999`. The existing header is also fixed. You **must** adjust these values:

| Element | Class / Property | Value |
|---|---|---|
| Countdown banner | `z-index` | `9999` |
| Header | `top` | `top-[76px]` |
| Mobile nav panel | `top` | `top-[148px]` |
| Hero section | `padding-top` | `pt-44 md:pt-60` |
| Registro / CTA target | `scroll-mt` | `scroll-mt-40 md:scroll-mt-48` |
| `:root` CSS | `scroll-padding-top` | `160px` |

> [!IMPORTANT]
> The banner rendered height is ~60-70px. If you change padding or font sizes, re-measure and adjust the header `top` value accordingly.

---

## Component Code (`CountdownBanner.jsx`)

```jsx
import React, { useState, useEffect, useRef } from 'react';

// CHANGE THIS: Set target date in ISO 8601 with timezone offset
const TARGET_DATE = new Date('2026-03-11T18:00:00-05:00');

function getTimeRemaining() {
    const now = new Date();
    const diff = TARGET_DATE - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isExpired: false,
    };
}

function pad(n) { return String(n).padStart(2, '0'); }

function DigitCard({ value, label }) {
    const prevValue = useRef(value);
    const [flip, setFlip] = useState(false);
    useEffect(() => {
        if (value !== prevValue.current) {
            setFlip(true);
            const t = setTimeout(() => setFlip(false), 400);
            prevValue.current = value;
            return () => clearTimeout(t);
        }
    }, [value]);
    return (
        <div className="flex flex-col items-center gap-0.5 md:gap-1">
            <span className={`countdown-digit ${flip ? 'countdown-flip' : ''}`}>{pad(value)}</span>
            <span className="countdown-label">{label}</span>
        </div>
    );
}

function Separator() {
    return (
        <span className="text-red-400/60 text-lg md:text-2xl font-black self-start mt-1.5 md:mt-2 select-none animate-pulse">:</span>
    );
}

export default function CountdownBanner() {
    const [time, setTime] = useState(getTimeRemaining);
    useEffect(() => {
        const id = setInterval(() => setTime(getTimeRemaining()), 1000);
        return () => clearInterval(id);
    }, []);

    if (time.isExpired) {
        return (
            <div className="countdown-banner">
                <div className="flex items-center justify-center gap-2 animate-in">
                    <span className="text-lg md:text-xl">✨</span>
                    <p className="text-sm md:text-base font-bold tracking-wide glow-red-text">¡El evento ha comenzado!</p>
                    <span className="text-lg md:text-xl">✨</span>
                </div>
            </div>
        );
    }

    const showDays = time.days > 0;
    return (
        <div className="countdown-banner">
            <div className="flex items-center justify-center gap-1 flex-wrap">
                <span className="hidden sm:inline-block text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-red-300/80 mr-2 md:mr-4 animate-pulse">🔴 Faltan</span>
                <div className="flex items-center gap-1.5 md:gap-3">
                    {showDays && (<><DigitCard value={time.days} label="Días" /><Separator /></>)}
                    <DigitCard value={time.hours} label="Hrs" />
                    <Separator />
                    <DigitCard value={time.minutes} label="Min" />
                    <Separator />
                    <DigitCard value={time.seconds} label="Seg" />
                </div>
                <a href="#registro" className="hidden sm:inline-block ml-3 md:ml-6 text-[10px] md:text-xs font-bold uppercase tracking-wider bg-red-600/80 hover:bg-red-500 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full transition-all hover:scale-105 shadow-[0_0_12px_rgba(255,42,42,0.35)]">
                    Reserva ahora
                </a>
            </div>
        </div>
    );
}
```

---

## Required CSS (append to `index.css`)

```css
/* ─── Countdown Banner ─────────────────────────────── */
.countdown-banner {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 9999;
  padding: 8px 12px;
  background: rgba(5, 2, 15, 0.82);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(255, 42, 42, 0.30);
  box-shadow: 0 2px 24px rgba(255, 42, 42, 0.12), inset 0 -1px 0 rgba(255, 42, 42, 0.08);
}

.countdown-digit {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 40px; padding: 4px 6px; border-radius: 8px;
  background: rgba(255, 42, 42, 0.08);
  border: 1px solid rgba(255, 42, 42, 0.18);
  font-family: 'Inter', 'Montserrat', system-ui, sans-serif;
  font-weight: 800; font-size: 1.25rem; letter-spacing: 0.06em;
  color: #ff4444;
  text-shadow: 0 0 8px rgba(255,42,42,0.7), 0 0 20px rgba(255,42,42,0.4), 0 0 40px rgba(255,42,42,0.15);
}

@media (min-width: 768px) {
  .countdown-digit { min-width: 56px; padding: 6px 10px; border-radius: 10px; font-size: 1.65rem; }
}

.countdown-label {
  font-weight: 400; font-size: 0.55rem; letter-spacing: 0.12em;
  text-transform: uppercase; color: rgba(255, 130, 130, 0.55);
}

@media (min-width: 768px) { .countdown-label { font-size: 0.65rem; } }

@keyframes countdown-tick {
  0% { transform: scaleY(1); opacity: 1; }
  40% { transform: scaleY(0.85) translateY(-2px); opacity: 0.7; }
  100% { transform: scaleY(1); opacity: 1; }
}
.countdown-flip { animation: countdown-tick 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

.glow-red-text {
  color: #ff4444;
  text-shadow: 0 0 8px rgba(255,42,42,0.7), 0 0 24px rgba(255,42,42,0.4);
}
```

---

## Integration Checklist

1. Create `CountdownBanner.jsx` in `src/`.
2. Add the CSS above to `index.css`.
3. In `App.jsx`:
   - `import CountdownBanner from './CountdownBanner';`
   - Render `<CountdownBanner />` as the **first child** of the root div, before `<header>`.
   - Change header from `top-0` → `top-[76px]`.
   - Change mobile nav panel from `top-[72px]` → `top-[148px]`.
   - Increase hero `pt-20 md:pt-32` → `pt-44 md:pt-60`.
4. Update `:root { scroll-padding-top: 160px; }` in CSS.
5. Update any `scroll-mt-*` on anchor targets to `scroll-mt-40 md:scroll-mt-48`.

---

## Customization

| What | Where |
|---|---|
| **Target date** | `TARGET_DATE` constant in `CountdownBanner.jsx` |
| **Timezone** | The `-05:00` offset in the ISO string (Lima = UTC-5) |
| **Glow color** | Change `#ff4444` and `rgba(255,42,42,...)` in CSS |
| **Expired message** | The `time.isExpired` return block |
| **CTA button text** | The `<a>` tag inside the banner |
| **Labels language** | Change "Días", "Hrs", "Min", "Seg" in JSX |

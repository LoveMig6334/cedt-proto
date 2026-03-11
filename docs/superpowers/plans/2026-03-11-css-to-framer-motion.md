# CSS → Framer Motion Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all CSS keyframe animations and hover/transition effects with Framer Motion, keeping all pages as RSC by extracting animated elements into `'use client'` components.

**Architecture:** Pages remain Server Components. New `components/motion/` client components wrap animated elements. `BullLogo.tsx` gains an optional `className` prop so `AnimatedBullLogo.tsx` can strip its built-in CSS hover. `reports/page.tsx` (already `'use client'`) is updated in-place.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, framer-motion v11+

**Spec:** `docs/superpowers/specs/2026-03-11-css-to-framer-motion-design.md`

---

## Chunk 1: Setup + Motion Primitive Components

### Task 1: Install framer-motion

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
npm install framer-motion@^11
```

Expected: installs without errors, `framer-motion` appears in `package.json` dependencies.

- [ ] **Step 2: Verify import resolves**

```bash
node -e "require('framer-motion')" && echo "OK"
```

Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion v11"
```

---

### Task 2: Add `className` prop to `BullLogo.tsx`

**Files:**
- Modify: `components/BullLogo.tsx`

`BullLogo` currently has `hover:scale-110 active:scale-95 transition-transform` hardcoded on the `<svg>`. Adding an optional `className` prop (with the current value as default) lets `AnimatedBullLogo` strip those CSS classes and delegate animation to motion.

- [ ] **Step 1: Update `BullLogo.tsx` interface and svg className**

Replace the top of `components/BullLogo.tsx`:

```tsx
interface BullLogoProps {
  size?: number;
  className?: string;
}

export default function BullLogo({
  size = 48,
  className = 'drop-shadow-sm transition-transform hover:scale-110 active:scale-95',
}: BullLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
```

All SVG `<path>` content below the opening tag is unchanged.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no new errors relating to `BullLogo`.

- [ ] **Step 3: Commit**

```bash
git add components/BullLogo.tsx
git commit -m "feat: add className prop to BullLogo for motion wrapper"
```

---

### Task 3: Create `AnimatedCard.tsx`

**Files:**
- Create: `components/motion/AnimatedCard.tsx`

Generic `motion.div` card wrapper. Pages pass their existing card `className` to this component, removing `hover:-translate-y-*`, `hover:shadow-*`, and `transition-*` from the class string.

- [ ] **Step 1: Create the file**

```tsx
// components/motion/AnimatedCard.tsx
'use client';

import { motion } from 'framer-motion';

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverY?: number;
  hoverShadow?: string;
}

export function AnimatedCard({
  children,
  className,
  hoverY = -6,
  hoverShadow = '0 12px 28px rgba(0,0,0,0.08),0 4px 10px rgba(0,0,0,0.04)',
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: hoverY, boxShadow: hoverShadow }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/motion/AnimatedCard.tsx
git commit -m "feat: add AnimatedCard motion component"
```

---

### Task 4: Create `AnimatedButton.tsx`

**Files:**
- Create: `components/motion/AnimatedButton.tsx`

`motion.div` wrapper for buttons and links. When `hoverShadow` is provided, pass a matching `className` with `rounded-*` to the wrapper so the shadow follows the element's border-radius.

- [ ] **Step 1: Create the file**

```tsx
// components/motion/AnimatedButton.tsx
'use client';

import { motion } from 'framer-motion';

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };

interface AnimatedButtonProps {
  children: React.ReactNode;
  /** Apply to wrapper, e.g. 'rounded-r' when hoverShadow is used */
  className?: string;
  hoverY?: number;
  hoverShadow?: string;
}

export function AnimatedButton({
  children,
  className,
  hoverY = -2,
  hoverShadow,
}: AnimatedButtonProps) {
  return (
    <motion.div
      className={`inline-flex${className ? ` ${className}` : ''}`}
      whileHover={hoverShadow ? { y: hoverY, boxShadow: hoverShadow } : { y: hoverY }}
      transition={spring}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/motion/AnimatedButton.tsx
git commit -m "feat: add AnimatedButton motion component"
```

---

### Task 5: Create `AnimatedBullLogo.tsx`

**Files:**
- Create: `components/motion/AnimatedBullLogo.tsx`

Wraps `<BullLogo>` with motion scale. Passes `className="drop-shadow-sm"` to strip the CSS hover classes from the SVG (animation is now handled by motion).

- [ ] **Step 1: Create the file**

```tsx
// components/motion/AnimatedBullLogo.tsx
'use client';

import { motion } from 'framer-motion';
import BullLogo from '@/components/BullLogo';

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };

interface AnimatedBullLogoProps {
  size?: number;
}

export function AnimatedBullLogo({ size }: AnimatedBullLogoProps) {
  return (
    <motion.div
      className="inline-flex"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={spring}
    >
      <BullLogo size={size} className="drop-shadow-sm" />
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/motion/AnimatedBullLogo.tsx
git commit -m "feat: add AnimatedBullLogo motion component"
```

---

### Task 6: Create `QCScannerWidget.tsx`

**Files:**
- Create: `components/motion/QCScannerWidget.tsx`

Extracted from `app/(app)/qc/page.tsx`. Contains the dark scanner panel with the scan-line animation. The parent page will import and use this component instead of the inline JSX.

- [ ] **Step 1: Create the file**

```tsx
// components/motion/QCScannerWidget.tsx
'use client';

import { motion } from 'framer-motion';

export function QCScannerWidget() {
  return (
    <div
      className="bg-n-900 rounded-r p-[26px] text-center relative overflow-hidden mb-4"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg,transparent,transparent 26px,rgba(244,114,182,.035) 26px,rgba(244,114,182,.035) 27px)',
      }}
    >
      <div className="w-[130px] h-[130px] mx-auto mb-3 relative z-10">
        <div className="absolute top-0 left-0 w-[26px] h-[26px] border-t-2 border-l-2 border-p-400 rounded-[4px_0_0_0]" />
        <div className="absolute bottom-0 right-0 w-[26px] h-[26px] border-b-2 border-r-2 border-p-400 rounded-[0_0_4px_0]" />
        <div className="w-full h-full flex items-center justify-center text-[42px] bg-[rgba(244,114,182,.04)] rounded-[8px] relative overflow-hidden">
          🥩
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-p-400 to-transparent"
            animate={{ top: ['5%', '5%', '95%', '95%'], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              times: [0, 0.2, 0.8, 1],
            }}
          />
        </div>
      </div>
      <div className="text-white text-[13px] font-semibold relative z-10 mb-1">
        AI กำลังสแกน...
      </div>
      <div className="text-white/40 text-[11px] relative z-10">
        ล็อต #LP-2025-0442 — สายผลิต A
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/motion/QCScannerWidget.tsx
git commit -m "feat: add QCScannerWidget with framer-motion scan-line"
```

---

### Task 7: Create `HeroMockup.tsx`

**Files:**
- Create: `components/motion/HeroMockup.tsx`

Extracted from `app/page.tsx`. Contains the floating browser mockup with all its animations: float, popIn, scaleYUp, pulse. The `mockupKpis` and `chartBars` data arrays move here from `page.tsx`.

- [ ] **Step 1: Create the file**

```tsx
// components/motion/HeroMockup.tsx
'use client';

import { motion } from 'framer-motion';

const mockupKpis = [
  { label: 'รับวัวเข้าวันนี้', value: '24 ตัว', pink: false },
  { label: 'ผลผลิตสัปดาห์', value: '1,240 กก.', pink: true },
  { label: 'คะแนน QC', value: '94.2%', pink: false },
  { label: 'ยอดขายเดือนนี้', value: '฿2.8M', pink: true },
];

const chartBars = [44, 62, 50, 76, 58, 90, 70];

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };

export function HeroMockup() {
  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div
        className="bg-white rounded-[20px] overflow-hidden w-full max-w-[460px] shadow-[0_24px_64px_rgba(0,0,0,.13),0_8px_24px_rgba(244,114,182,.14)]"
        animate={{
          y: [0, -15, 0],
          rotateY: [-7, -5, -7],
          rotateX: [3, 4, 3],
          rotateZ: [1, 0, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{
          boxShadow:
            '0 30px 70px rgba(0,0,0,.15),0 12px 30px rgba(244,114,182,.25)',
        }}
      >
        {/* Browser bar */}
        <div className="bg-n-900 px-4 py-[10px] flex items-center gap-1.5">
          <motion.span
            className="w-[10px] h-[10px] rounded-full bg-[#FF5F57] inline-block cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={spring}
          />
          <motion.span
            className="w-[10px] h-[10px] rounded-full bg-[#FFBD2E] inline-block cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={spring}
          />
          <motion.span
            className="w-[10px] h-[10px] rounded-full bg-[#28C840] inline-block cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={spring}
          />
          <div className="flex-1 h-[21px] bg-n-700 rounded-md ml-2 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-white/[0.03]"
              animate={{ opacity: [0.03, 0.1, 0.03] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Preview body */}
        <div className="flex h-[285px]">
          {/* Mini sidebar (decorative, CSS hover OK here) */}
          <div className="w-[50px] bg-n-900 px-[7px] py-[9px] flex flex-col items-center gap-[5px]">
            <div className="w-7 h-7 bg-p-500 rounded-[7px] mb-[5px] shadow-[0_2px_8px_rgba(244,114,182,.4)]" />
            {[true, false, false, false, false, false].map((active, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-[7px] flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110 ${
                  active
                    ? 'bg-[rgba(244,114,182,.2)]'
                    : 'bg-white/[.05] hover:bg-white/10'
                }`}
              >
                <div
                  className={`w-[13px] h-[13px] rounded-[3px] transition-colors duration-300 ${
                    active
                      ? 'bg-p-400'
                      : 'bg-white/[.22] group-hover:bg-white/40'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Mini content */}
          <div className="flex-1 bg-cream p-[11px] overflow-hidden">
            <div className="text-[9.5px] font-bold text-n-800 mb-[7px] flex items-center gap-1">
              📊{' '}
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                ภาพรวมโรงงาน — FreshPro
              </motion.span>
            </div>

            <div className="grid grid-cols-2 gap-1 mb-[7px]">
              {mockupKpis.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.2 + i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                    duration: 0.6,
                  }}
                >
                  <div className="bg-white rounded-[5px] p-[6px_7px] border border-p-100 hover:border-p-300 hover:shadow-[0_2px_8px_rgba(244,114,182,.15)] hover:-translate-y-0.5 transition-all duration-300 cursor-default h-full">
                    <div className="text-[7px] text-n-500 mb-px">{kpi.label}</div>
                    <div
                      className={`text-[12.5px] font-bold ${
                        kpi.pink ? 'text-p-500' : 'text-n-900'
                      }`}
                    >
                      {kpi.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="h-[46px] bg-white rounded-[5px] p-[5px] flex items-end gap-[3px] group border border-transparent hover:border-n-200 transition-colors">
              {chartBars.map((h, i) => (
                <motion.div
                  key={i}
                  className={`flex-1 rounded-[2px_2px_0_0] cursor-pointer hover:brightness-110 hover:opacity-80 ${
                    h > 80 ? 'bg-p-500' : h > 65 ? 'bg-p-400' : 'bg-p-200'
                  }`}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                  transition={{
                    delay: 0.6 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                    duration: 0.8,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/motion/HeroMockup.tsx
git commit -m "feat: add HeroMockup with framer-motion float/popIn/scaleYUp animations"
```

---

## Chunk 2: globals.css + Sidebar + Landing + Login + Dashboard

### Task 8: Update `globals.css`

**Files:**
- Modify: `app/globals.css`

Remove the two CSS animation tokens and their `@keyframes` blocks. The scan-line is now in `QCScannerWidget`, pulse-dot was unused.

- [ ] **Step 1: Remove animation tokens and keyframes**

Remove these lines from `@theme { ... }`:
```css
--animate-pulse-dot: pulse-dot 2s infinite;
--animate-scan-line: scan-line 2s ease-in-out infinite;
```

Remove these blocks entirely:
```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.4); }
}

@keyframes scan-line {
  0%   { top: 5%;  opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { top: 95%; opacity: 0; }
}
```

The `/* Animations */` comment in `@theme` should also be removed. The file after editing should be:

```css
@import "tailwindcss";

@theme {
  /* Brand palette */
  --color-cream: #FFF9F5;
  --color-p-50: #FFF0F7;
  --color-p-100: #FCE7F3;
  --color-p-200: #FBCFE8;
  --color-p-300: #F9A8D4;
  --color-p-400: #F472B6;
  --color-p-500: #EC4899;

  /* Neutral palette */
  --color-n-900: #0F172A;
  --color-n-800: #1E293B;
  --color-n-700: #334155;
  --color-n-600: #475569;
  --color-n-500: #64748B;
  --color-n-400: #94A3B8;
  --color-n-300: #CBD5E1;
  --color-n-200: #E2E8F0;
  --color-n-100: #F1F5F9;

  /* Semantic colors */
  --color-fp-green: #10B981;
  --color-fp-yellow: #F59E0B;
  --color-fp-red: #EF4444;
  --color-fp-blue: #3B82F6;

  /* Typography defined in @theme inline below */

  /* Border radius */
  --radius-r: 12px;
  --radius-rlg: 16px;
}

@theme inline {
  --font-sans: var(--font-kodchasan), sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-thumb { background: #FBCFE8; border-radius: 3px; }
::-webkit-scrollbar-track { background: transparent; }
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "refactor: remove CSS keyframe animations from globals.css"
```

---

### Task 9: Update `Sidebar.tsx`

**Files:**
- Modify: `components/Sidebar.tsx`

Already `'use client'`. Two changes:
1. User card: `hover:bg-white/[.08] transition-colors` → `motion.div` with `whileHover={{ backgroundColor }}`
2. Nav links: remove `transition-all duration-200` (no physical animation remaining after color-only hover stays as CSS)

- [ ] **Step 1: Add motion import**

At the top of `components/Sidebar.tsx`, add:
```tsx
import { motion } from 'framer-motion';
```

- [ ] **Step 2: Update user card div**

Replace:
```tsx
<div className="flex items-center gap-[10px] p-[9px] rounded-[10px] bg-white/[.04] cursor-pointer hover:bg-white/[.08] transition-colors">
```

With:
```tsx
<motion.div
  className="flex items-center gap-[10px] p-[9px] rounded-[10px] bg-white/[.04] cursor-pointer"
  whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
>
```

Close tag changes from `</div>` to `</motion.div>`.

- [ ] **Step 3: Update nav link className**

In the `<Link>` className template literal, remove `transition-all duration-200`. The nav link still has `hover:bg-white/[.05] hover:text-white/[.78]` — these color-only hovers stay as CSS per spec. The line becomes:

```tsx
className={[
  'flex items-center gap-[10px] px-[10px] py-[9px] rounded-[10px]',
  'text-[13px] font-medium mb-0.5 relative select-none',
  isActive
    ? 'bg-[rgba(244,114,182,.14)] text-p-300'
    : 'text-white/[.42] hover:bg-white/[.05] hover:text-white/[.78]',
].join(' ')}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/Sidebar.tsx
git commit -m "refactor: migrate Sidebar user card hover to framer-motion"
```

---

### Task 10: Update `app/page.tsx` (Landing page)

**Files:**
- Modify: `app/page.tsx`

Changes:
- Remove inline `<style>` tag (floatMockup, popIn, scaleYUp keyframes)
- Remove `mockupKpis` and `chartBars` const arrays (moved to `HeroMockup`)
- Replace browser mockup JSX with `<HeroMockup />`
- Replace navbar `<BullLogo>` with `<AnimatedBullLogo>` (footer stays as plain `<BullLogo>`)
- Wrap CTA buttons with `<AnimatedButton>`
- Wrap feature cards with `<AnimatedCard>`

- [ ] **Step 1: Update imports**

Replace the existing import section at the top of `app/page.tsx`:

```tsx
import Link from 'next/link';
import BullLogo from '@/components/BullLogo';
import { AnimatedBullLogo } from '@/components/motion/AnimatedBullLogo';
import { AnimatedButton } from '@/components/motion/AnimatedButton';
import { AnimatedCard } from '@/components/motion/AnimatedCard';
import { HeroMockup } from '@/components/motion/HeroMockup';
```

- [ ] **Step 2: Remove moved data**

Delete the `mockupKpis` and `chartBars` const arrays (lines ~52–59) — they are now defined inside `HeroMockup.tsx`.

- [ ] **Step 3: Replace navbar BullLogo**

In the `<nav>` section, replace:
```tsx
<BullLogo size={42} />
```
With:
```tsx
<AnimatedBullLogo size={42} />
```

Footer `<BullLogo size={32} />` stays unchanged (decorative, no interaction needed).

- [ ] **Step 4: Remove inline `<style>` tag and wrap hero right panel**

Delete the entire `{/* ── CSS Animations ── */}` block (the `<style>` tag, lines ~136–161).

Replace the entire browser mockup `<div>` (the `animate-float-mockup` div with all its children) with:
```tsx
<HeroMockup />
```

The hero right section becomes:
```tsx
{/* Right — browser mockup */}
<div className="flex-1 flex justify-center items-center relative z-10">
  <HeroMockup />
</div>
```

- [ ] **Step 5: Wrap primary CTA buttons with AnimatedButton**

Replace the primary "เริ่มต้นใช้งานฟรี" `<Link>`:
```tsx
<AnimatedButton
  className="rounded-r"
  hoverY={-3}
  hoverShadow="0 14px 35px rgba(244,114,182,.45)"
>
  <Link
    href="/login"
    className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-r px-[34px] py-[15px] text-[15px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)]"
  >
    เริ่มต้นใช้งานฟรี
  </Link>
</AnimatedButton>
```

Replace the secondary "ชมตัวอย่างระบบ ▶" `<button>`:
```tsx
<AnimatedButton>
  <button className="bg-white text-n-800 border-2 border-n-200 rounded-r px-[34px] py-[15px] text-[15px] font-bold hover:border-p-300 hover:text-p-500">
    ชมตัวอย่างระบบ ▶
  </button>
</AnimatedButton>
```

Replace the navbar "เข้าสู่ระบบ" `<Link>`:
```tsx
<AnimatedButton>
  <Link
    href="/login"
    className="bg-white text-n-800 border-[1.5px] border-n-200 rounded-[9px] px-5 py-[9px] text-[13px] font-semibold flex items-center gap-1.5 hover:border-p-300 hover:text-p-500"
  >
    เข้าสู่ระบบ
  </Link>
</AnimatedButton>
```

- [ ] **Step 6: Wrap feature cards with AnimatedCard**

In the features grid, replace:
```tsx
<div
  key={feat.title}
  className="bg-cream border border-p-100 rounded-rlg p-[28px_22px] transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_12px_28px_rgba(0,0,0,.08),0_4px_10px_rgba(0,0,0,.04)] hover:border-p-300"
>
```

With:
```tsx
<AnimatedCard
  key={feat.title}
  className="bg-cream border border-p-100 rounded-rlg p-[28px_22px] hover:border-p-300"
  hoverY={-6}
  hoverShadow="0 12px 28px rgba(0,0,0,0.08),0 4px 10px rgba(0,0,0,0.04)"
>
```

Change the closing `</div>` to `</AnimatedCard>`.

- [ ] **Step 7: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx
git commit -m "refactor: migrate landing page animations to framer-motion"
```

---

### Task 11: Update `app/login/page.tsx`

**Files:**
- Modify: `app/login/page.tsx`

Wrap the login CTA `<Link>` with `AnimatedButton`. The link has `hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(244,114,182,.4)] transition-all` — these are removed and replaced by motion.

- [ ] **Step 1: Add import**

```tsx
import { AnimatedButton } from '@/components/motion/AnimatedButton';
```

- [ ] **Step 2: Wrap login CTA**

Replace:
```tsx
<Link
  href="/dashboard"
  className="block w-full py-[13px] bg-gradient-to-br from-p-400 to-p-500 text-white text-center rounded-r text-[15px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(244,114,182,.4)] transition-all mb-4"
>
  เข้าสู่ระบบ
</Link>
```

With:
```tsx
<AnimatedButton
  className="w-full rounded-r mb-4"
  hoverShadow="0 8px 28px rgba(244,114,182,.4)"
>
  <Link
    href="/dashboard"
    className="block w-full py-[13px] bg-gradient-to-br from-p-400 to-p-500 text-white text-center rounded-r text-[15px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)]"
  >
    เข้าสู่ระบบ
  </Link>
</AnimatedButton>
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/login/page.tsx
git commit -m "refactor: migrate login CTA to framer-motion"
```

---

### Task 12: Update `app/(app)/dashboard/page.tsx`

**Files:**
- Modify: `app/(app)/dashboard/page.tsx`

Wrap KPI cards, delivery row cards, and the "+ เพิ่มรายการ" button with motion components. "Export รายงาน" button has color-only hover (`hover:border-p-300 hover:text-p-500`) — stays CSS.

- [ ] **Step 1: Add imports**

```tsx
import { AnimatedCard } from '@/components/motion/AnimatedCard';
import { AnimatedButton } from '@/components/motion/AnimatedButton';
```

- [ ] **Step 2: Wrap "+ เพิ่มรายการ" button**

Replace:
```tsx
<button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
  + เพิ่มรายการ
</button>
```

With:
```tsx
<AnimatedButton>
  <button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
    + เพิ่มรายการ
  </button>
</AnimatedButton>
```

- [ ] **Step 3: Wrap KPI cards**

In the `{kpis.map(...)}` loop, replace:
```tsx
<div key={kpi.label} className="bg-white rounded-rlg border border-p-100 p-4 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.04)]">
```

With:
```tsx
<AnimatedCard
  key={kpi.label}
  className="bg-white rounded-rlg border border-p-100 p-4 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.04)]"
  hoverY={-4}
  hoverShadow="0 8px 20px rgba(0,0,0,0.07)"
>
```

Change the closing `</div>` to `</AnimatedCard>`.

- [ ] **Step 4: Wrap delivery row cards**

In the `{deliveries.map(...)}` loop, replace:
```tsx
<div key={d.name} className="flex items-center gap-3 p-3 border-[1.5px] border-n-100 rounded-r hover:border-p-200 hover:shadow-[0_2px_8px_rgba(0,0,0,.04)] transition-all">
```

With:
```tsx
<AnimatedCard
  key={d.name}
  className="flex items-center gap-3 p-3 border-[1.5px] border-n-100 rounded-r hover:border-p-200"
  hoverY={-2}
  hoverShadow="0 2px 8px rgba(0,0,0,0.04)"
>
```

Change the closing `</div>` to `</AnimatedCard>`.

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add "app/(app)/dashboard/page.tsx"
git commit -m "refactor: migrate dashboard animations to framer-motion"
```

---

## Chunk 3: Remaining App Pages + Reports

### Task 13: Update `app/(app)/sourcing/page.tsx`

**Files:**
- Modify: `app/(app)/sourcing/page.tsx`

Supplier cards have `hover:border-p-400 hover:shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all`. Wrap with `AnimatedCard`. The "+ สร้างใบสั่งซื้อ" button uses `AnimatedButton`.

- [ ] **Step 1: Add imports**

```tsx
import { AnimatedCard } from '@/components/motion/AnimatedCard';
import { AnimatedButton } from '@/components/motion/AnimatedButton';
```

- [ ] **Step 2: Wrap "+ สร้างใบสั่งซื้อ" button**

Replace:
```tsx
<button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
  + สร้างใบสั่งซื้อ
</button>
```

With:
```tsx
<AnimatedButton>
  <button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
    + สร้างใบสั่งซื้อ
  </button>
</AnimatedButton>
```

- [ ] **Step 3: Wrap supplier cards**

In `{suppliers.map((sup, i) => ...)}`, replace:
```tsx
<div key={sup.name} className={`bg-white border-[1.5px] rounded-r p-[15px] transition-all cursor-pointer hover:border-p-400 hover:shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 ${i === 0 ? 'border-p-500 bg-p-50' : 'border-p-100'}`}>
```

With:
```tsx
<AnimatedCard
  key={sup.name}
  className={`bg-white border-[1.5px] rounded-r p-[15px] cursor-pointer hover:border-p-400 ${i === 0 ? 'border-p-500 bg-p-50' : 'border-p-100'}`}
  hoverY={-2}
  hoverShadow="0 4px 20px rgba(244,114,182,0.25)"
>
```

Change the closing `</div>` to `</AnimatedCard>`.

- [ ] **Step 4: Type-check and commit**

```bash
npx tsc --noEmit
git add "app/(app)/sourcing/page.tsx"
git commit -m "refactor: migrate sourcing page animations to framer-motion"
```

---

### Task 14: Update `app/(app)/intake/page.tsx`

**Files:**
- Modify: `app/(app)/intake/page.tsx`

Two buttons with `hover:-translate-y-0.5 transition-all`: the header "+ บันทึกรับเข้าใหม่" and the form "บันทึกรับเข้า". Table rows use `hover:[&>td]:bg-p-50` — stays CSS.

- [ ] **Step 1: Add import**

```tsx
import { AnimatedButton } from '@/components/motion/AnimatedButton';
```

- [ ] **Step 2: Wrap header button**

Replace:
```tsx
<button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
  + บันทึกรับเข้าใหม่
</button>
```

With:
```tsx
<AnimatedButton>
  <button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
    + บันทึกรับเข้าใหม่
  </button>
</AnimatedButton>
```

- [ ] **Step 3: Wrap form submit button**

Replace:
```tsx
<button className="w-full py-[13px] bg-gradient-to-br from-p-400 to-p-500 text-white rounded-r text-[15px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
  บันทึกรับเข้า
</button>
```

With:
```tsx
<AnimatedButton className="w-full rounded-r">
  <button className="w-full py-[13px] bg-gradient-to-br from-p-400 to-p-500 text-white rounded-r text-[15px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
    บันทึกรับเข้า
  </button>
</AnimatedButton>
```

- [ ] **Step 4: Type-check and commit**

```bash
npx tsc --noEmit
git add "app/(app)/intake/page.tsx"
git commit -m "refactor: migrate intake page buttons to framer-motion"
```

---

### Task 15: Update `app/(app)/production/page.tsx`

**Files:**
- Modify: `app/(app)/production/page.tsx`

KPI cards (no hover currently — no change), production line cards (no hover), the header button, and the "เบิกวัตถุดิบ" button.

Looking at the actual file: KPI cards and production line cards do NOT have hover classes — they are static cards. Only the buttons have `hover:-translate-y-0.5 transition-all`.

- [ ] **Step 1: Add import**

```tsx
import { AnimatedButton } from '@/components/motion/AnimatedButton';
```

- [ ] **Step 2: Wrap "+ เริ่มสายการผลิต" button**

Replace:
```tsx
<button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
  + เริ่มสายการผลิต
</button>
```

With:
```tsx
<AnimatedButton>
  <button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
    + เริ่มสายการผลิต
  </button>
</AnimatedButton>
```

- [ ] **Step 3: Wrap "เบิกวัตถุดิบ" button**

Replace:
```tsx
<button className="w-full py-2.5 border-2 border-p-200 text-p-500 rounded-r text-[13px] font-semibold hover:bg-p-50 transition-all">
  เบิกวัตถุดิบ
</button>
```

This button only has `hover:bg-p-50` (color/background change) — a color-only hover per spec. It stays as CSS, no motion wrapper needed. Remove only `transition-all`:

```tsx
<button className="w-full py-2.5 border-2 border-p-200 text-p-500 rounded-r text-[13px] font-semibold hover:bg-p-50">
  เบิกวัตถุดิบ
</button>
```

- [ ] **Step 4: Type-check and commit**

```bash
npx tsc --noEmit
git add "app/(app)/production/page.tsx"
git commit -m "refactor: migrate production page button to framer-motion"
```

---

### Task 16: Update `app/(app)/qc/page.tsx`

**Files:**
- Modify: `app/(app)/qc/page.tsx`

Replace inline scanner widget JSX with `<QCScannerWidget />`. Wrap the two buttons with `AnimatedButton`. Table rows use `hover:[&>td]:bg-p-50` — stays CSS.

- [ ] **Step 1: Add imports**

```tsx
import { QCScannerWidget } from '@/components/motion/QCScannerWidget';
import { AnimatedButton } from '@/components/motion/AnimatedButton';
```

- [ ] **Step 2: Replace scanner widget**

Delete the entire `{/* Scanner widget */}` block (the dark `bg-n-900` div with the scan-line, lines ~36–48). Replace with:

```tsx
<QCScannerWidget />
```

- [ ] **Step 3: Wrap "+ สแกนล็อตใหม่" button**

Replace:
```tsx
<button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
  + สแกนล็อตใหม่
</button>
```

With:
```tsx
<AnimatedButton>
  <button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
    + สแกนล็อตใหม่
  </button>
</AnimatedButton>
```

- [ ] **Step 4: Wrap "อนุมัติล็อตนี้" button**

Replace:
```tsx
<button className="w-full py-2.5 bg-gradient-to-br from-p-400 to-p-500 text-white rounded-r text-[13px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
  อนุมัติล็อตนี้
</button>
```

With:
```tsx
<AnimatedButton className="w-full rounded-r">
  <button className="w-full py-2.5 bg-gradient-to-br from-p-400 to-p-500 text-white rounded-r text-[13px] font-bold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
    อนุมัติล็อตนี้
  </button>
</AnimatedButton>
```

- [ ] **Step 5: Type-check and commit**

```bash
npx tsc --noEmit
git add "app/(app)/qc/page.tsx"
git commit -m "refactor: migrate qc page to framer-motion (scanner widget + buttons)"
```

---

### Task 17: Update `app/(app)/warehouse/page.tsx`

**Files:**
- Modify: `app/(app)/warehouse/page.tsx`

KPI cards have no hover. Only the header button has `hover:-translate-y-0.5 transition-all`. Table rows use `hover:[&>td]:bg-p-50` — stays CSS.

- [ ] **Step 1: Add import**

```tsx
import { AnimatedButton } from '@/components/motion/AnimatedButton';
```

- [ ] **Step 2: Wrap "+ เพิ่มสินค้าคลัง" button**

Replace:
```tsx
<button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
  + เพิ่มสินค้าคลัง
</button>
```

With:
```tsx
<AnimatedButton>
  <button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
    + เพิ่มสินค้าคลัง
  </button>
</AnimatedButton>
```

- [ ] **Step 3: Type-check and commit**

```bash
npx tsc --noEmit
git add "app/(app)/warehouse/page.tsx"
git commit -m "refactor: migrate warehouse page button to framer-motion"
```

---

### Task 18: Update `app/(app)/sales/page.tsx`

**Files:**
- Modify: `app/(app)/sales/page.tsx`

KPI cards have no hover. The "+ สร้างออร์เดอร์" button has `hover:-translate-y-0.5 transition-all`. "Export" button has color-only hover — stays CSS. Table rows stay CSS.

- [ ] **Step 1: Add import**

```tsx
import { AnimatedButton } from '@/components/motion/AnimatedButton';
```

- [ ] **Step 2: Wrap "+ สร้างออร์เดอร์" button**

Replace:
```tsx
<button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)] hover:-translate-y-0.5 transition-all">
  + สร้างออร์เดอร์
</button>
```

With:
```tsx
<AnimatedButton>
  <button className="bg-gradient-to-br from-p-400 to-p-500 text-white rounded-[9px] px-5 py-[10px] text-[13px] font-semibold shadow-[0_4px_20px_rgba(244,114,182,.25)]">
    + สร้างออร์เดอร์
  </button>
</AnimatedButton>
```

- [ ] **Step 3: Type-check and commit**

```bash
npx tsc --noEmit
git add "app/(app)/sales/page.tsx"
git commit -m "refactor: migrate sales page button to framer-motion"
```

---

### Task 19: Update `app/(app)/reports/page.tsx`

**Files:**
- Modify: `app/(app)/reports/page.tsx`

Already `'use client'`. Three changes:
1. Remove inline `<style>` tag + `animate-fade-in-up` className → motion entrance animation
2. KPI cards: `hover:border-p-300 hover:shadow-xl hover:shadow-p-500/5 transition-all duration-300` + `group-hover:scale-125` blob → motion variants
3. Remove `style={{ animationDelay }}` from KPI cards (no longer needed)
4. Chart bar `transition-all duration-700 ease-out` and progress bar `transition-all duration-1000` are data-driven → stay CSS
5. Table row `hover:bg-cream transition-colors` — color-only → stays CSS

- [ ] **Step 1: Add motion import**

```tsx
import { motion } from 'framer-motion';
```

- [ ] **Step 2: Remove inline `<style>` tag and replace root div**

Delete the entire `<style>` block (lines 88–96).

Replace:
```tsx
<div className="animate-fade-in-up">
```

With:
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
```

Change the closing `</div>` at the bottom of the component to `</motion.div>`.

- [ ] **Step 3: Migrate KPI card hover to motion variants**

In `{data.kpis.map((kpi, i) => ...)}`, replace the static `<div>`:
```tsx
<div
  key={kpi.label}
  className="bg-white border border-p-100 p-5 rounded-rlg relative overflow-hidden group hover:border-p-300 hover:shadow-xl hover:shadow-p-500/5 transition-all duration-300"
  style={{ animationDelay: `${i * 100}ms` }}
>
  <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br transition-all duration-500 group-hover:scale-125 ${kpi.up ? 'from-p-50 to-p-100' : 'from-n-50 to-n-100'}`} />
```

With motion variants:
```tsx
<motion.div
  key={kpi.label}
  className="bg-white border border-p-100 p-5 rounded-rlg relative overflow-hidden"
  whileHover="hover"
  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
>
  <motion.div
    className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${kpi.up ? 'from-p-50 to-p-100' : 'from-n-50 to-n-100'}`}
    variants={{ hover: { scale: 1.25 } }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
  />
```

Change the closing `</div>` of the card to `</motion.div>`.

Note: `whileHover` on a parent propagates to children that declare `variants` with matching key names. The border and shadow hover effects (`hover:border-p-300 hover:shadow-xl`) are color-only per spec and can stay as CSS classes — add them back: `className="bg-white border border-p-100 p-5 rounded-rlg relative overflow-hidden hover:border-p-300 hover:shadow-xl hover:shadow-p-500/5"`.

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add "app/(app)/reports/page.tsx"
git commit -m "refactor: migrate reports page animations to framer-motion"
```

---

### Task 20: Final verification

- [ ] **Step 1: Full build check**

```bash
npm run build
```

Expected: build completes with no TypeScript errors and no missing module errors.

- [ ] **Step 2: Start dev server and visually verify each page**

```bash
npm run dev
```

Navigate to and verify animations on:
- `/` — hero mockup floats, KPI cards pop in, bars scale up, BullLogo scales on hover
- `/login` — CTA button lifts on hover
- `/dashboard` — KPI cards lift, delivery cards lift, main button lifts
- `/sourcing` — supplier cards lift with pink shadow
- `/intake` — buttons lift
- `/production` — header button lifts
- `/qc` — scan-line animates, buttons lift
- `/warehouse` — header button lifts
- `/sales` — header button lifts
- `/reports` — page fades in on load, KPI cards lift with blob scale, entrance animation plays

- [ ] **Step 3: Verify no `animate-scan-line` or `animate-pulse-dot` classes remain in source**

```bash
grep -r "animate-scan-line\|animate-pulse-dot\|animate-float-mockup\|animate-pop-in\|animate-scale-up\|animate-fade-in-up" app components --include="*.tsx" --include="*.css"
```

Expected: no output (all removed).

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup — verify framer-motion migration complete"
```

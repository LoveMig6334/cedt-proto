# CSS → Framer Motion Migration Design

**Date:** 2026-03-11
**Project:** FreshPro (cedt-proto)
**Scope:** Migrate all CSS keyframe animations and hover/transition effects to Framer Motion (`framer-motion` v11+), preserving RSC architecture via client component extraction.

---

## 1. Goal

Replace all CSS-based animation in the FreshPro Next.js app with Framer Motion equivalents. Maintain Next.js App Router RSC architecture — pages stay as Server Components; animated elements are extracted into small `'use client'` wrapper components.

---

## 2. Architecture

### Principle
Pages remain Server Components. Animated elements are extracted into dedicated `'use client'` components in `components/motion/`. Existing `'use client'` components (`Sidebar.tsx`, `reports/page.tsx`) are updated in-place. `BullLogo.tsx` remains a Server Component — a new `AnimatedBullLogo.tsx` client wrapper is created for call sites that need the hover animation.

### New components

| File | Purpose |
|------|---------|
| `components/motion/AnimatedCard.tsx` | Generic card wrapper with `whileHover` lift + shadow |
| `components/motion/AnimatedButton.tsx` | `motion.div` wrapper for buttons/links with `whileHover` lift; children (`<button>`, `<Link>`) are nested inside |
| `components/motion/AnimatedRow.tsx` | Table `<tr>` wrapper using CSS `hover:[&>td]:bg-p-50` — kept as CSS (motion cannot replicate child-selector cascading on `<tr>` → `<td>`); this component is a thin semantic wrapper only |
| `components/motion/HeroMockup.tsx` | Full browser mockup with float, popIn, scaleYUp, pulse, dot-hover animations |
| `components/motion/QCScannerWidget.tsx` | Scan-line animation widget |
| `components/motion/AnimatedBullLogo.tsx` | `'use client'` wrapper rendering `<BullLogo>` inside a `motion.div` with `whileHover`/`whileTap`; replaces `<BullLogo>` at the **navbar** in `app/page.tsx` (line 67) and in `components/Sidebar.tsx`; the **footer** `<BullLogo>` in `app/page.tsx` (line 284) is decorative and stays as the plain RSC import |

### Updated existing components
- `components/Sidebar.tsx` — nav link hover/active transitions → motion (already `'use client'`)
- `app/(app)/reports/page.tsx` — already `'use client'`; inline `<style>` tag removed, keyframe replaced with motion entrance; KPI card hovers → motion; `group-hover:scale-125` → motion variants

### `AnimatedButton` composition pattern
`AnimatedButton` renders a `motion.div` wrapper; `<button>` or `<Link>` elements are passed as children:
```tsx
// Usage with Link:
<AnimatedButton whileHoverY={-2} shadowClass="...">
  <Link href="/dashboard" className="block w-full ...">เข้าสู่ระบบ</Link>
</AnimatedButton>

// Usage with button:
<AnimatedButton whileHoverY={-2}>
  <button className="...">+ เพิ่มรายการ</button>
</AnimatedButton>
```

---

## 3. Animation Mapping

### Transition config
- **Interactive hover/tap** (`whileHover`, `whileTap`): `{ type: "spring", stiffness: 300, damping: 25 }`
- **Entrance animations** (`initial`/`animate` keyframes): `{ ease: [0.16, 1, 0.3, 1], duration: N }` — do NOT use spring for keyframe arrays
- **Looping keyframes**: `{ duration: N, repeat: Infinity, ease: "easeInOut" }` or `"linear"` as noted per animation

### Keyframe animations → Motion

| Animation | Location | Motion implementation |
|-----------|---------|----------------------|
| `floatMockup` (6s infinite 3D float) | `HeroMockup.tsx` | Wrap mockup in a parent `<div style={{ perspective: "1000px" }}>`. Then: `animate={{ y: [0, -15, 0], rotateY: [-7, -5, -7], rotateX: [3, 4, 3], rotateZ: [1, 0, 1] }}` `transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}` |
| `popIn` (entrance + stagger per KPI card) | `HeroMockup.tsx` | `initial={{ opacity: 0, y: 15, scale: 0.95 }}` `animate={{ opacity: 1, y: 0, scale: 1 }}` `transition={{ delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1], duration: 0.6 }}` |
| `scaleYUp` (bar entrance + stagger) | `HeroMockup.tsx` | `initial={{ scaleY: 0, opacity: 0 }}` `animate={{ scaleY: 1, opacity: 1 }}` `style={{ height: \`${h}%\`, transformOrigin: "bottom" }}` `transition={{ delay: 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1], duration: 0.8 }}` |
| `scan-line` (2s infinite top sweep) | `QCScannerWidget.tsx` | `animate={{ top: ["5%", "5%", "95%", "95%"], opacity: [0, 1, 1, 0] }}` `transition={{ duration: 2, repeat: Infinity, ease: "linear", times: [0, 0.2, 0.8, 1] }}` |
| `animate-pulse` (URL bar shimmer overlay) | `HeroMockup.tsx` | `animate={{ opacity: [0.03, 0.1, 0.03] }}` `transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}` — applied to the `motion.div` shimmer overlay inside the address bar |
| `animate-pulse` (header text) | `HeroMockup.tsx` | `animate={{ opacity: [1, 0.4, 1] }}` `transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}` — applied to `motion.span` wrapping the `ภาพรวมโรงงาน` text |
| `fadeInUp` (reports page entrance, `app/(app)/reports/page.tsx`) | `reports/page.tsx` | Remove inline `<style>`, replace `className="animate-fade-in-up"` on root `<div>` with `motion.div` `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}` `transition={{ duration: 0.4, ease: "easeOut" }}` |

### Hover/transition → Motion

| Tailwind class | Motion prop | Notes |
|----------------|-------------|-------|
| `hover:-translate-y-0.5 transition-all` | `whileHover={{ y: -2 }}` | |
| `hover:-translate-y-[3px] transition-all` | `whileHover={{ y: -3 }}` | Landing page CTA |
| `hover:-translate-y-[6px] transition-all` | `whileHover={{ y: -6 }}` | Feature cards |
| `hover:shadow-[...] transition-shadow` | `whileHover={{ boxShadow: "..." }}` | Include the full shadow value verbatim |
| `hover:shadow-[0_30px_70px_...] transition-shadow duration-700` | `whileHover={{ boxShadow: "..." }}` | HeroMockup wrapper |
| `hover:scale-110 active:scale-95` | `whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}` | `AnimatedBullLogo` only |
| `hover:scale-110 transition-transform` (browser dots) | `whileHover={{ scale: 1.1 }}` | Three traffic-light `motion.span` in `HeroMockup`; no `whileTap` |
| `hover:bg-white/[.08] transition-colors` | `whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}` | Sidebar user card |
| `hover:border-p-300 hover:shadow-xl hover:shadow-p-500/5 transition-all duration-300` | `whileHover={{ borderColor: "#F9A8D4", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(236,72,153,0.05)" }}` | Reports KPI cards |
| `group-hover:scale-125` (reports KPI decorative blob) | Motion variants: parent card uses `whileHover="hover"`, blob child uses `variants={{ hover: { scale: 1.25 } }}` | Reports KPI card |

**What stays as CSS:** Color-only transitions (`hover:text-p-500`, `hover:border-p-300`, `focus:border-p-400`, `hover:bg-cream`, `hover:brightness-95`), focus ring shadows on inputs, `transition-all duration-1000 ease-out` on data-driven progress bar widths (triggered by React re-render on period change, not user interaction), and `hover:[&>td]:bg-p-50` on table rows (CSS child-selector cascade cannot be replicated with motion on `<tr>`).

### HeroMockup skeletal structure
```tsx
// components/motion/HeroMockup.tsx
'use client';
export function HeroMockup() {
  return (
    <div style={{ perspective: "1000px" }}>             {/* perspective parent */}
      <motion.div
        className="bg-white rounded-[20px] ..."
        animate={{ y: [0,-15,0], rotateY: [-7,-5,-7], rotateX: [3,4,3], rotateZ: [1,0,1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ boxShadow: "0 30px 70px ..." }}
      >
        {/* Browser bar */}
        <div className="bg-n-900 ...">
          <motion.span whileHover={{ scale: 1.1 }} />  {/* red dot */}
          <motion.span whileHover={{ scale: 1.1 }} />  {/* yellow dot */}
          <motion.span whileHover={{ scale: 1.1 }} />  {/* green dot */}
          <div className="... relative overflow-hidden">
            <motion.div                                  {/* shimmer pulse */}
              animate={{ opacity: [0.03, 0.1, 0.03] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Preview body */}
        <div className="flex h-[285px]">
          {/* Mini sidebar (static, no animation) */}
          ...
          {/* Mini content */}
          <div className="flex-1 bg-cream p-[11px]">
            <div className="text-[9.5px] ...">
              📊 <motion.span                            {/* pulsing text */}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >ภาพรวมโรงงาน — FreshPro</motion.span>
            </div>
            <div className="grid grid-cols-2 gap-1 mb-[7px]">
              {mockupKpis.map((kpi, i) => (
                <motion.div                              {/* popIn per card */}
                  key={kpi.label}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.15, ease: [0.16,1,0.3,1], duration: 0.6 }}
                >
                  ...
                </motion.div>
              ))}
            </div>
            <div className="h-[46px] bg-white ...">
              {chartBars.map((h, i) => (
                <motion.div                              {/* scaleYUp per bar */}
                  key={i}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  style={{ height: `${h}%`, transformOrigin: "bottom" }}  {/* height + origin on same style prop */}
                  transition={{ delay: 0.6 + i * 0.08, ease: [0.16,1,0.3,1], duration: 0.8 }}
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

---

## 4. Files Changed

### New files
```
components/motion/AnimatedCard.tsx
components/motion/AnimatedButton.tsx
components/motion/AnimatedRow.tsx        (thin semantic wrapper; hover stays CSS)
components/motion/HeroMockup.tsx
components/motion/QCScannerWidget.tsx
components/motion/AnimatedBullLogo.tsx
```

### Modified files
```
package.json                              add framer-motion@^11 dependency
components/Sidebar.tsx                    nav link hover → motion (already 'use client')
app/globals.css                           remove pulse-dot + scan-line keyframes and @theme entries
app/page.tsx                              use HeroMockup, AnimatedBullLogo, AnimatedButton, AnimatedCard
app/login/page.tsx                        use AnimatedButton for CTA Link
app/(app)/dashboard/page.tsx              use AnimatedCard (KPI + delivery cards), AnimatedButton
app/(app)/intake/page.tsx                 use AnimatedButton; table row hover stays CSS
app/(app)/production/page.tsx             use AnimatedCard, AnimatedButton
app/(app)/qc/page.tsx                     use QCScannerWidget, AnimatedButton; table row hover stays CSS
app/(app)/sourcing/page.tsx               use AnimatedCard, AnimatedButton
app/(app)/warehouse/page.tsx              use AnimatedCard, AnimatedButton
app/(app)/sales/page.tsx                  use AnimatedCard, AnimatedButton
app/(app)/reports/page.tsx                remove inline <style>, entrance animation → motion,
                                          KPI card hover → motion variants (already 'use client')
```

### Unchanged
`components/BullLogo.tsx` (stays RSC), `components/Topbar.tsx`, all layout and config files.

---

## 5. Cleanup

- Remove `--animate-pulse-dot` and `--animate-scan-line` from `@theme` in `globals.css`
- Remove `@keyframes pulse-dot` and `@keyframes scan-line` from `globals.css`
- Remove inline `<style>` tag from `app/page.tsx` (floatMockup, popIn, scaleYUp)
- Remove inline `<style>` tag from `app/(app)/reports/page.tsx` (fadeInUp)
- Remove `transition-*` and `hover:translate-*` Tailwind classes from elements whose animations are now handled by motion
- Remove `hover:scale-110 transition-transform` from the three browser-dot `<span>` elements in `app/page.tsx` (now `motion.span` in `HeroMockup.tsx`)
- Remove `animate-float-mockup`, `animate-pop-in`, `animate-scale-up`, `animate-pulse` from `app/page.tsx`
- Remove `animate-fade-in-up` and `style={{ animationDelay }}` from `app/(app)/reports/page.tsx`

---

## 6. Out of Scope

- No routing changes
- No new pages or features
- No changes to data, types, or server logic
- Color-only CSS transitions remain as Tailwind utilities
- Data-driven progress bar width transitions (reports + dashboard QC bars) remain as CSS `transition-all`
- `hover:[&>td]:bg-p-50` table row hovers remain as CSS

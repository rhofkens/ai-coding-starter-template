# Design System Reference

This document is the single source of truth for all frontend design decisions. Reference it when building new components, refactoring existing ones, or reviewing UI code. The design system is based on **shadcn/ui Nova style** with an **Indigo** primary color, **Stone** neutral palette, and **OKLCH** color space.

---

## 1. Design Identity

| Property | Value |
| -------- | ----- |
| Style | shadcn/ui **Nova** (compact, dense) |
| Component primitives | **Radix UI** |
| Primary hue | Indigo (~277 on OKLCH) |
| Neutral base | Stone (warm gray, hue ~49-58) |
| Color space | OKLCH (perceptually uniform) |
| Font | **Noto Sans** (variable, weights 100-900) |
| Icon library | Lucide React |
| Dark mode | Class-based (`.dark` on ancestor) |
| RTL support | Enabled (logical properties throughout) |
| Tailwind version | v4 (CSS-first configuration) |
| Border radius base | 0.625rem (10px) |

### Design Principles

1. **Compact density** -- Nova style uses smaller touch targets (h-8 default buttons, h-7 small) suited for data-heavy application UIs
2. **Soft destructive** -- destructive actions use translucent tinted backgrounds (`bg-destructive/10`), never solid red
3. **No hover animations** -- no `scale`, `shadow-lg` on hover. Interactions use subtle color shifts only
4. **Ring borders on containers** -- cards, dialogs, and popovers use `ring-1 ring-foreground/10` instead of `border`
5. **Translucent dark mode** -- dark mode inputs use `dark:bg-input/30`, not solid backgrounds
6. **Logical properties** -- always use `ps-`/`pe-`/`ms-`/`me-` instead of `pl-`/`pr-`/`ml-`/`mr-`

---

## 2. Color Palette

All colors use the **OKLCH** color space: `oklch(lightness chroma hue)`.

### 2.1 Semantic Tokens -- Light Mode (`:root`)

| Token | OKLCH Value | Usage |
| ----- | ----------- | ----- |
| `--background` | `oklch(1 0 0)` | Page background (pure white) |
| `--foreground` | `oklch(0.147 0.004 49.25)` | Primary text (near-black, warm) |
| `--card` | `oklch(1 0 0)` | Card backgrounds |
| `--card-foreground` | `oklch(0.147 0.004 49.25)` | Card text |
| `--popover` | `oklch(1 0 0)` | Dropdown/popover backgrounds |
| `--popover-foreground` | `oklch(0.147 0.004 49.25)` | Dropdown/popover text |
| **`--primary`** | **`oklch(0.51 0.23 277)`** | **Primary actions, links (Indigo)** |
| `--primary-foreground` | `oklch(0.96 0.02 272)` | Text on primary backgrounds |
| `--secondary` | `oklch(0.967 0.001 286.375)` | Secondary backgrounds (very light blue-gray) |
| `--secondary-foreground` | `oklch(0.21 0.006 285.885)` | Text on secondary backgrounds |
| `--muted` | `oklch(0.97 0.001 106.424)` | Muted backgrounds (very light warm gray) |
| `--muted-foreground` | `oklch(0.553 0.013 58.071)` | Muted/secondary text |
| **`--accent`** | **`oklch(0.51 0.23 277)`** | **Accent highlights (same as primary)** |
| `--accent-foreground` | `oklch(0.96 0.02 272)` | Text on accent backgrounds |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Error/destructive actions (red) |
| `--border` | `oklch(0.923 0.003 48.717)` | Default border color (light warm gray) |
| `--input` | `oklch(0.923 0.003 48.717)` | Input border color (same as border) |
| `--ring` | `oklch(0.709 0.01 56.259)` | Focus ring color (medium warm gray) |

### 2.2 Semantic Tokens -- Dark Mode (`.dark`)

| Token | OKLCH Value | Notes |
| ----- | ----------- | ----- |
| `--background` | `oklch(0.147 0.004 49.25)` | Dark page background |
| `--foreground` | `oklch(0.985 0.001 106.423)` | Light text |
| `--card` | `oklch(0.216 0.006 56.043)` | Elevated dark surface |
| `--card-foreground` | `oklch(0.985 0.001 106.423)` | Light text on cards |
| `--popover` | `oklch(0.216 0.006 56.043)` | Same as card |
| `--popover-foreground` | `oklch(0.985 0.001 106.423)` | Light text |
| **`--primary`** | **`oklch(0.59 0.20 277)`** | **Brighter indigo for dark backgrounds** |
| `--primary-foreground` | `oklch(0.96 0.02 272)` | Unchanged |
| `--secondary` | `oklch(0.274 0.006 286.033)` | Dark blue-gray |
| `--secondary-foreground` | `oklch(0.985 0 0)` | Near-white |
| `--muted` | `oklch(0.268 0.007 34.298)` | Dark warm gray |
| `--muted-foreground` | `oklch(0.709 0.01 56.259)` | Medium gray |
| **`--accent`** | **`oklch(0.59 0.20 277)`** | **Same as dark primary** |
| `--accent-foreground` | `oklch(0.96 0.02 272)` | Light |
| `--destructive` | `oklch(0.704 0.191 22.216)` | Lighter red for dark bg |
| `--border` | `oklch(1 0 0 / 10%)` | White at 10% opacity |
| `--input` | `oklch(1 0 0 / 15%)` | White at 15% opacity |
| `--ring` | `oklch(0.553 0.013 58.071)` | Medium warm gray |

**Key dark mode rule:** Primary indigo shifts from lightness **0.51** (light mode) to **0.59** (dark mode) with slightly lower chroma (0.23 → 0.20). This ensures proper contrast on dark backgrounds without looking washed out.

### 2.3 Chart Colors (Indigo Gradient)

Same in both light and dark mode:

| Token | OKLCH Value | Description |
| ----- | ----------- | ----------- |
| `--chart-1` | `oklch(0.79 0.10 275)` | Lightest indigo |
| `--chart-2` | `oklch(0.68 0.16 277)` | Light indigo |
| `--chart-3` | `oklch(0.59 0.20 277)` | Medium indigo |
| `--chart-4` | `oklch(0.51 0.23 277)` | Base indigo (= primary) |
| `--chart-5` | `oklch(0.46 0.21 277)` | Dark indigo |

### 2.4 Sidebar Tokens

| Token | Light | Dark |
| ----- | ----- | ---- |
| `--sidebar` | `oklch(0.985 0.001 106.423)` | `oklch(0.216 0.006 56.043)` |
| `--sidebar-foreground` | `oklch(0.147 0.004 49.25)` | `oklch(0.985 0.001 106.423)` |
| `--sidebar-primary` | `oklch(0.51 0.23 277)` | `oklch(0.68 0.16 277)` |
| `--sidebar-primary-foreground` | `oklch(0.96 0.02 272)` | `oklch(0.96 0.02 272)` |
| `--sidebar-accent` | `oklch(0.51 0.23 277)` | `oklch(0.59 0.20 277)` |
| `--sidebar-accent-foreground` | `oklch(0.96 0.02 272)` | `oklch(0.96 0.02 272)` |
| `--sidebar-border` | `oklch(0.923 0.003 48.717)` | `oklch(1 0 0 / 10%)` |
| `--sidebar-ring` | `oklch(0.709 0.01 56.259)` | `oklch(0.553 0.013 58.071)` |

---

## 3. Typography

### Font Family

**Primary:** Noto Sans (variable font, weights 100-900)

```css
@theme inline {
    --font-sans: 'Noto Sans Variable', sans-serif;
}
```

Install via npm: `@fontsource-variable/noto-sans`

Import in CSS:

```css
@import "@fontsource-variable/noto-sans";
```

### Type Scale

The design system uses Tailwind's default type scale. Key sizes used in components:

| Class | Size | Usage |
| ----- | ---- | ----- |
| `text-xs` | 0.75rem (12px) | Badges, button xs, dropdown labels, shortcuts |
| `text-[0.8rem]` | 0.8rem (12.8px) | Button sm |
| `text-sm` | 0.875rem (14px) | Default body text, inputs, buttons, menu items, field descriptions |
| `text-base` | 1rem (16px) | Card titles, dialog titles, mobile input text |
| `text-lg` | -- | Headings (use sparingly) |

### Font Weights

| Class | Weight | Usage |
| ----- | ------ | ----- |
| `font-normal` | 400 | Body text, descriptions, field errors |
| `font-medium` | 500 | Buttons, labels, badges, card titles, dialog titles |

### Responsive Text

Inputs and textareas use `text-base md:text-sm` — larger on mobile for better touch targets, smaller on desktop for density.

---

## 4. Spacing and Radius

### Border Radius Scale

Base: `--radius: 0.625rem` (10px)

| Token | Calculation | Resolved | Usage |
| ----- | ----------- | -------- | ----- |
| `--radius-sm` | `var(--radius) - 4px` | 6px | Small buttons (xs) |
| `--radius-md` | `var(--radius) - 2px` | 8px | Small buttons (sm), select sm |
| `--radius-lg` | `var(--radius)` | 10px | Default buttons, inputs, selects |
| `--radius-xl` | `var(--radius) + 4px` | 14px | Cards, dialogs, alert-dialogs |
| `--radius-2xl` | `var(--radius) + 8px` | 18px | -- |
| `--radius-3xl` | `var(--radius) + 12px` | 22px | -- |
| `--radius-4xl` | `var(--radius) + 16px` | 26px | Badges (pill shape) |

### Component-Specific Radius Mapping

| Component | Radius Class | Resolved |
| --------- | ------------ | -------- |
| Button (default, lg) | `rounded-lg` | 10px |
| Button (sm) | `rounded-[min(var(--radius-md),12px)]` | 8px |
| Button (xs) | `rounded-[min(var(--radius-md),10px)]` | 8px |
| Card | `rounded-xl` | 14px |
| Alert Dialog | `rounded-xl` | 14px |
| Input, Textarea, Select | `rounded-lg` | 10px |
| Dropdown menu content | `rounded-lg` | 10px |
| Dropdown menu item | `rounded-md` | 8px |
| Badge | `rounded-4xl` | 26px (pill) |

### Key Spacing Patterns

| Pattern | Value | Used In |
| ------- | ----- | ------- |
| Default padding | `px-2.5` | Buttons, inputs |
| Card padding | `py-4 px-4` | Card container and content |
| Card padding (sm) | `py-3 px-3` | Card with `size="sm"` |
| Menu item padding | `px-1.5 py-1` | Dropdown items, select items |
| Component gaps | `gap-1.5` | Buttons, select triggers, menu items |
| Layout gaps | `gap-4` | Cards, field sets, dialogs |

---

## 5. Component Patterns

### 5.1 Button

**Heights:**

| Size | Height | Icon-only |
| ---- | ------ | --------- |
| `xs` | 24px (`h-6`) | 24x24 (`size-6`) |
| `sm` | 28px (`h-7`) | 28x28 (`size-7`) |
| `default` | 32px (`h-8`) | 32x32 (`size-8`) |
| `lg` | 36px (`h-9`) | 36x36 (`size-9`) |

**Variants:**

| Variant | Light Mode | Dark Mode |
| ------- | ---------- | --------- |
| `default` | Solid indigo bg, white text | Same (primary adjusts via token) |
| `outline` | Border, transparent bg, muted hover | `dark:bg-input/30` translucent bg |
| `secondary` | Secondary bg (light blue-gray) | Dark blue-gray bg |
| `ghost` | Transparent, muted hover | `dark:hover:bg-muted/50` |
| `destructive` | `bg-destructive/10` tint, red text | `dark:bg-destructive/20` tint |
| `link` | Indigo text, underline on hover | Same |

**No `success`, `warning`, or `gradient` variants.** These are not part of the design system.

### 5.2 Card

- Border: `ring-1 ring-foreground/10` (not `border`)
- No box-shadow
- Radius: `rounded-xl` (14px)
- Background: `bg-card text-card-foreground`
- Size prop: `"default"` (py-4, gap-4) or `"sm"` (py-3, gap-3)
- Footer: `bg-muted/50 border-t rounded-b-xl`
- Header: CSS Grid with `has-data-[slot=card-action]:grid-cols-[1fr_auto]`

### 5.3 Inputs and Form Controls

**Shared input styling:**

```
h-8 rounded-lg border border-input bg-transparent px-2.5
dark:bg-input/30 dark:hover:bg-input/50
```

**Focus state (all form controls):**

```
focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3
```

**Validation (all form controls):**

```
aria-invalid:ring-destructive/20 aria-invalid:border-destructive aria-invalid:ring-3
dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive/50
```

**Disabled (all form controls):**

```
disabled:pointer-events-none disabled:opacity-50
disabled:bg-input/50 dark:disabled:bg-input/80
```

### 5.4 Dropdown Menus and Selects

**Content container:**

```
bg-popover text-popover-foreground
ring-1 ring-foreground/10 shadow-md rounded-lg
```

**Item hover (menus use `focus:` because Radix moves focus on hover):**

```
focus:bg-accent focus:text-accent-foreground
```

**Destructive item:**

```
data-[variant=destructive]:text-destructive
data-[variant=destructive]:focus:bg-destructive/10
dark:data-[variant=destructive]:focus:bg-destructive/20
```

**Animation (all popovers/dropdowns):**

```
data-open:animate-in data-closed:animate-out
data-closed:fade-out-0 data-open:fade-in-0
data-closed:zoom-out-95 data-open:zoom-in-95
data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2
data-[side=right]:slide-in-from-left-2
data-[side=top]:slide-in-from-bottom-2
duration-100
```

### 5.5 Alert Dialog

- Overlay: `bg-black/10` with `supports-backdrop-filter:backdrop-blur-xs`
- Content: `bg-background ring-1 ring-foreground/10 rounded-xl`
- Footer: `bg-muted/50 border-t rounded-b-xl` (same pattern as card)
- Action button: `variant="default"` (indigo)
- Cancel button: `variant="outline"`
- Sizes: `"default"` (max-w-xs → sm:max-w-sm) or `"sm"` (max-w-xs)

### 5.6 Badge

- Shape: Pill (`rounded-4xl`, height `h-5`)
- Variants mirror button: default, secondary, destructive, outline, ghost, link
- Destructive: translucent `bg-destructive/10` (same as button)

### 5.7 Field (Form Layout)

Three layout orientations:

- `vertical` -- label above input (default)
- `horizontal` -- label beside input
- `responsive` -- vertical on mobile, horizontal on larger screens (uses `@container`)

Error propagation: `data-[invalid=true]:text-destructive` on the field wrapper turns all children red.

Checked highlight: Labels containing checked checkboxes/radios get `bg-primary/5 border-primary/30`.

---

## 6. CSS Architecture

### Tailwind v4 Setup

No `tailwind.config.ts`. All configuration lives in CSS:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/noto-sans";

@custom-variant dark (&:is(.dark *));
```

### Theme Inline Block

The `@theme inline` block maps CSS custom properties to Tailwind utilities:

```css
@theme inline {
    --font-sans: 'Noto Sans Variable', sans-serif;
    --color-primary: var(--primary);
    --color-background: var(--background);
    /* ... all semantic tokens mapped ... */
    --radius-sm: calc(var(--radius) - 4px);
    --radius-md: calc(var(--radius) - 2px);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) + 4px);
    --radius-2xl: calc(var(--radius) + 8px);
    --radius-3xl: calc(var(--radius) + 12px);
    --radius-4xl: calc(var(--radius) + 16px);
}
```

### Base Layer

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply font-sans bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

### `components.json` (shadcn/ui CLI)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "stone",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

---

## 7. Key Patterns and Conventions

### `data-slot` Attribute System

Every component part gets a `data-slot` attribute for identification. This enables parent-child styling without JavaScript:

```tsx
<Card data-slot="card">
  <CardHeader data-slot="card-header">
    <CardTitle data-slot="card-title">...</CardTitle>
    <CardAction data-slot="card-action">...</CardAction>
  </CardHeader>
</Card>
```

Parents can then style based on children:

```css
has-data-[slot=card-action]:grid-cols-[1fr_auto]
has-data-[slot=card-footer]:pb-0
```

### Named Tailwind Groups

Components register named groups for descendant styling:

```
group/button, group/card, group/card-header, group/field,
group/field-label, group/input-group, group/alert-dialog-content,
group/dropdown-menu-item, group/combobox-content
```

Usage: `group-data-[size=sm]/card:px-3` — the content's padding responds to the card's size.

### SVG Icon Normalization

Every component containing icons uses:

```
[&_svg:not([class*='size-'])]:size-4  /* default 16px */
[&_svg]:pointer-events-none
[&_svg]:shrink-0
```

Smaller variants override to `size-3` (12px) or `size-3.5` (14px).

### `aria-expanded` State

Button variants `outline`, `secondary`, and `ghost` show active state when `aria-expanded="true"`:

```
aria-expanded:bg-muted aria-expanded:text-foreground
```

This automatically highlights trigger buttons when their associated dropdown/popover is open.

### Container Queries

Used for responsive layouts within components:

- Field group: `@container/field-group` with `@md/field-group:` breakpoints
- Card header: `@container/card-header`

---

## 8. Do / Don't Conventions

### Colors

- **DO** use semantic tokens (`bg-primary`, `text-muted-foreground`, `border-input`)
- **DON'T** use raw color values (`bg-indigo-500`, `text-gray-400`)
- **DO** use translucent destructive backgrounds (`bg-destructive/10`)
- **DON'T** use solid destructive backgrounds (`bg-destructive` as background)
- **DO** use `ring-1 ring-foreground/10` for container borders (cards, dialogs)
- **DON'T** use `border` + `shadow` for containers

### Spacing and Layout

- **DO** use logical properties (`ps-2`, `pe-3`, `ms-auto`, `me-2`)
- **DON'T** use physical properties (`pl-2`, `pr-3`, `ml-auto`, `mr-2`)
- **DO** use `start-0`, `end-0` for positioning
- **DON'T** use `left-0`, `right-0`

### Interactions

- **DO** use subtle color shifts for hover states (`hover:bg-muted`, `hover:bg-primary/80`)
- **DON'T** use scale transforms (`hover:scale-105`) or shadow changes on hover
- **DO** use `focus-visible:ring-3` for focus states (keyboard only)
- **DON'T** use `focus:ring-2` (triggers on mouse click too)

### Components

- **DO** use `data-slot` attributes on every component part
- **DO** use `data-variant` and `data-size` to expose state to CSS
- **DO** use `has-data-[slot=...]` for parent-aware styling
- **DON'T** use `React.forwardRef` (React 19 forwards refs automatically)
- **DO** use `React.ComponentProps<"element">` for prop types
- **DON'T** add `displayName` (not needed in React 19)

### Dark Mode

- **DO** adjust primary lightness (0.51 → 0.59) via CSS custom properties
- **DO** use translucent inputs in dark mode (`dark:bg-input/30`)
- **DON'T** use solid dark backgrounds for inputs (`dark:bg-gray-800`)
- **DO** increase destructive opacity in dark mode (`/10` → `/20`, `/20` → `/30`)

### Animation

- **DO** use `duration-100` for popover/dropdown animations
- **DO** use Radix data-state animations (`data-open:animate-in`, `data-closed:animate-out`)
- **DON'T** add custom `transition-duration` to interactive elements (the base `transition-all` or `transition-colors` is sufficient)

---

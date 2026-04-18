# Phase 3: Core UI Component Library

## 🎯 Goal
Extract the styling rules from `design.md` into highly reusable atomic React components to dramatically speed up subsequent phase UI assembly.

## 🛠️ Tasks

### 1. Base Container Components
- **`GlassCard.tsx`**: A wrapper component utilizing `bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl`.

### 2. Interaction Components
- **`Button.tsx`**: Extensible framework with variants.
  - Variant `primary`: Gradient background, hover scale.
  - Variant `secondary`/`outline`: Glass border, hover effect.
  - Include motion/animation triggers using `framer-motion`.

### 3. Form Input Components
- **`Input.tsx`**: Styled semantic HTML `<input>` with labels and error message spans. Follow the dark pill form from the design specs.
- **`SelectDropdown.tsx`**: Styled select element or Radix UI dropdown equivalent for handling state selections.

### 4. Data Display Components
- **`Badge.tsx`**: Reusable pill-shaped badge component for statuses (Active, Delivered, Pending). Pass semantic color variants (success, warning, info, danger) as props.
- **`DataTable.tsx`**: Develop a reusable table layout component that handles generic rows, custom header classes, and thin glassy bottom borders.

### 5. Loaders & Skeleton
- **`SkeletonLoader.tsx`**: Used for shimmering loading states in widgets.

## ✅ Milestones
- Component library exists locally inside `/components/ui/`.
- Components successfully render using the colors and animations specified in `design.md`.

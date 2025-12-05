# SpecterSheet Coding Standards & AI Steering

## Project Context
SpecterSheet is an AI-powered spreadsheet with a spooky/ghost theme for the Kiroween hackathon. The application demonstrates supernatural spreadsheet capabilities with spectral visual effects.

## Technology Stack
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (framer-motion)
- **Charts**: Recharts
- **Build Tool**: Vite (Rolldown)
- **Testing**: Vitest

## Code Style Guidelines

### TypeScript
- Use strict TypeScript with explicit types
- Prefer interfaces over type aliases for objects
- Use `type` for unions, intersections, and mapped types
- Export types from dedicated type files in `src/types/`

```typescript
// Good
interface CellProps {
  address: CellAddress;
  value: CellValue;
  isSelected: boolean;
}

// Avoid
type CellProps = {
  address: string;
  value: any;
  isSelected: boolean;
}
```

### React Components
- Use functional components with hooks
- Destructure props in function signature
- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive computations

```typescript
// Good
export function Cell({ address, value, onSelect }: CellProps) {
  const handleClick = useCallback(() => {
    onSelect(address);
  }, [address, onSelect]);
  
  return <div onClick={handleClick}>{value}</div>;
}
```

### Styling with Tailwind
- Use Tailwind classes directly, avoid @apply in most cases
- Group related classes logically
- Use CSS variables for theme colors when needed

```typescript
// Good - logical grouping
className={`
  w-full h-10 px-4
  ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
  border rounded-lg
  hover:bg-opacity-80 transition-colors
`}
```

### Animations with Motion
- Import from 'motion/react'
- Use `whileHover`, `whileTap` for micro-interactions
- Use `AnimatePresence` for enter/exit animations
- Keep animations subtle and performant

```typescript
import { motion, AnimatePresence } from 'motion/react';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  whileHover={{ scale: 1.02 }}
/>
```

## Theme Guidelines

### Dark Mode (Primary - Spooky Theme)
- Background: `bg-gray-950` (#030712)
- Surface: `bg-gray-900` (#111827)
- Primary accent: `text-emerald-400` (#34d399)
- Glow color: `rgba(16, 185, 129, 0.X)`

### Light Mode
- Background: `bg-gray-50` (#f9fafb)
- Surface: `bg-white` (#ffffff)
- Primary accent: `text-indigo-600` (#4f46e5)
- Glow color: `rgba(99, 102, 241, 0.X)`

### Ghost Effects
- Use `drop-shadow` for glowing elements
- Animate opacity and scale for floating effects
- Use `blur-3xl` for ambient glow orbs
- Ghost-typing: character-by-character with cursor

## File Organization
```
src/
├── components/        # React components
│   ├── ui/           # Reusable UI primitives
│   └── figma/        # Figma-imported components
├── lib/              # Core logic (SheetEngine, parsers)
├── types/            # TypeScript type definitions
├── test/             # Test setup and utilities
├── App.tsx           # Main application component
├── main.tsx          # Entry point
├── index.css         # Global styles
└── globals.css       # CSS variables
```

## Naming Conventions
- Components: PascalCase (`SpreadsheetGrid.tsx`)
- Hooks: camelCase with `use` prefix (`useCell.ts`)
- Utils: camelCase (`cellUtils.ts`)
- Types: PascalCase (`CellAddress`, `FormulaAST`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_COLUMNS`)
- CSS classes: kebab-case (`custom-scrollbar`)

## AI Command Patterns
When implementing AI commands, follow this structure:
1. Match command with lowercase comparison
2. Show `aiThinking` state immediately
3. Use `setTimeout` for realistic delays
4. Animate cell updates with `aiGeneratingCells`
5. Log actions to `aiActions` array
6. Update `commandHistory`

## Performance Considerations
- Use `React.memo` for cell components
- Virtualize large grids if needed
- Debounce formula recalculation
- Use CSS animations over JS when possible
- Keep bundle size minimal

## Accessibility
- Support keyboard navigation (Tab, Arrow keys, Enter, Escape)
- Provide focus indicators
- Use semantic HTML elements
- Include ARIA labels for complex interactions


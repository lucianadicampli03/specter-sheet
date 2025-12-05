# Frankenstein Theme Guidelines

## Visual Identity

SpecterSheet embodies the Frankenstein concept - stitching together incompatible technologies into something alive and powerful.

## Color Palette

### Primary Colors
- **Electric Green**: `#10b981` - Represents "life" and AI activity
- **Purple Glow**: `#8b5cf6` - Mystical AI processing
- **Dark Background**: `#0a0a0f` - Specter dark theme

### Accent Colors
- **Lightning Yellow**: `#fbbf24` - Sparks and connections
- **Blood Red**: `#ef4444` - Errors and warnings
- **Ghost White**: `#f9fafb` - Text and highlights

## Animation Patterns

### "Bringing Data to Life"
When AI generates data, cells should:
1. Glow with electric green
2. Show "Formula Ghost" effect (formula text fading in)
3. Pulse briefly when complete
4. Leave a subtle trail effect

### "Stitching" Effects
When connecting data sources:
1. Lightning bolts between cells
2. Electric arcs during processing
3. Spark particles on completion

### "Frankenstein Awakening"
When app comes alive:
1. Green glow spreads across grid
2. Charts materialize with electric effect
3. Final "alive" pulse

## Component Guidelines

### Buttons
- Hover: Electric glow
- Active: Lightning pulse
- Disabled: Faded with subtle spark

### Cells
- Normal: Dark with subtle border
- Selected: Purple outline
- AI Generating: Green glow + Formula Ghost
- Error: Red glow with shake

### Charts
- Appear: Fade in with electric spark
- Update: Pulse green
- Drag: Leave ghost trail

## Code Patterns

```typescript
// AI Activity Indicator
className="animate-glow-pulse bg-green-500/20 border-green-500"

// Formula Ghost Effect
className="formula-ghost opacity-0 animate-ghost-float"

// Electric Spark
className="spark absolute w-1 h-1 bg-yellow-400 animate-ping"

// Stitching Connection
className="connection border-t-2 border-dashed border-purple-500 animate-pulse"
```

## Typography

- **Headers**: Bold, uppercase, letter-spacing
- **Code/Formulas**: Monospace, green tint
- **AI Messages**: Italic, purple tint
- **Errors**: Bold, red

## Interactions

### Hover States
- Subtle glow
- Scale up 102%
- Show tooltip with delay

### Click Feedback
- Electric pulse
- Brief flash
- Haptic-like animation

### Loading States
- Skeleton with shimmer
- Pulsing glow
- Progress indicator

## Accessibility

- Maintain WCAG AA contrast ratios
- Provide non-animated alternatives
- Use semantic HTML
- Include ARIA labels

## Examples

### AI Command Input
```tsx
<input
  className="bg-gray-900 border-2 border-purple-500 
             focus:border-green-500 focus:ring-2 
             focus:ring-green-500/50 transition-all
             placeholder-gray-500"
  placeholder="Summon the AI... ⚡"
/>
```

### Cell with AI Activity
```tsx
<div
  className={`cell ${aiActive ? 'animate-glow-pulse bg-green-500/10' : ''}`}
>
  {showFormulaGhost && (
    <span className="formula-ghost">
      {formula}
    </span>
  )}
  {value}
</div>
```

### Chart Materialization
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: "spring", damping: 15 }}
  className="chart-container border-2 border-purple-500/50"
>
  <Chart data={data} />
</motion.div>
```

## Remember

Every interaction should feel like **bringing data to life** through the power of AI. The UI should be both professional (spreadsheet) and magical (AI + ghosts).

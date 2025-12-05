# SpecterSheet Project Guidelines

## Code Style

### TypeScript
- Use strict mode
- Prefer interfaces over types for object shapes
- Use descriptive variable names
- Export types alongside implementations

### React Components
- Functional components only
- Use hooks for state and effects
- Props interfaces defined above component
- Destructure props in function signature

### Styling
- Tailwind CSS for all styling
- Dark mode support via `darkMode` prop
- Framer Motion for animations
- Consistent color palette:
  - Dark mode: Emerald/Teal accents
  - Light mode: Indigo/Purple accents

## File Organization

```
src/
├── components/          # React components
│   ├── [Component].tsx  # Component file
│   └── figma/          # Figma-imported components
├── lib/                # Core logic
│   ├── SheetEngine.ts  # Main spreadsheet engine
│   ├── FormulaParser.ts
│   ├── FormulaEvaluator.ts
│   ├── CellMatrix.ts
│   └── groqAI.ts       # AI integration
├── types/              # TypeScript types
│   ├── cell.ts
│   ├── chart.ts
│   ├── formula.ts
│   └── macro.ts
└── App.tsx             # Main application
```

## Component Guidelines

### New Component Checklist
- [ ] TypeScript props interface
- [ ] Dark mode support
- [ ] Responsive design
- [ ] Accessibility attributes
- [ ] Animation considerations

### State Management
- Local state for UI-only concerns
- Lift state for shared data
- Use callbacks for parent communication

## AI Integration Guidelines

### Prompt Engineering
- Be specific about expected output format
- Request JSON responses
- Include examples when helpful
- Handle errors gracefully

### Response Handling
- Always parse JSON safely
- Validate response structure
- Provide fallbacks for failures
- Log errors for debugging

## Testing Strategy

### Unit Tests
- Formula parser functions
- Cell utility functions
- Evaluator calculations

### Integration Tests
- AI command processing
- Chart generation
- Macro execution

### E2E Tests
- User flows (data entry, AI interaction)
- Export functionality
- File upload/download


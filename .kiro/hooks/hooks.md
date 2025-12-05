# SpecterSheet Development Hooks

## Pre-Commit Hooks

### Hook 1: Lint Check
```yaml
name: lint-check
trigger: pre-commit
command: npm run lint
description: Run ESLint before committing to ensure code quality
```

### Hook 2: Type Check
```yaml
name: type-check
trigger: pre-commit
command: npx tsc --noEmit
description: Verify TypeScript types before commit
```

### Hook 3: Test Runner
```yaml
name: test-runner
trigger: pre-commit
command: npm run test:run
description: Run unit tests for formula evaluation and cell utilities
```

## Development Workflow Hooks

### Hook 4: Component Generator
```yaml
name: generate-component
trigger: manual
template: |
  When creating a new component:
  1. Create file in src/components/
  2. Use motion/react for animations
  3. Accept darkMode prop for theming
  4. Follow existing naming conventions
  5. Export from component file
```

### Hook 5: AI Command Handler
```yaml
name: ai-command-handler
trigger: manual
template: |
  When adding new AI command:
  1. Add pattern matching in processAICommand function
  2. Define cells to modify with ghost animation
  3. Create AIAction entries for activity log
  4. Update command history
  5. Add to suggested commands in sidebar
```

### Hook 6: Formula Function
```yaml
name: add-formula-function
trigger: manual
template: |
  When adding new spreadsheet function:
  1. Add case in FormulaEvaluator.evaluateFunction()
  2. Create private method funcXXX()
  3. Handle argument validation
  4. Add to supported functions in spec
  5. Write unit test in FormulaEvaluator.test.ts
```

## Code Review Hooks

### Hook 7: Ghost Effect Consistency
```yaml
name: ghost-effect-review
trigger: code-review
checklist:
  - Uses emerald-400 in dark mode, indigo-500 in light mode
  - Animations use motion/react
  - Glow effects use proper rgba values
  - Particles are pointer-events-none
```

### Hook 8: Accessibility Check
```yaml
name: accessibility-check
trigger: code-review
checklist:
  - All interactive elements are keyboard accessible
  - Focus states are visible
  - Color contrast meets WCAG standards
  - ARIA labels where needed
```

## Automation Hooks

### Hook 9: Auto-Import Organizer
```yaml
name: auto-imports
trigger: on-save
action: |
  Organize imports:
  1. React imports first
  2. Third-party libraries
  3. Local components
  4. Types
  5. Styles
```

### Hook 10: Theme Consistency
```yaml
name: theme-consistency
trigger: on-save
action: |
  Verify darkMode conditional styling:
  - Check for paired dark/light classes
  - Ensure consistent color variables
  - Validate hover/focus states
```

## Build Hooks

### Hook 11: Pre-Build Validation
```yaml
name: pre-build
trigger: pre-build
commands:
  - npm run lint
  - npm run test:run
  - npx tsc --noEmit
description: Full validation before production build
```

### Hook 12: Post-Build Analysis
```yaml
name: post-build
trigger: post-build
command: npx vite-bundle-visualizer
description: Generate bundle size analysis after build
```


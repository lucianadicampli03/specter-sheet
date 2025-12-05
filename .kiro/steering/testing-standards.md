# Testing Standards for SpecterSheet

## Overview

SpecterSheet uses a dual testing approach:
1. **Property-Based Testing** (fast-check) - Validates universal properties
2. **Unit Testing** (Vitest) - Validates specific examples and edge cases

## Property-Based Testing Requirements

### Minimum Iterations
- All property tests MUST run at least **100 iterations**
- Critical functions (parser, evaluator) SHOULD run **1000 iterations**

### Tag Format
Every property test MUST include a comment linking to the design spec:

```typescript
/**
 * Feature: specter-sheet, Property {number}: {property_text}
 * Validates: Requirements {requirement_ids}
 */
```

Example:
```typescript
/**
 * Feature: specter-sheet, Property 1: Natural language to working formula
 * Validates: Requirements 1.1, 1.2, 1.3
 */
it('should correctly evaluate addition', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: -1000, max: 1000 }),
      fc.integer({ min: -1000, max: 1000 }),
      (a, b) => {
        const result = evaluate(`=${a}+${b}`);
        expect(result).toBe(a + b);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Generator Guidelines

**Use appropriate generators:**
- `fc.integer()` for whole numbers
- `fc.float()` for decimals (avoid very small values)
- `fc.string()` for text (filter special chars if needed)
- `fc.array()` for collections
- `fc.record()` for objects

**Constrain inputs:**
```typescript
// Good - Constrained to reasonable range
fc.integer({ min: -1000, max: 1000 })

// Bad - Unbounded, may generate extreme values
fc.integer()
```

**Filter invalid inputs:**
```typescript
// Avoid division by zero
fc.integer({ min: 1, max: 100 })

// Avoid special characters in strings
fc.stringMatching(/^[a-zA-Z0-9 ]{0,50}$/)
```

### Property Categories

**1. Round-Trip Properties**
Operations that should return to original value:
```typescript
// Parse then format should equal original
expect(format(parse(address))).toBe(address);

// Serialize then deserialize should equal original
expect(deserialize(serialize(data))).toEqual(data);
```

**2. Invariant Properties**
Properties that remain constant:
```typescript
// Array length after map
expect(mapped.length).toBe(original.length);

// Sum after reordering
expect(sum(shuffled)).toBe(sum(original));
```

**3. Metamorphic Properties**
Relationships between operations:
```typescript
// Filtering reduces or maintains length
expect(filtered.length).toBeLessThanOrEqual(original.length);

// Absolute value is non-negative
expect(abs(x)).toBeGreaterThanOrEqual(0);
```

**4. Idempotence Properties**
Doing twice = doing once:
```typescript
// Sorting twice equals sorting once
expect(sort(sort(arr))).toEqual(sort(arr));

// Uppercase twice equals uppercase once
expect(upper(upper(str))).toBe(upper(str));
```

## Unit Testing Requirements

### Test Organization
```typescript
describe('Component/Function Name', () => {
  describe('Feature/Method', () => {
    it('should do specific thing', () => {
      // Test
    });
    
    it('should handle edge case', () => {
      // Test
    });
  });
});
```

### Coverage Requirements
- **Statements**: 80% minimum
- **Branches**: 75% minimum
- **Functions**: 90% minimum
- **Lines**: 80% minimum

### Edge Cases to Test
1. **Empty inputs**: `[]`, `""`, `null`, `undefined`
2. **Boundary values**: `0`, `-1`, `MAX_INT`, `MIN_INT`
3. **Special characters**: Quotes, newlines, unicode
4. **Invalid inputs**: Wrong types, out of range
5. **Error conditions**: Network failures, parse errors

### Assertion Guidelines

**Be specific:**
```typescript
// Good
expect(result).toBe(42);
expect(array).toEqual([1, 2, 3]);

// Bad
expect(result).toBeTruthy();
expect(array.length).toBeGreaterThan(0);
```

**Test behavior, not implementation:**
```typescript
// Good - Tests public API
expect(engine.getCellValue('A1')).toBe(100);

// Bad - Tests internal state
expect(engine.matrix.cells.get('A1')).toBeDefined();
```

## Test File Organization

```
src/
├── lib/
│   ├── cellUtils.ts
│   ├── cellUtils.test.ts          # Unit + Property tests
│   ├── FormulaParser.ts
│   ├── FormulaParser.test.ts
│   ├── FormulaEvaluator.ts
│   └── FormulaEvaluator.test.ts
└── components/
    ├── SpreadsheetGrid.tsx
    └── SpreadsheetGrid.test.tsx   # Component tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific file
npm test cellUtils

# Run with coverage
npm run coverage

# Run with UI
npm run test:ui

# Run in watch mode
npm test -- --watch
```

## Continuous Integration

Tests MUST pass before:
- Committing to main branch
- Creating pull requests
- Deploying to production

## Performance Testing

Property tests should complete in reasonable time:
- **< 1 second** for simple properties
- **< 5 seconds** for complex properties
- **< 30 seconds** for entire test suite

If tests are slow:
1. Reduce `numRuns` for expensive operations
2. Use smaller input ranges
3. Mock expensive dependencies

## Debugging Failed Tests

When a property test fails:

1. **Check the counterexample:**
```
Counterexample: [0, -1.401298464324817e-45]
```

2. **Reproduce with specific values:**
```typescript
it('debug failing case', () => {
  const result = evaluate('=0+-1.401298464324817e-45');
  console.log('Result:', result);
  expect(result).toBeCloseTo(-1.401298464324817e-45, 10);
});
```

3. **Fix the issue** (usually precision, edge case, or invalid input)

4. **Re-run property test** to verify fix

## Example Test Suite

```typescript
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { cellUtils } from './cellUtils';

describe('Cell Address Utilities', () => {
  /**
   * Feature: specter-sheet, Property 2: Formula reference validation
   * Validates: Requirements 1.5
   */
  describe('Property Tests', () => {
    it('should parse and recreate cell addresses', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          fc.integer({ min: 1, max: 1000 }),
          (col, row) => {
            const address = cellUtils.create(col, row);
            const parsed = cellUtils.parse(address);
            expect(parsed.col).toBe(col);
            expect(parsed.row).toBe(row);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
  
  describe('Unit Tests', () => {
    it('should parse A1', () => {
      expect(cellUtils.parse('A1')).toEqual({ col: 1, row: 1 });
    });
    
    it('should reject invalid addresses', () => {
      expect(() => cellUtils.parse('A0')).toThrow();
      expect(() => cellUtils.parse('1A')).toThrow();
    });
  });
});
```

## Best Practices

1. **Write tests first** (TDD) when possible
2. **Test one thing** per test case
3. **Use descriptive names** that explain what's being tested
4. **Avoid test interdependence** - each test should be isolated
5. **Mock external dependencies** (API calls, file system)
6. **Keep tests fast** - slow tests won't be run
7. **Update tests** when requirements change
8. **Review test coverage** regularly

## Anti-Patterns to Avoid

❌ **Testing implementation details**
```typescript
// Bad
expect(component.state.internalCounter).toBe(5);
```

❌ **Overly complex tests**
```typescript
// Bad - Too much setup
const data = setupComplexScenario();
const result = processData(data);
expect(result).toBe(expected);
```

❌ **Magic numbers**
```typescript
// Bad
expect(result).toBe(42);

// Good
const EXPECTED_TOTAL = 42;
expect(result).toBe(EXPECTED_TOTAL);
```

❌ **Skipping edge cases**
```typescript
// Bad - Only tests happy path
it('should work', () => {
  expect(func(5)).toBe(10);
});

// Good - Tests edge cases
it('should handle zero', () => {
  expect(func(0)).toBe(0);
});
```

## Resources

- [fast-check documentation](https://fast-check.dev/)
- [Vitest documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Property-Based Testing Guide](https://hypothesis.works/articles/what-is-property-based-testing/)

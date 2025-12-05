/**
 * Property-based tests for formula evaluation
 * Feature: specter-sheet, Property 1: Natural language to working formula
 * Validates: Requirements 1.1, 1.2, 1.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { FormulaParser } from './FormulaParser';
import { FormulaEvaluator, type EvaluationContext } from './FormulaEvaluator';
import type { CellValue, CellAddress, CellRange } from '../types';

// Mock evaluation context for testing
class MockEvaluationContext implements EvaluationContext {
  private cells: Map<CellAddress, CellValue> = new Map();

  setCellValue(address: CellAddress, value: CellValue): void {
    this.cells.set(address, value);
  }

  getCellValue(address: CellAddress): CellValue {
    return this.cells.get(address) ?? null;
  }

  getRange(range: CellRange): CellValue[][] {
    // Simple implementation for testing
    return [[this.getCellValue(range.start)]];
  }
}

describe('Formula Evaluator - Property Tests', () => {
  describe('Arithmetic operations', () => {
    it('should correctly evaluate addition', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1000, max: 1000 }),
          fc.integer({ min: -1000, max: 1000 }),
          (a, b) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const ast = parser.parse(`=${a}+${b}`);
            const result = evaluator.evaluate(ast);
            
            expect(typeof result).toBe('number');
            expect(result).toBe(a + b);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly evaluate subtraction', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1000, max: 1000 }),
          fc.integer({ min: -1000, max: 1000 }),
          (a, b) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const ast = parser.parse(`=${a}-${b}`);
            const result = evaluator.evaluate(ast);
            
            expect(typeof result).toBe('number');
            expect(result).toBe(a - b);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly evaluate multiplication', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -100, max: 100 }),
          fc.integer({ min: -100, max: 100 }),
          (a, b) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const ast = parser.parse(`=${a}*${b}`);
            const result = evaluator.evaluate(ast);
            
            expect(typeof result).toBe('number');
            expect(result).toBe(a * b);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly evaluate division (non-zero divisor)', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -100, max: 100 }),
          fc.integer({ min: 1, max: 100 }), // Avoid division by zero
          (a, b) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const ast = parser.parse(`=${a}/${b}`);
            const result = evaluator.evaluate(ast);
            
            expect(typeof result).toBe('number');
            expect(result).toBeCloseTo(a / b, 5);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should throw on division by zero', () => {
      const parser = new FormulaParser();
      const evaluator = new FormulaEvaluator(new MockEvaluationContext());
      
      const ast = parser.parse('=10/0');
      expect(() => evaluator.evaluate(ast)).toThrow('Division by zero');
    });
  });

  describe('Built-in functions', () => {
    it('should correctly evaluate SUM function', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 10 }),
          (numbers) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const formula = `=SUM(${numbers.join(',')})`;
            const ast = parser.parse(formula);
            const result = evaluator.evaluate(ast);
            
            const expected = numbers.reduce((sum, n) => sum + n, 0);
            expect(typeof result).toBe('number');
            expect(result).toBe(expected);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly evaluate AVERAGE function', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 10 }),
          (numbers) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const formula = `=AVERAGE(${numbers.join(',')})`;
            const ast = parser.parse(formula);
            const result = evaluator.evaluate(ast);
            
            const expected = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
            expect(typeof result).toBe('number');
            expect(result).toBeCloseTo(expected, 5);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly evaluate MIN function', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 10 }),
          (numbers) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const formula = `=MIN(${numbers.join(',')})`;
            const ast = parser.parse(formula);
            const result = evaluator.evaluate(ast);
            
            const expected = Math.min(...numbers);
            expect(typeof result).toBe('number');
            expect(result).toBe(expected);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly evaluate MAX function', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 10 }),
          (numbers) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const formula = `=MAX(${numbers.join(',')})`;
            const ast = parser.parse(formula);
            const result = evaluator.evaluate(ast);
            
            const expected = Math.max(...numbers);
            expect(typeof result).toBe('number');
            expect(result).toBe(expected);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly evaluate ABS function', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1000, max: 1000 }),
          (num) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const ast = parser.parse(`=ABS(${num})`);
            const result = evaluator.evaluate(ast);
            
            expect(typeof result).toBe('number');
            expect(result).toBe(Math.abs(num));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly evaluate ROUND function', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -100, max: 100 }),
          fc.integer({ min: 0, max: 2 }),
          (num, decimals) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const ast = parser.parse(`=ROUND(${num}, ${decimals})`);
            const result = evaluator.evaluate(ast);
            
            const multiplier = Math.pow(10, decimals);
            const expected = Math.round(num * multiplier) / multiplier;
            
            expect(typeof result).toBe('number');
            expect(result).toBe(expected);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Cell references', () => {
    it('should correctly evaluate cell references', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1000, max: 1000 }),
          (value) => {
            const parser = new FormulaParser();
            const context = new MockEvaluationContext();
            context.setCellValue('A1', value);
            const evaluator = new FormulaEvaluator(context);
            
            const ast = parser.parse('=A1');
            const result = evaluator.evaluate(ast);
            
            expect(result).toBe(value);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly evaluate formulas with multiple cell references', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -100, max: 100 }),
          fc.integer({ min: -100, max: 100 }),
          (a, b) => {
            const parser = new FormulaParser();
            const context = new MockEvaluationContext();
            context.setCellValue('A1', a);
            context.setCellValue('B1', b);
            const evaluator = new FormulaEvaluator(context);
            
            const ast = parser.parse('=A1+B1');
            const result = evaluator.evaluate(ast);
            
            expect(typeof result).toBe('number');
            expect(result).toBe(a + b);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('String functions', () => {
    it('should correctly evaluate UPPER function', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[a-zA-Z0-9 ]{0,20}$/), // Avoid special chars
          (str) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const ast = parser.parse(`=UPPER("${str}")`);
            const result = evaluator.evaluate(ast);
            
            expect(result).toBe(str.toUpperCase());
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly evaluate LOWER function', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[a-zA-Z0-9 ]{0,20}$/), // Avoid special chars
          (str) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const ast = parser.parse(`=LOWER("${str}")`);
            const result = evaluator.evaluate(ast);
            
            expect(result).toBe(str.toLowerCase());
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly evaluate LENGTH function', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[a-zA-Z0-9 ]{0,50}$/), // Avoid special chars
          (str) => {
            const parser = new FormulaParser();
            const evaluator = new FormulaEvaluator(new MockEvaluationContext());
            
            const ast = parser.parse(`=LENGTH("${str}")`);
            const result = evaluator.evaluate(ast);
            
            expect(result).toBe(str.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

describe('Formula Evaluator - Unit Tests', () => {
  it('should evaluate simple number', () => {
    const parser = new FormulaParser();
    const evaluator = new FormulaEvaluator(new MockEvaluationContext());
    
    const ast = parser.parse('=42');
    expect(evaluator.evaluate(ast)).toBe(42);
  });

  it('should evaluate string literal', () => {
    const parser = new FormulaParser();
    const evaluator = new FormulaEvaluator(new MockEvaluationContext());
    
    const ast = parser.parse('="hello"');
    expect(evaluator.evaluate(ast)).toBe('hello');
  });

  it('should evaluate boolean literals', () => {
    const parser = new FormulaParser();
    const evaluator = new FormulaEvaluator(new MockEvaluationContext());
    
    expect(evaluator.evaluate(parser.parse('=TRUE'))).toBe(true);
    expect(evaluator.evaluate(parser.parse('=FALSE'))).toBe(false);
  });

  it('should evaluate IF function', () => {
    const parser = new FormulaParser();
    const evaluator = new FormulaEvaluator(new MockEvaluationContext());
    
    expect(evaluator.evaluate(parser.parse('=IF(TRUE, 1, 2)'))).toBe(1);
    expect(evaluator.evaluate(parser.parse('=IF(FALSE, 1, 2)'))).toBe(2);
    expect(evaluator.evaluate(parser.parse('=IF(1, "yes", "no")'))).toBe('yes');
    expect(evaluator.evaluate(parser.parse('=IF(0, "yes", "no")'))).toBe('no');
  });

  it('should evaluate nested functions', () => {
    const parser = new FormulaParser();
    const evaluator = new FormulaEvaluator(new MockEvaluationContext());
    
    const ast = parser.parse('=ABS(MIN(-5, -10, -3))');
    expect(evaluator.evaluate(ast)).toBe(10);
  });

  it('should evaluate complex expressions', () => {
    const parser = new FormulaParser();
    const evaluator = new FormulaEvaluator(new MockEvaluationContext());
    
    const ast = parser.parse('=(2+3)*4-1');
    expect(evaluator.evaluate(ast)).toBe(19);
  });

  it('should handle operator precedence', () => {
    const parser = new FormulaParser();
    const evaluator = new FormulaEvaluator(new MockEvaluationContext());
    
    expect(evaluator.evaluate(parser.parse('=2+3*4'))).toBe(14);
    expect(evaluator.evaluate(parser.parse('=(2+3)*4'))).toBe(20);
    expect(evaluator.evaluate(parser.parse('=2^3*2'))).toBe(16);
  });
});

/**
 * Property-based tests for cell address parsing and manipulation
 * Feature: specter-sheet, Property 2: Formula reference validation
 * Validates: Requirements 1.5
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  parseCellAddress,
  columnLetterToNumber,
  columnNumberToLetter,
  createCellAddress,
  parseRange,
  expandRange,
  isInRange,
  isValidCellAddress,
  isValidRange,
  offsetCellAddress,
} from './cellUtils';

describe('Cell Address Utilities - Property Tests', () => {
  describe('Column conversion round-trip', () => {
    it('should convert column number to letter and back', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 702 }), (num) => {
          // 702 = ZZ column
          const letter = columnNumberToLetter(num);
          const backToNum = columnLetterToNumber(letter);
          expect(backToNum).toBe(num);
        }),
        { numRuns: 100 }
      );
    });

    it('should convert column letter to number and back', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[A-Z]{1,2}$/),
          (letter) => {
            const num = columnLetterToNumber(letter);
            const backToLetter = columnNumberToLetter(num);
            expect(backToLetter).toBe(letter);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Cell address parsing round-trip', () => {
    it('should parse and recreate cell addresses', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }), // column
          fc.integer({ min: 1, max: 1000 }), // row
          (col, row) => {
            const address = createCellAddress(col, row);
            const parsed = parseCellAddress(address);
            expect(parsed.col).toBe(col);
            expect(parsed.row).toBe(row);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate all created addresses as valid', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          fc.integer({ min: 1, max: 1000 }),
          (col, row) => {
            const address = createCellAddress(col, row);
            expect(isValidCellAddress(address)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Range operations', () => {
    it('should parse and validate ranges correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }),
          fc.integer({ min: 1, max: 500 }),
          fc.integer({ min: 1, max: 50 }),
          fc.integer({ min: 1, max: 500 }),
          (col1, row1, col2, row2) => {
            const start = createCellAddress(col1, row1);
            const end = createCellAddress(col2, row2);
            const rangeStr = `${start}:${end}`;
            
            expect(isValidRange(rangeStr)).toBe(true);
            
            const parsed = parseRange(rangeStr);
            expect(parsed.start).toBe(start);
            expect(parsed.end).toBe(end);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should expand ranges to include all cells', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 0, max: 5 }),
          fc.integer({ min: 0, max: 5 }),
          (col, row, colSpan, rowSpan) => {
            const start = createCellAddress(col, row);
            const end = createCellAddress(col + colSpan, row + rowSpan);
            const range = { start, end };
            
            const expanded = expandRange(range);
            const expectedCount = (colSpan + 1) * (rowSpan + 1);
            
            expect(expanded.length).toBe(expectedCount);
            
            // All expanded cells should be in range
            expanded.forEach(addr => {
              expect(isInRange(addr, range)).toBe(true);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify cells within ranges', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 5 }),
          fc.integer({ min: 1, max: 5 }),
          (col, row, width, height) => {
            const range = {
              start: createCellAddress(col, row),
              end: createCellAddress(col + width, row + height),
            };
            
            // Cell at start should be in range
            expect(isInRange(range.start, range)).toBe(true);
            
            // Cell at end should be in range
            expect(isInRange(range.end, range)).toBe(true);
            
            // Cell in middle should be in range
            const midCol = col + Math.floor(width / 2);
            const midRow = row + Math.floor(height / 2);
            const midCell = createCellAddress(midCol, midRow);
            expect(isInRange(midCell, range)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Cell address offset', () => {
    it('should correctly offset cell addresses', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 5, max: 50 }),
          fc.integer({ min: 5, max: 500 }),
          fc.integer({ min: -4, max: 10 }),
          fc.integer({ min: -4, max: 10 }),
          (col, row, colOffset, rowOffset) => {
            const address = createCellAddress(col, row);
            const offset = offsetCellAddress(address, colOffset, rowOffset);
            const parsed = parseCellAddress(offset);
            
            expect(parsed.col).toBe(col + colOffset);
            expect(parsed.row).toBe(row + rowOffset);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Invalid inputs', () => {
    it('should reject invalid cell addresses', () => {
      const invalidAddresses = ['', '1A', 'A', '123', 'A0', 'a1', 'A-1'];
      
      invalidAddresses.forEach(addr => {
        expect(isValidCellAddress(addr), `Address "${addr}" should be invalid`).toBe(false);
      });
    });

    it('should throw on parsing invalid addresses', () => {
      const invalidAddresses = ['', '1A', 'A', '123', 'A0'];
      
      invalidAddresses.forEach(addr => {
        expect(() => parseCellAddress(addr)).toThrow();
      });
    });

    it('should reject invalid ranges', () => {
      const invalidRanges = ['A1', 'A1:B2:C3', 'A1-B2', ''];
      
      invalidRanges.forEach(range => {
        expect(isValidRange(range)).toBe(false);
      });
    });
  });
});

describe('Cell Address Utilities - Unit Tests', () => {
  describe('columnLetterToNumber', () => {
    it('should convert single letters correctly', () => {
      expect(columnLetterToNumber('A')).toBe(1);
      expect(columnLetterToNumber('B')).toBe(2);
      expect(columnLetterToNumber('Z')).toBe(26);
    });

    it('should convert double letters correctly', () => {
      expect(columnLetterToNumber('AA')).toBe(27);
      expect(columnLetterToNumber('AB')).toBe(28);
      expect(columnLetterToNumber('AZ')).toBe(52);
      expect(columnLetterToNumber('BA')).toBe(53);
    });
  });

  describe('columnNumberToLetter', () => {
    it('should convert numbers to single letters', () => {
      expect(columnNumberToLetter(1)).toBe('A');
      expect(columnNumberToLetter(2)).toBe('B');
      expect(columnNumberToLetter(26)).toBe('Z');
    });

    it('should convert numbers to double letters', () => {
      expect(columnNumberToLetter(27)).toBe('AA');
      expect(columnNumberToLetter(28)).toBe('AB');
      expect(columnNumberToLetter(52)).toBe('AZ');
    });
  });

  describe('parseCellAddress', () => {
    it('should parse standard addresses', () => {
      expect(parseCellAddress('A1')).toEqual({ col: 1, row: 1 });
      expect(parseCellAddress('B5')).toEqual({ col: 2, row: 5 });
      expect(parseCellAddress('Z100')).toEqual({ col: 26, row: 100 });
      expect(parseCellAddress('AA1')).toEqual({ col: 27, row: 1 });
    });
  });

  describe('expandRange', () => {
    it('should expand single cell range', () => {
      const range = { start: 'A1', end: 'A1' };
      expect(expandRange(range)).toEqual(['A1']);
    });

    it('should expand row range', () => {
      const range = { start: 'A1', end: 'C1' };
      expect(expandRange(range)).toEqual(['A1', 'B1', 'C1']);
    });

    it('should expand column range', () => {
      const range = { start: 'A1', end: 'A3' };
      expect(expandRange(range)).toEqual(['A1', 'A2', 'A3']);
    });

    it('should expand rectangular range', () => {
      const range = { start: 'A1', end: 'B2' };
      expect(expandRange(range)).toEqual(['A1', 'B1', 'A2', 'B2']);
    });
  });
});

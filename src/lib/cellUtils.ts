/**
 * Utility functions for cell address parsing and manipulation
 */

import type { CellAddress, CellRange } from '../types';

/**
 * Parse a cell address string (e.g., "A1") into column and row
 */
export function parseCellAddress(address: CellAddress): { col: number; row: number } {
  const match = address.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid cell address: ${address}`);
  }

  const [, colStr, rowStr] = match;
  const col = columnLetterToNumber(colStr);
  const row = parseInt(rowStr, 10);

  if (row < 1) {
    throw new Error(`Invalid row number: ${row}`);
  }

  return { col, row };
}

/**
 * Convert column letter(s) to number (A=1, B=2, ..., Z=26, AA=27, etc.)
 */
export function columnLetterToNumber(letters: string): number {
  let result = 0;
  for (let i = 0; i < letters.length; i++) {
    result = result * 26 + (letters.charCodeAt(i) - 64);
  }
  return result;
}

/**
 * Convert column number to letter(s) (1=A, 2=B, ..., 26=Z, 27=AA, etc.)
 */
export function columnNumberToLetter(num: number): string {
  let result = '';
  while (num > 0) {
    const remainder = (num - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    num = Math.floor((num - 1) / 26);
  }
  return result;
}

/**
 * Create a cell address from column and row numbers
 */
export function createCellAddress(col: number, row: number): CellAddress {
  return `${columnNumberToLetter(col)}${row}`;
}

/**
 * Parse a range string (e.g., "A1:B10") into a CellRange object
 */
export function parseRange(rangeStr: string): CellRange {
  const parts = rangeStr.split(':');
  if (parts.length !== 2) {
    throw new Error(`Invalid range format: ${rangeStr}`);
  }

  return {
    start: parts[0].trim(),
    end: parts[1].trim(),
  };
}

/**
 * Expand a range into an array of all cell addresses within it
 */
export function expandRange(range: CellRange): CellAddress[] {
  const start = parseCellAddress(range.start);
  const end = parseCellAddress(range.end);

  const addresses: CellAddress[] = [];

  for (let row = start.row; row <= end.row; row++) {
    for (let col = start.col; col <= end.col; col++) {
      addresses.push(createCellAddress(col, row));
    }
  }

  return addresses;
}

/**
 * Check if a cell address is within a range
 */
export function isInRange(address: CellAddress, range: CellRange): boolean {
  const cell = parseCellAddress(address);
  const start = parseCellAddress(range.start);
  const end = parseCellAddress(range.end);

  return (
    cell.col >= start.col &&
    cell.col <= end.col &&
    cell.row >= start.row &&
    cell.row <= end.row
  );
}

/**
 * Validate if a string is a valid cell address
 */
export function isValidCellAddress(address: string): boolean {
  if (!/^[A-Z]+\d+$/.test(address)) {
    return false;
  }
  
  // Check that row number is >= 1
  try {
    const { row } = parseCellAddress(address);
    return row >= 1;
  } catch {
    return false;
  }
}

/**
 * Validate if a string is a valid range
 */
export function isValidRange(rangeStr: string): boolean {
  const parts = rangeStr.split(':');
  if (parts.length !== 2) {
    return false;
  }
  return isValidCellAddress(parts[0].trim()) && isValidCellAddress(parts[1].trim());
}

/**
 * Offset a cell address by a given number of columns and rows
 */
export function offsetCellAddress(
  address: CellAddress,
  colOffset: number,
  rowOffset: number
): CellAddress {
  const { col, row } = parseCellAddress(address);
  return createCellAddress(col + colOffset, row + rowOffset);
}

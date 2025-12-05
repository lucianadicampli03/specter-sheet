/**
 * Core cell types and interfaces for SpecterSheet
 */

export type CellAddress = string; // e.g., "A1", "B5"
export type CellValue = string | number | boolean | Date | null;

export interface CellFormat {
  numberFormat?: string; // e.g., "0.00", "$#,##0.00"
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
}

export interface Cell {
  address: CellAddress;
  rawValue: string; // User input or formula
  displayValue: CellValue; // Computed result
  formula: string | null; // Parsed formula if starts with =
  format: CellFormat;
  dependencies: Set<CellAddress>; // Cells this cell depends on
  dependents: Set<CellAddress>; // Cells that depend on this cell
  error: Error | null;
}

export interface CellRange {
  start: CellAddress;
  end: CellAddress;
}

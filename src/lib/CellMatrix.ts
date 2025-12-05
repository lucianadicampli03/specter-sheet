/**
 * CellMatrix - Efficient storage and retrieval of spreadsheet cells
 */

import type { Cell, CellAddress, CellRange, CellValue } from '../types';
import { parseCellAddress, createCellAddress } from './cellUtils';

export class CellMatrix {
  private cells: Map<CellAddress, Cell>;

  constructor() {
    this.cells = new Map();
  }

  /**
   * Get a cell by address
   */
  get(address: CellAddress): Cell | undefined {
    return this.cells.get(address);
  }

  /**
   * Set a cell at the given address
   */
  set(address: CellAddress, cell: Cell): void {
    this.cells.set(address, cell);
  }

  /**
   * Check if a cell exists at the given address
   */
  has(address: CellAddress): boolean {
    return this.cells.has(address);
  }

  /**
   * Delete a cell at the given address
   */
  delete(address: CellAddress): boolean {
    return this.cells.delete(address);
  }

  /**
   * Get all cell addresses
   */
  getAllAddresses(): CellAddress[] {
    return Array.from(this.cells.keys());
  }

  /**
   * Get all cells
   */
  getAllCells(): Cell[] {
    return Array.from(this.cells.values());
  }

  /**
   * Get cells in a range as a 2D array
   */
  getRange(start: CellAddress, end: CellAddress): Cell[][] {
    const startPos = parseCellAddress(start);
    const endPos = parseCellAddress(end);

    const result: Cell[][] = [];

    for (let row = startPos.row; row <= endPos.row; row++) {
      const rowCells: Cell[] = [];
      for (let col = startPos.col; col <= endPos.col; col++) {
        const address = createCellAddress(col, row);
        const cell = this.get(address);
        
        // If cell doesn't exist, create an empty cell
        if (!cell) {
          rowCells.push(this.createEmptyCell(address));
        } else {
          rowCells.push(cell);
        }
      }
      result.push(rowCells);
    }

    return result;
  }

  /**
   * Get cell values in a range as a 2D array
   */
  getRangeValues(range: CellRange): CellValue[][] {
    const cells = this.getRange(range.start, range.end);
    return cells.map(row => row.map(cell => cell.displayValue));
  }

  /**
   * Set multiple cells from a 2D array
   */
  setRange(start: CellAddress, values: CellValue[][]): void {
    const startPos = parseCellAddress(start);

    values.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const address = createCellAddress(
          startPos.col + colIndex,
          startPos.row + rowIndex
        );
        
        const cell = this.get(address) || this.createEmptyCell(address);
        cell.rawValue = String(value ?? '');
        cell.displayValue = value;
        this.set(address, cell);
      });
    });
  }

  /**
   * Clear all cells
   */
  clear(): void {
    this.cells.clear();
  }

  /**
   * Get the number of cells
   */
  size(): number {
    return this.cells.size;
  }

  /**
   * Create an empty cell at the given address
   */
  private createEmptyCell(address: CellAddress): Cell {
    return {
      address,
      rawValue: '',
      displayValue: null,
      formula: null,
      format: {},
      dependencies: new Set(),
      dependents: new Set(),
      error: null,
    };
  }

  /**
   * Get the bounds of all cells (min/max row and column)
   */
  getBounds(): { minRow: number; maxRow: number; minCol: number; maxCol: number } | null {
    if (this.cells.size === 0) {
      return null;
    }

    let minRow = Infinity;
    let maxRow = -Infinity;
    let minCol = Infinity;
    let maxCol = -Infinity;

    for (const address of this.cells.keys()) {
      const { col, row } = parseCellAddress(address);
      minRow = Math.min(minRow, row);
      maxRow = Math.max(maxRow, row);
      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);
    }

    return { minRow, maxRow, minCol, maxCol };
  }

  /**
   * Clone the cell matrix
   */
  clone(): CellMatrix {
    const cloned = new CellMatrix();
    for (const [address, cell] of this.cells.entries()) {
      cloned.set(address, {
        ...cell,
        dependencies: new Set(cell.dependencies),
        dependents: new Set(cell.dependents),
      });
    }
    return cloned;
  }
}

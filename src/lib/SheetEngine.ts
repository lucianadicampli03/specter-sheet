/**
 * SheetEngine - Main spreadsheet engine
 */

import { CellMatrix } from './CellMatrix';
import { FormulaParser } from './FormulaParser';
import { FormulaEvaluator, type EvaluationContext } from './FormulaEvaluator';
import type { Cell, CellAddress, CellValue, CellRange } from '../types';


export class SheetEngine implements EvaluationContext {
  private matrix: CellMatrix;
  private parser: FormulaParser;
  private evaluator: FormulaEvaluator;

  constructor() {
    this.matrix = new CellMatrix();
    this.parser = new FormulaParser();
    this.evaluator = new FormulaEvaluator(this);
  }

  setCellValue(address: CellAddress, value: string): void {
    let cell = this.matrix.get(address);
    
    if (!cell) {
      cell = {
        address,
        rawValue: value,
        displayValue: null,
        formula: null,
        format: {},
        dependencies: new Set(),
        dependents: new Set(),
        error: null,
      };
    }

    cell.rawValue = value;

    // Check if it's a formula
    if (value.startsWith('=')) {
      try {
        const ast = this.parser.parse(value);
        cell.formula = value;
        cell.displayValue = this.evaluator.evaluate(ast);
        cell.error = null;
      } catch (error) {
        cell.error = error as Error;
        cell.displayValue = '#ERROR';
      }
    } else {
      cell.formula = null;
      cell.displayValue = value || null;
      cell.error = null;
    }

    this.matrix.set(address, cell);
  }

  getCellValue(address: CellAddress): CellValue {
    const cell = this.matrix.get(address);
    return cell?.displayValue ?? null;
  }

  getCell(address: CellAddress): Cell | undefined {
    return this.matrix.get(address);
  }

  getRange(range: CellRange): CellValue[][] {
    return this.matrix.getRangeValues(range);
  }

  getAllCells(): Cell[] {
    return this.matrix.getAllCells();
  }

  clear(): void {
    this.matrix.clear();
  }
}

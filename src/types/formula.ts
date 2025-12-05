/**
 * Formula types and AST definitions
 */

import type { CellAddress, CellRange } from './cell';

export interface Formula {
  expression: string; // Original formula string
  ast: FormulaAST; // Parsed abstract syntax tree
  dependencies: Set<CellAddress>;
}

export type FormulaAST =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'cell'; address: CellAddress }
  | { type: 'range'; range: CellRange }
  | { type: 'function'; name: string; args: FormulaAST[] }
  | { type: 'binary'; op: string; left: FormulaAST; right: FormulaAST }
  | { type: 'unary'; op: string; operand: FormulaAST };

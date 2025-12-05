/**
 * Formula Evaluator - Evaluate formula AST to produce values
 */

import type { FormulaAST, CellValue, CellAddress, CellRange } from '../types';

export interface EvaluationContext {
  getCellValue(address: CellAddress): CellValue;
  getRange(range: CellRange): CellValue[][];
}

export class FormulaEvaluator {
  private context: EvaluationContext;

  constructor(context: EvaluationContext) {
    this.context = context;
  }

  /**
   * Evaluate a formula AST
   */
  evaluate(ast: FormulaAST): CellValue {
    try {
      return this.evaluateNode(ast);
    } catch (error) {
      throw new Error(`Evaluation error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Evaluate an AST node
   */
  private evaluateNode(node: FormulaAST): CellValue {
    switch (node.type) {
      case 'number':
        return node.value;
      
      case 'string':
        return node.value;
      
      case 'boolean':
        return node.value;
      
      case 'cell':
        return this.context.getCellValue(node.address);
      
      case 'range':
        // Ranges can't be evaluated directly, they're used in functions
        throw new Error('Cannot evaluate range directly');
      
      case 'function':
        return this.evaluateFunction(node.name, node.args);
      
      case 'binary':
        return this.evaluateBinaryOp(node.op, node.left, node.right);
      
      case 'unary':
        return this.evaluateUnaryOp(node.op, node.operand);
      
      default:
        throw new Error(`Unknown node type: ${(node as any).type}`);
    }
  }

  /**
   * Evaluate a binary operation
   */
  private evaluateBinaryOp(op: string, left: FormulaAST, right: FormulaAST): CellValue {
    const leftVal = this.evaluateNode(left);
    const rightVal = this.evaluateNode(right);

    // Convert to numbers for arithmetic operations
    const leftNum = this.toNumber(leftVal);
    const rightNum = this.toNumber(rightVal);

    switch (op) {
      case '+':
        return leftNum + rightNum;
      case '-':
        return leftNum - rightNum;
      case '*':
        return leftNum * rightNum;
      case '/':
        if (rightNum === 0) {
          throw new Error('Division by zero');
        }
        return leftNum / rightNum;
      case '^':
        return Math.pow(leftNum, rightNum);
      default:
        throw new Error(`Unknown binary operator: ${op}`);
    }
  }

  /**
   * Evaluate a unary operation
   */
  private evaluateUnaryOp(op: string, operand: FormulaAST): CellValue {
    const val = this.evaluateNode(operand);
    const num = this.toNumber(val);

    switch (op) {
      case '-':
        return -num;
      case '+':
        return num;
      default:
        throw new Error(`Unknown unary operator: ${op}`);
    }
  }

  /**
   * Evaluate a function call
   */
  private evaluateFunction(name: string, args: FormulaAST[]): CellValue {
    switch (name) {
      case 'SUM':
        return this.funcSum(args);
      case 'AVERAGE':
      case 'AVG':
        return this.funcAverage(args);
      case 'COUNT':
        return this.funcCount(args);
      case 'MIN':
        return this.funcMin(args);
      case 'MAX':
        return this.funcMax(args);
      case 'IF':
        return this.funcIf(args);
      case 'ABS':
        return this.funcAbs(args);
      case 'ROUND':
        return this.funcRound(args);
      case 'FLOOR':
        return this.funcFloor(args);
      case 'CEIL':
      case 'CEILING':
        return this.funcCeil(args);
      case 'SQRT':
        return this.funcSqrt(args);
      case 'POWER':
      case 'POW':
        return this.funcPower(args);
      case 'LEN':
      case 'LENGTH':
        return this.funcLength(args);
      case 'UPPER':
        return this.funcUpper(args);
      case 'LOWER':
        return this.funcLower(args);
      case 'CONCAT':
        return this.funcConcat(args);
      default:
        throw new Error(`Unknown function: ${name}`);
    }
  }

  // Built-in functions

  private funcSum(args: FormulaAST[]): number {
    const values = this.flattenArgs(args);
    return values.reduce((sum: number, val) => sum + this.toNumber(val), 0);
  }

  private funcAverage(args: FormulaAST[]): number {
    const values = this.flattenArgs(args);
    if (values.length === 0) return 0;
    return this.funcSum(args) / values.length;
  }

  private funcCount(args: FormulaAST[]): number {
    const values = this.flattenArgs(args);
    return values.filter(val => val !== null && val !== '').length;
  }

  private funcMin(args: FormulaAST[]): number {
    const values = this.flattenArgs(args).map(v => this.toNumber(v));
    if (values.length === 0) return 0;
    return Math.min(...values);
  }

  private funcMax(args: FormulaAST[]): number {
    const values = this.flattenArgs(args).map(v => this.toNumber(v));
    if (values.length === 0) return 0;
    return Math.max(...values);
  }

  private funcIf(args: FormulaAST[]): CellValue {
    if (args.length < 2 || args.length > 3) {
      throw new Error('IF requires 2 or 3 arguments');
    }
    
    const condition = this.evaluateNode(args[0]);
    const trueValue = args[1];
    const falseValue = args[2];

    if (this.toBoolean(condition)) {
      return this.evaluateNode(trueValue);
    } else if (falseValue) {
      return this.evaluateNode(falseValue);
    }
    
    return null;
  }

  private funcAbs(args: FormulaAST[]): number {
    if (args.length !== 1) {
      throw new Error('ABS requires 1 argument');
    }
    return Math.abs(this.toNumber(this.evaluateNode(args[0])));
  }

  private funcRound(args: FormulaAST[]): number {
    if (args.length < 1 || args.length > 2) {
      throw new Error('ROUND requires 1 or 2 arguments');
    }
    
    const value = this.toNumber(this.evaluateNode(args[0]));
    const decimals = args.length === 2 ? this.toNumber(this.evaluateNode(args[1])) : 0;
    
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
  }

  private funcFloor(args: FormulaAST[]): number {
    if (args.length !== 1) {
      throw new Error('FLOOR requires 1 argument');
    }
    return Math.floor(this.toNumber(this.evaluateNode(args[0])));
  }

  private funcCeil(args: FormulaAST[]): number {
    if (args.length !== 1) {
      throw new Error('CEIL requires 1 argument');
    }
    return Math.ceil(this.toNumber(this.evaluateNode(args[0])));
  }

  private funcSqrt(args: FormulaAST[]): number {
    if (args.length !== 1) {
      throw new Error('SQRT requires 1 argument');
    }
    const value = this.toNumber(this.evaluateNode(args[0]));
    if (value < 0) {
      throw new Error('SQRT of negative number');
    }
    return Math.sqrt(value);
  }

  private funcPower(args: FormulaAST[]): number {
    if (args.length !== 2) {
      throw new Error('POWER requires 2 arguments');
    }
    const base = this.toNumber(this.evaluateNode(args[0]));
    const exponent = this.toNumber(this.evaluateNode(args[1]));
    return Math.pow(base, exponent);
  }

  private funcLength(args: FormulaAST[]): number {
    if (args.length !== 1) {
      throw new Error('LENGTH requires 1 argument');
    }
    const value = this.evaluateNode(args[0]);
    return String(value ?? '').length;
  }

  private funcUpper(args: FormulaAST[]): string {
    if (args.length !== 1) {
      throw new Error('UPPER requires 1 argument');
    }
    const value = this.evaluateNode(args[0]);
    return String(value ?? '').toUpperCase();
  }

  private funcLower(args: FormulaAST[]): string {
    if (args.length !== 1) {
      throw new Error('LOWER requires 1 argument');
    }
    const value = this.evaluateNode(args[0]);
    return String(value ?? '').toLowerCase();
  }

  private funcConcat(args: FormulaAST[]): string {
    return args.map(arg => String(this.evaluateNode(arg) ?? '')).join('');
  }

  // Helper methods

  /**
   * Flatten arguments (expand ranges into individual values)
   */
  private flattenArgs(args: FormulaAST[]): CellValue[] {
    const result: CellValue[] = [];

    for (const arg of args) {
      if (arg.type === 'range') {
        const rangeValues = this.context.getRange(arg.range);
        for (const row of rangeValues) {
          for (const val of row) {
            result.push(val);
          }
        }
      } else {
        result.push(this.evaluateNode(arg));
      }
    }

    return result;
  }

  /**
   * Convert a value to a number
   */
  private toNumber(value: CellValue): number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    }
    if (value instanceof Date) {
      return value.getTime();
    }
    return 0;
  }

  /**
   * Convert a value to a boolean
   */
  private toBoolean(value: CellValue): boolean {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    if (typeof value === 'string') {
      return value.length > 0 && value.toUpperCase() !== 'FALSE';
    }
    return value !== null;
  }
}

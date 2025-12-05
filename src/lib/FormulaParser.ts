/**
 * Formula Parser - Parse formula strings into AST
 * Supports: numbers, strings, cell references, ranges, functions, operators
 */

import type { FormulaAST, CellAddress } from '../types';
import { isValidCellAddress, isValidRange, parseRange } from './cellUtils';

export class FormulaParser {
  private input: string = '';
  private position: number = 0;

  /**
   * Parse a formula string into an AST
   * Formula should start with '=' but we'll handle it if it doesn't
   */
  parse(formula: string): FormulaAST {
    // Remove leading '=' if present
    this.input = formula.startsWith('=') ? formula.slice(1).trim() : formula.trim();
    this.position = 0;

    if (this.input.length === 0) {
      throw new Error('Empty formula');
    }

    return this.parseExpression();
  }

  /**
   * Parse an expression (handles binary operators)
   */
  private parseExpression(): FormulaAST {
    let left = this.parseTerm();

    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      const op = this.peek();
      if (op === '+' || op === '-') {
        this.advance();
        this.skipWhitespace();
        const right = this.parseTerm();
        left = { type: 'binary', op, left, right };
      } else {
        break;
      }
    }

    return left;
  }

  /**
   * Parse a term (handles * and / operators)
   */
  private parseTerm(): FormulaAST {
    let left = this.parseFactor();

    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      const op = this.peek();
      if (op === '*' || op === '/') {
        this.advance();
        this.skipWhitespace();
        const right = this.parseFactor();
        left = { type: 'binary', op, left, right };
      } else {
        break;
      }
    }

    return left;
  }

  /**
   * Parse a factor (handles power operator)
   */
  private parseFactor(): FormulaAST {
    let left = this.parseUnary();

    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      if (this.peek() === '^') {
        this.advance();
        this.skipWhitespace();
        const right = this.parseUnary();
        left = { type: 'binary', op: '^', left, right };
      } else {
        break;
      }
    }

    return left;
  }

  /**
   * Parse unary expressions (-, +)
   */
  private parseUnary(): FormulaAST {
    this.skipWhitespace();
    
    const op = this.peek();
    if (op === '-' || op === '+') {
      this.advance();
      this.skipWhitespace();
      const operand = this.parseUnary();
      return { type: 'unary', op, operand };
    }

    return this.parsePrimary();
  }

  /**
   * Parse primary expressions (numbers, strings, cells, ranges, functions, parentheses)
   */
  private parsePrimary(): FormulaAST {
    this.skipWhitespace();

    // Parentheses
    if (this.peek() === '(') {
      this.advance();
      const expr = this.parseExpression();
      this.skipWhitespace();
      if (this.peek() !== ')') {
        throw new Error('Expected closing parenthesis');
      }
      this.advance();
      return expr;
    }

    // String literals
    if (this.peek() === '"') {
      return this.parseString();
    }

    // Numbers
    if (this.isDigit(this.peek()) || this.peek() === '.') {
      return this.parseNumber();
    }

    // Boolean literals
    if (this.matchKeyword('TRUE')) {
      return { type: 'boolean', value: true };
    }
    if (this.matchKeyword('FALSE')) {
      return { type: 'boolean', value: false };
    }

    // Functions, cell references, or ranges
    const identifier = this.parseIdentifier();
    
    this.skipWhitespace();
    
    // Function call
    if (this.peek() === '(') {
      return this.parseFunction(identifier);
    }

    // Check if it's a range (e.g., A1:B10)
    if (this.peek() === ':') {
      this.advance();
      const endIdentifier = this.parseIdentifier();
      const rangeStr = `${identifier}:${endIdentifier}`;
      
      if (!isValidRange(rangeStr)) {
        throw new Error(`Invalid range: ${rangeStr}`);
      }
      
      return { type: 'range', range: parseRange(rangeStr) };
    }

    // Cell reference
    if (isValidCellAddress(identifier)) {
      return { type: 'cell', address: identifier as CellAddress };
    }

    throw new Error(`Unknown identifier: ${identifier}`);
  }

  /**
   * Parse a function call
   */
  private parseFunction(name: string): FormulaAST {
    this.advance(); // consume '('
    
    const args: FormulaAST[] = [];
    
    this.skipWhitespace();
    
    // Empty argument list
    if (this.peek() === ')') {
      this.advance();
      return { type: 'function', name: name.toUpperCase(), args };
    }

    // Parse arguments
    while (true) {
      args.push(this.parseExpression());
      this.skipWhitespace();
      
      if (this.peek() === ',') {
        this.advance();
        this.skipWhitespace();
      } else if (this.peek() === ')') {
        this.advance();
        break;
      } else {
        throw new Error('Expected comma or closing parenthesis in function call');
      }
    }

    return { type: 'function', name: name.toUpperCase(), args };
  }

  /**
   * Parse a string literal
   */
  private parseString(): FormulaAST {
    this.advance(); // consume opening quote
    
    let value = '';
    while (this.position < this.input.length && this.peek() !== '"') {
      value += this.peek();
      this.advance();
    }
    
    if (this.peek() !== '"') {
      throw new Error('Unterminated string literal');
    }
    
    this.advance(); // consume closing quote
    
    return { type: 'string', value };
  }

  /**
   * Parse a number
   */
  private parseNumber(): FormulaAST {
    let numStr = '';
    
    while (this.position < this.input.length && 
           (this.isDigit(this.peek()) || this.peek() === '.')) {
      numStr += this.peek();
      this.advance();
    }
    
    const value = parseFloat(numStr);
    if (isNaN(value)) {
      throw new Error(`Invalid number: ${numStr}`);
    }
    
    return { type: 'number', value };
  }

  /**
   * Parse an identifier (function name, cell reference, etc.)
   */
  private parseIdentifier(): string {
    let identifier = '';
    
    while (this.position < this.input.length && 
           (this.isAlphaNumeric(this.peek()) || this.peek() === '_')) {
      identifier += this.peek();
      this.advance();
    }
    
    return identifier;
  }

  /**
   * Match a keyword (case-insensitive)
   */
  private matchKeyword(keyword: string): boolean {
    const remaining = this.input.slice(this.position);
    if (remaining.toUpperCase().startsWith(keyword)) {
      this.position += keyword.length;
      return true;
    }
    return false;
  }

  /**
   * Skip whitespace
   */
  private skipWhitespace(): void {
    while (this.position < this.input.length && this.isWhitespace(this.peek())) {
      this.advance();
    }
  }

  /**
   * Peek at current character
   */
  private peek(): string {
    return this.input[this.position] || '';
  }

  /**
   * Advance to next character
   */
  private advance(): void {
    this.position++;
  }

  /**
   * Check if character is a digit
   */
  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  /**
   * Check if character is alphanumeric
   */
  private isAlphaNumeric(char: string): boolean {
    return (char >= 'a' && char <= 'z') || 
           (char >= 'A' && char <= 'Z') || 
           (char >= '0' && char <= '9');
  }

  /**
   * Check if character is whitespace
   */
  private isWhitespace(char: string): boolean {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r';
  }
}

/**
 * Extract cell dependencies from a formula AST
 */
export function extractDependencies(ast: FormulaAST): Set<CellAddress> {
  const dependencies = new Set<CellAddress>();

  function traverse(node: FormulaAST): void {
    switch (node.type) {
      case 'cell':
        dependencies.add(node.address);
        break;
      case 'range':
        // For ranges, we could expand them, but for dependency tracking
        // we might want to track the range itself or expand it
        // For now, we'll just note that ranges exist
        break;
      case 'function':
        node.args.forEach(traverse);
        break;
      case 'binary':
        traverse(node.left);
        traverse(node.right);
        break;
      case 'unary':
        traverse(node.operand);
        break;
      // Literals don't have dependencies
      case 'number':
      case 'string':
      case 'boolean':
        break;
    }
  }

  traverse(ast);
  return dependencies;
}

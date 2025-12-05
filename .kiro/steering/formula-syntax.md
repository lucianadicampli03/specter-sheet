# Formula Syntax Guidelines

## Overview

SpecterSheet formulas follow Excel-like syntax with support for cell references, ranges, and built-in functions.

## Basic Syntax

All formulas start with `=`:
```
=42
="Hello"
=A1
=A1+B1
=SUM(A1:A10)
```

## Cell References

### Single Cell
- Format: Column letter + Row number
- Examples: `A1`, `B5`, `Z100`, `AA1`
- Case-insensitive: `a1` = `A1`

### Ranges
- Format: `StartCell:EndCell`
- Examples: `A1:A10`, `B2:D5`, `A1:Z100`
- Used in functions: `=SUM(A1:A10)`

## Operators

### Arithmetic
- Addition: `+` → `=A1+B1`
- Subtraction: `-` → `=A1-B1`
- Multiplication: `*` → `=A1*B1`
- Division: `/` → `=A1/B1`
- Exponentiation: `^` → `=A1^2`

### Precedence
1. Parentheses: `()`
2. Exponentiation: `^`
3. Multiplication/Division: `*`, `/`
4. Addition/Subtraction: `+`, `-`

Example: `=2+3*4` → `14` (not `20`)

## Built-in Functions

### Aggregate Functions

**SUM** - Add numbers
```
=SUM(A1:A10)
=SUM(1,2,3,4,5)
=SUM(A1,B1,C1)
```

**AVERAGE** (or AVG) - Calculate mean
```
=AVERAGE(A1:A10)
=AVG(B2:B20)
```

**COUNT** - Count non-empty cells
```
=COUNT(A1:A10)
```

**MIN** - Find minimum
```
=MIN(A1:A10)
=MIN(5,10,3,8)
```

**MAX** - Find maximum
```
=MAX(A1:A10)
=MAX(5,10,3,8)
```

### Math Functions

**ABS** - Absolute value
```
=ABS(-5)  → 5
=ABS(A1)
```

**ROUND** - Round to decimals
```
=ROUND(3.14159, 2)  → 3.14
=ROUND(A1, 0)       → Integer
```

**FLOOR** - Round down
```
=FLOOR(3.7)  → 3
```

**CEIL** (or CEILING) - Round up
```
=CEIL(3.2)  → 4
```

**SQRT** - Square root
```
=SQRT(16)  → 4
=SQRT(A1)
```

**POWER** (or POW) - Exponentiation
```
=POWER(2, 3)  → 8
=POW(A1, 2)   → A1 squared
```

### Logical Functions

**IF** - Conditional
```
=IF(A1>100, "High", "Low")
=IF(B1=0, 0, A1/B1)
```

### String Functions

**UPPER** - Convert to uppercase
```
=UPPER("hello")  → "HELLO"
=UPPER(A1)
```

**LOWER** - Convert to lowercase
```
=LOWER("HELLO")  → "hello"
```

**LENGTH** (or LEN) - String length
```
=LENGTH("hello")  → 5
=LEN(A1)
```

**CONCAT** - Concatenate strings
```
=CONCAT("Hello", " ", "World")
=CONCAT(A1, B1)
```

## Data Types

### Numbers
```
=42
=3.14
=-100
=1e6  (scientific notation)
```

### Strings
```
="Hello"
="Multi word string"
=""  (empty string)
```

### Booleans
```
=TRUE
=FALSE
```

### Null
Empty cells return `null`

## Type Coercion

### To Number
- `"123"` → `123`
- `TRUE` → `1`
- `FALSE` → `0`
- `""` → `0`
- `null` → `0`

### To Boolean
- `0` → `FALSE`
- Non-zero → `TRUE`
- `""` → `FALSE`
- Non-empty string → `TRUE`
- `null` → `FALSE`

## Error Handling

### Error Types
- `#ERROR` - General error
- `#DIV/0` - Division by zero
- `#REF` - Invalid cell reference
- `#NAME` - Unknown function
- `#VALUE` - Type mismatch

### Error Display
Errors show in cell with red background and tooltip explaining the issue.

## Examples

### Budget Tracker
```
A1: "Category"
B1: "Amount"
A2: "Rent"
B2: 1200
A3: "Food"
B3: 400
A4: "Transport"
B4: 150
A5: "Total"
B5: =SUM(B2:B4)
```

### Sales Analysis
```
A1: "Product"
B1: "Quantity"
C1: "Price"
D1: "Revenue"
D2: =B2*C2
D3: =B3*C3
D10: =SUM(D2:D9)
```

### Conditional Formatting
```
A1: 150
B1: =IF(A1>100, "Over Budget", "OK")
```

### Percentage Calculation
```
A1: 80
B1: 100
C1: =ROUND((A1/B1)*100, 1)  → 80.0
```

## Best Practices

1. **Use ranges** instead of individual cells: `=SUM(A1:A10)` not `=A1+A2+A3...`
2. **Name your columns** in row 1 for clarity
3. **Use IF** for conditional logic instead of complex nested formulas
4. **Round financial** calculations: `=ROUND(A1*0.15, 2)`
5. **Check for zero** before division: `=IF(B1=0, 0, A1/B1)`

## AI Integration

When users request formulas in natural language, the AI should:
1. Identify the operation (sum, average, etc.)
2. Determine the cell range
3. Generate the appropriate formula
4. Explain what it does

Example:
- User: "Add up column A"
- AI: Generates `=SUM(A:A)` and explains "This sums all values in column A"

## Future Functions

Planned for future releases:
- DATE functions (TODAY, NOW, DATE)
- LOOKUP functions (VLOOKUP, INDEX, MATCH)
- TEXT functions (LEFT, RIGHT, MID, FIND)
- Statistical functions (MEDIAN, MODE, STDEV)
- Financial functions (PMT, FV, PV)

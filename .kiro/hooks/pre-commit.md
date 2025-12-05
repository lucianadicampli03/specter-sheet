# Pre-Commit Hook Configuration

## Overview
Hooks that run before code is committed to ensure quality and consistency.

## Active Hooks

### 1. TypeScript Type Check
```bash
# Run TypeScript compiler in check mode
npx tsc --noEmit
```
- **Purpose**: Catch type errors before commit
- **Failure Action**: Block commit, show errors

### 2. ESLint Check
```bash
# Run ESLint on staged files
npx eslint --ext .ts,.tsx src/
```
- **Purpose**: Enforce code style and catch common errors
- **Failure Action**: Block commit, show violations

### 3. Test Runner
```bash
# Run tests related to changed files
npm run test -- --passWithNoTests
```
- **Purpose**: Ensure changes don't break existing functionality
- **Failure Action**: Block commit, show failed tests

## Automated Workflows

### On File Save
- Format with Prettier
- Auto-fix ESLint issues
- Update imports

### On Component Creation
- Generate TypeScript interface
- Add to component index
- Create basic test file

### On API Change
- Validate JSON schema
- Update API documentation
- Check for breaking changes


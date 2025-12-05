# 🚀 SpecterSheet Quick Start

## 5-Minute Setup

### 1. Install Dependencies (1 min)
```bash
cd specter-sheet
npm install
```

### 2. Start Development Server (30 sec)
```bash
npm run dev
```

Open http://localhost:5174/

### 3. Try These Commands (3 min)

#### Budget Tracker
Type in the AI command bar:
```
Make a monthly budget tracker
```
Watch as AI creates:
- Category labels (Rent, Food, Transport)
- Amount values
- SUM formula for total
- Suggested pie chart

#### Data Analysis
1. Click **"Analyze Data"** button in left sidebar
2. Click **"Analyze Data"** in the panel
3. See AI insights:
   - Data summary
   - Highest values
   - Formula suggestions
   - Chart recommendations
4. Click **"Apply Formula"** to instantly add formulas
5. Click **"Create Chart"** to visualize data

#### Sales Dashboard
```
Create a sales dashboard with revenue by product
```

#### Chart Creation
```
Add a bar chart showing my expenses
```

## Key Features to Try

### 🗣️ Natural Language
- "Calculate 15% tax on column B"
- "Add a running total"
- "Format as currency"

### 📊 Formulas
Click any cell and type:
- `=SUM(A1:A10)` - Add numbers
- `=AVERAGE(B2:B20)` - Calculate mean
- `=IF(A1>100,"High","Low")` - Conditional
- `=MAX(C:C)` - Find maximum

### 📈 Charts
1. Click "Create Chart" in sidebar
2. Select data range
3. Choose chart type
4. Drag to position

### ⚡ Macros
1. Click "Macro Builder" in sidebar
2. Create automation rules
3. Run with one click

### 🏗️ App Builder
1. Click "Build App" in sidebar
2. Transform spreadsheet into app
3. Export as HTML

## Ghost Theme Features

### Formula Ghost Effect
When AI generates formulas, watch them materialize with ghostly animation.

### Glowing Cells
Cells glow electric green during AI processing.

### Electric Sparks
Data "comes alive" with spark animations.

### Dark Mode
Toggle in top-right corner for spooky theme.

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Activate AI command bar
- `Enter` - Edit selected cell
- `Escape` - Exit AI mode
- `Arrow Keys` - Navigate cells
- `Tab` - Move to next cell

## Testing

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Generate coverage
npm run coverage
```

**Results**: 43 tests, all passing ✅

## Building for Production

```bash
npm run build
```

Output in `dist/` folder.

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5174
lsof -ti:5174 | xargs kill -9
npm run dev
```

### Dependencies issue
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
npm run build -- --mode development
```

## Next Steps

1. ✅ Try all AI commands
2. ✅ Create charts
3. ✅ Build a macro
4. ✅ Use Data Analyzer
5. ✅ Export your work

## Need Help?

- Check README.md for full documentation
- See KIROWEEN_SUBMISSION.md for Kiro usage
- Review .kiro/specs/ for requirements and design

## Demo Video Script

Record yourself:
1. Starting the app
2. Typing "Make a monthly budget tracker"
3. Clicking "Analyze Data"
4. Applying a suggested formula
5. Creating a chart
6. Showing the ghost animations

Keep it under 3 minutes!

## 🎃 Happy Building!

You're ready to submit to Kiroween 2024! 👻

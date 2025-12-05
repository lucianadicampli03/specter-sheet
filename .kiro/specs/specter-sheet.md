# SpecterSheet - AI-Powered Spreadsheet Specification

## Overview
SpecterSheet is a supernatural, AI-powered spreadsheet application that interprets natural-language commands to automatically generate formulas, charts, macros, and full applications. The ghostly theme creates an immersive "haunted spreadsheet" experience.

## Core Features

### 1. Editable Spreadsheet Grid
- **Cell Selection**: Click to select, highlight row/column headers
- **Edit Modes**: Single-click to select, double-click for inline editing
- **Formula Support**: Cells starting with `=` are evaluated as formulas
- **Keyboard Navigation**: Arrow keys, Tab, Enter for movement
- **Ghost Effects**: AI-generating cells show spectral animations

### 2. Formula Engine
- **Supported Functions**: SUM, AVERAGE, COUNT, MIN, MAX, IF, ABS, ROUND, SQRT, POWER
- **Cell References**: A1 notation (e.g., A1, B5, C10)
- **Range References**: A1:B10 format
- **Operators**: +, -, *, /, ^ (power)
- **Auto-recalculation**: Dependent cells update automatically

### 3. AI Command System
- **Natural Language Input**: Users type commands like "Make a budget tracker"
- **Thinking Animation**: Ghost-typing effect while AI processes
- **Simulated Actions**:
  - Generate formulas and insert into cells
  - Create tables with headers and data
  - Trigger chart creation
  - Open App Builder mode
  - Create macros

### 4. AI Activity Drawer
- **Chronological Log**: All AI actions timestamped
- **Action Types**: formula, chart, macro, format, data
- **Clickable Items**: Clicking highlights affected cells
- **Filter Options**: Filter by action type

### 5. Chart System
- **Chart Types**: Bar, Line, Pie, Scatter
- **Modal Preview**: Live preview before adding
- **Draggable/Resizable**: Charts on canvas can be moved and resized
- **Data Binding**: Visual indicator of linked cells

### 6. Macro Builder
- **Step List**: AI-generated macro steps
- **Expandable Details**: Click to see action parameters
- **Run Simulation**: Execute macro with visual feedback
- **Code Preview**: Generated JavaScript representation

### 7. App Builder Mode
- **Auto-Generated Form**: Form fields from table headers
- **Dashboard View**: Charts and statistics
- **Data Summary**: Calculated aggregates
- **Live Sync**: Connected to spreadsheet data

### 8. Spooky UI Theme
- **Ghost Logo**: Animated glowing ghost icon
- **Spectral Colors**: Emerald/teal in dark mode, Indigo/purple in light
- **Particle Effects**: Floating particles when AI is active
- **Ghost-Typing**: Character-by-character cell population
- **Glow Effects**: Selected cells and AI-active elements glow
- **Dark Mode**: Full dark theme with ghostly accents

## Technical Architecture

### State Management
- React useState/useCallback hooks
- SheetEngine class for formula evaluation
- CellMatrix for efficient cell storage

### Component Structure
```
App.tsx
├── Navigation (top bar, file menu)
├── FormulaBar (cell address, formula input, AI toggle)
├── SidebarPanel (commands, history, quick actions)
├── SpreadsheetGrid (cells, charts layer)
│   └── DraggableChart
├── AIOutputDrawer (activity log)
├── ChartModal (chart creation)
├── MacroBuilder (automation panel)
├── WizardSidebar (app builder wizard)
├── CreateSheetModal (new sheet templates)
└── AppBuilderMode (full app view)
```

### Data Types
- `CellAddress`: String like "A1", "B5"
- `CellValue`: string | number | boolean | Date | null
- `Cell`: Contains raw value, display value, formula, dependencies
- `Chart`: Type, data range, position, size
- `Macro`: Name, trigger, actions, code

## User Flows

### Flow 1: Create Budget Tracker
1. User types "Make a monthly budget tracker"
2. AI thinking animation shows
3. Cells populate with ghost-typing effect
4. Headers: Category, Budget, Actual, Difference
5. Sample data with formulas inserted
6. Activity drawer shows all actions

### Flow 2: Generate Chart
1. User clicks "Create Chart" or types "make a chart"
2. Chart modal opens with preview
3. User selects type and confirms
4. Chart appears on canvas, draggable/resizable
5. Data binding indicator shows linked cells

### Flow 3: Build App
1. User types "Generate an app from this sheet"
2. AI creates inventory/table structure
3. App Builder mode opens
4. Shows auto-generated form, dashboard, summary
5. User can navigate back to sheet

## Acceptance Criteria
- [ ] All cells are selectable and editable
- [ ] Formulas evaluate correctly with dependencies
- [ ] AI commands produce visual feedback
- [ ] Charts can be created, dragged, and resized
- [ ] Macro steps are visible and executable
- [ ] App Builder generates functional views
- [ ] Ghost/spectral theme is consistent throughout
- [ ] Dark/light mode toggle works
- [ ] File menu operations function


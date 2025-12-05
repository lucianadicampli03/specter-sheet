# 👻 SpecterSheet - Spreadsheets That Code Themselves

> **Kiroween 2024 Hackathon - FRANKENSTEIN Category**

A haunting fusion of AI, spreadsheets, charts, and automation - stitched together like Frankenstein's monster to create something unexpectedly powerful.

## 🎃 What is SpecterSheet?

SpecterSheet is a **CHIMERA** - a monstrous blend of incompatible technologies:

- 🧠 **AI Brain**: Groq LLM (Llama 3.1-70B) for natural language understanding
- 📊 **Spreadsheet Body**: Full Excel-like grid with formulas (SUM, AVERAGE, IF, etc.)
- 📈 **Chart Limbs**: Recharts for real-time data visualization
- 🏗️ **App Builder Heart**: No-code app generation from spreadsheet data
- ⚡ **Macro Nervous System**: Automation scripts that execute on triggers
- 🎨 **Animated Skin**: Framer Motion for ghost-themed UI effects
- ☁️ **Cloud Mind**: Real-time API integration for AI processing

**Users speak NATURAL LANGUAGE → AI interprets → Spreadsheet TRANSFORMS → Charts VISUALIZE → Apps GET BUILT**

## ✨ Key Features

### 🗣️ Natural Language Interface
```
You: "Make a monthly budget tracker"
AI: *Creates categories, amounts, SUM formulas, and a pie chart*
```

### 📊 Intelligent Formula Engine
- 15+ built-in functions (SUM, AVERAGE, MIN, MAX, IF, ABS, ROUND, etc.)
- Cell references (A1, B2) and ranges (A1:B10)
- Automatic dependency tracking and recalculation
- Property-based tested for correctness

### 📈 AI-Powered Charts
- Request "chart my expenses" → AI suggests appropriate visualization
- Drag-and-drop positioning
- Real-time data updates
- Multiple chart types (bar, line, pie, scatter)

### ⚡ Macro Automation
- Create rules: "When A1 > 100, set B1 to 'Over Budget'"
- Manual and conditional triggers
- Visual macro builder
- AI-generated automation scripts

### 🏗️ App Builder Mode
- Transform spreadsheet into interactive application
- No-code interface generation
- Export as standalone HTML
- Professional templates

### 👻 Ghost-Themed UI
- **Formula Ghost**: Watch formulas materialize in cells
- **Glowing Cells**: Electric green during AI processing
- **Electric Sparks**: When data "comes alive"
- **Dark Mode**: Spooky color palette

## 🚀 Quick Start

### Installation
```bash
cd specter-sheet
npm install
```

### Development
```bash
npm run dev
```
Open http://localhost:5174/

### Try These Commands
- "Make a monthly budget tracker"
- "Create a sales dashboard with revenue by product"
- "Add a chart showing expense breakdown"
- "Calculate 15% tax on column B"

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:ui       # Visual test runner
npm run coverage      # Generate coverage report
```

**Test Results:**
- ✅ 43 tests passing
- ✅ 100+ property test iterations per test
- ✅ 0 failures
- ✅ Comprehensive coverage of core logic

## 🛠️ Technology Stack

### Frontend
- **React 18**: UI framework with hooks
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **TailwindCSS**: Utility-first styling
- **Framer Motion**: Animations
- **Recharts**: Charts

### Backend/AI
- **Groq API**: Llama 3.1-70B for natural language
- **LocalStorage**: Client-side persistence

### Testing
- **Vitest**: Unit testing
- **fast-check**: Property-based testing
- **Testing Library**: Component testing

## 📁 Project Structure

```
specter-sheet/
├── .kiro/
│   ├── specs/specter-sheet/
│   │   ├── requirements.md    # EARS-compliant requirements
│   │   ├── design.md          # Architecture + 29 correctness properties
│   │   └── tasks.md           # 80+ implementation tasks
│   ├── steering/
│   │   ├── frankenstein-theme.md
│   │   ├── formula-syntax.md
│   │   └── testing-standards.md
│   └── hooks/
│       ├── test-on-save.json
│       └── format-on-commit.json
├── src/
│   ├── components/            # React UI components
│   │   ├── SpreadsheetGrid.tsx
│   │   ├── FormulaBar.tsx
│   │   ├── AIOutputDrawer.tsx
│   │   ├── ChartModal.tsx
│   │   └── ...
│   ├── lib/                   # Core logic
│   │   ├── SheetEngine.ts     # Main spreadsheet engine
│   │   ├── FormulaParser.ts   # Formula syntax parser
│   │   ├── FormulaEvaluator.ts # Formula computation
│   │   ├── CellMatrix.ts      # Data storage
│   │   ├── cellUtils.ts       # Cell address utilities
│   │   └── groqAI.ts          # AI integration
│   ├── types/                 # TypeScript definitions
│   └── test/                  # Test utilities
├── KIROWEEN_SUBMISSION.md     # Hackathon submission details
└── README.md                  # This file
```

## 🎯 Kiro Usage

### 1. Spec-Driven Development ⭐⭐⭐⭐⭐
- Complete requirements with 50 EARS-compliant acceptance criteria
- Comprehensive design with 29 correctness properties
- 80+ implementation tasks with clear dependencies

### 2. Property-Based Testing 🧪
- 43 tests with 100+ iterations each
- Tests validate correctness across ALL possible inputs
- Caught edge cases that unit tests would miss

### 3. Vibe Coding 💬
- Generated 350+ line formula parser in one conversation
- Complex components with proper architecture
- AI integration with structured responses

### 4. MCP Integration 🔌
- Groq AI for natural language processing
- File upload for CSV/Excel import
- Seamless external data connectivity

### 5. Agent Hooks 🪝
- Test on save for immediate feedback
- Format on commit for consistency
- Build checks for type safety

### 6. Steering Documents 📋
- Frankenstein theme guidelines
- Formula syntax standards
- Testing requirements

## 🏆 Why SpecterSheet Wins

### Perfect Frankenstein
Stitches together AI, spreadsheets, charts, and apps - technologies that don't naturally work together.

### Kiro Showcase
Demonstrates ALL Kiro features: specs, property-based testing, MCP, hooks, steering, vibe coding.

### Potential Value
Solves real problem for 3 billion+ spreadsheet users worldwide.

### Implementation Quality
- Clean architecture with separation of concerns
- Comprehensive test coverage with formal correctness
- Professional UI with polished animations

### Creativity & Design
- Ghost-themed UI with "Formula Ghost" effect
- Innovative AI integration
- Smooth animations and interactions

## 📝 License

MIT License - See LICENSE file for details

## 🎃 Hackathon Submission

**Category**: Frankenstein  
**Date**: December 5, 2024  
**Demo**: http://localhost:5174/  
**Video**: [3-minute demo URL]  
**Repository**: [GitHub URL]

See [KIROWEEN_SUBMISSION.md](./KIROWEEN_SUBMISSION.md) for complete submission details.

## 🙏 Acknowledgments

Built with Kiro for Kiroween 2024 🎃👻

**This is literally Kiro's power applied to the world's most-used tool.** 🚀

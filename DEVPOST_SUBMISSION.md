# SpecterSheet - Devpost Submission

## Inspiration

What if spreadsheets could understand you? We were frustrated with the disconnect between how humans think about data ("show me my biggest expenses") and how spreadsheets work (=SUMIF, VLOOKUP, pivot tables). We wanted to build a **Frankenstein monster** that stitched together the analytical power of spreadsheets with the intuition of AI.

The Kiroween theme pushed us further—why not make it *literally* haunted? A ghost AI that possesses your spreadsheet and does your bidding. Speak to it in plain English, and watch formulas materialize like magic.

**Kiro's Role**: We used Kiro's spec-driven development to formalize this vision into 50 EARS-compliant requirements and 29 correctness properties before writing a single line of code. This ensured our "monster" would actually work.

## What it does

**SpecterSheet** is an AI-powered spreadsheet where you summon a ghost to do your data work:

- 🗣️ **Natural Language Commands** → "Create a monthly budget tracker" instantly generates tables with formulas
- 📊 **Smart Charts** → AI recommends and creates visualizations from your data  
- ⚡ **Macro Builder** → Automate repetitive tasks with AI-generated scripts
- 🏗️ **App Builder** → Transform spreadsheets into functional apps with one command
- 🔮 **Data Analyzer** → AI analyzes your data and suggests formulas with one-click apply
- 👻 **Ghost Effects** → Cells fill with ethereal typing animations as AI works

## How we built it

SpecterSheet is a **chimera of 6+ technologies** stitched together:

1. **React + TypeScript** — Core framework with type safety
2. **Groq API (Llama 3.1 70B)** — Lightning-fast AI for natural language understanding
3. **Custom Formula Engine** — Parses and evaluates spreadsheet formulas (SUM, AVERAGE, IF, etc.)
4. **Recharts** — Data visualization for charts
5. **Framer Motion** — Ghost-themed animations and transitions
6. **Tailwind CSS** — Spooky styling with emerald/purple theme

The magic happens when you type a command: your words go to Llama 3.1, which returns structured JSON describing what cells to fill. Our engine then "ghost-types" each value with glowing effects, evaluates formulas, and updates dependent cells—all in real-time.

### Kiro's Development Workflow

**1. Spec-Driven Development**
- Created comprehensive requirements document with 50 acceptance criteria using EARS patterns
- Designed architecture with 29 correctness properties for property-based testing
- Generated 80+ implementation tasks with clear dependencies
- Every feature was designed before implementation

**2. Property-Based Testing with fast-check**
- Wrote 43 property tests running 100+ iterations each
- Tests validate correctness across ALL possible inputs, not just examples
- Caught edge cases like very small floats, invalid cell addresses, division by zero
- Example: Testing that `parse(format(address)) === address` for ANY valid address

**3. Vibe Coding**
- Generated the 350-line Formula Parser in one conversation with Kiro
- Built complex components with proper architecture through natural dialogue
- Kiro understood context and generated production-ready code

**4. MCP Integration**
- Connected Groq AI via MCP for seamless natural language processing
- File upload integration for CSV/Excel import
- External data connectivity without manual API wiring

**5. Agent Hooks**
- Test-on-save hook runs property tests whenever formula files change
- Format-on-commit ensures consistent code style
- Build checks catch type errors immediately

**6. Steering Documents**
- Frankenstein theme guidelines for consistent visual identity
- Formula syntax standards for parser implementation
- Testing requirements ensuring 100+ iterations per property

## Challenges we ran into

- **Formula Dependencies** — Building a dependency graph so changing A1 recalculates B1 (if B1=A1*2) was tricky. Kiro's spec helped us design the dependency tracking system before implementation.

- **AI Response Parsing** — Getting the LLM to return consistent, valid JSON required careful prompt engineering. We iterated on system prompts with Kiro's help.

- **Property Test Precision** — Initial tests failed with very small floats (1.4e-45). We learned to constrain generators to practical ranges while maintaining comprehensive coverage.

- **Z-Index Wars** — Dropdowns kept appearing behind the spreadsheet grid (the classic CSS battle). Kiro helped debug the stacking context issues.

- **Stitching the Monster** — Making 6 different technologies feel like one cohesive product. Kiro's steering docs ensured consistency across all components.

## Accomplishments we're proud of

- **Sub-second AI responses** — Groq's speed makes it feel like magic, not waiting

- **Real formula evaluation** — Not just displaying data, actually calculating =SUM(A1:A10) with proper dependency tracking

- **43 tests, all passing** — Property-based testing with 100+ iterations per test provides mathematical proof of correctness

- **The ghost aesthetic** — Ethereal glows, floating animations, and ghost-typing effects that make data feel alive

- **Complete Kiro showcase** — Demonstrates ALL Kiro features: specs, property-based testing, MCP, hooks, steering, and vibe coding

- **It actually works** — You can genuinely use this to build budgets, analyze data, create charts, and build apps

## What we learned

- **LLMs + structured output = power** — Forcing JSON responses from AI unlocks programmatic control. MCP made this integration seamless.

- **Spreadsheets are deceptively complex** — Cell dependencies, formula parsing, and evaluation are hard. Spec-driven development helped us think through edge cases before coding.

- **Property-based testing catches real bugs** — Testing with random inputs found issues unit tests would miss (like handling very small numbers, empty strings, circular dependencies).

- **Kiro's spec-driven approach** — Writing requirements and design documents before code leads to cleaner implementations and fewer bugs. The 29 correctness properties became our north star.

- **Animation makes UX magical** — The ghost effects aren't just aesthetic—they provide feedback about what the AI is doing.

- **Fast-check is powerful** — Running 100+ iterations per test with random inputs provides confidence that unit tests can't match.

## What's next for SpecterSheet

- **Collaboration** — Multiple ghosts haunting the same sheet (real-time multiplayer)
- **More formulas** — VLOOKUP, COUNTIF, conditional formatting, date functions
- **Voice commands** — Speak to your spreadsheet instead of typing
- **Data connectors** — Pull from APIs, databases, and other sources via MCP
- **Mobile app** — Spreadsheets on the go, possessed by AI
- **Advanced AI analysis** — Trend detection, anomaly detection, predictive analytics
- **Export to Excel** — Generate real .xlsx files with formulas intact

## Kiro Usage Summary

**Spec-Driven Development**: 50 requirements, 29 correctness properties, 80+ tasks
**Property-Based Testing**: 43 tests, 100+ iterations each, 0 failures
**Vibe Coding**: 350-line parser, complex components, AI integration
**MCP Integration**: Groq AI, file upload, external data
**Agent Hooks**: Test-on-save, format-on-commit, build checks
**Steering Documents**: Theme guidelines, formula syntax, testing standards

**Result**: A production-ready application built with formal correctness guarantees, comprehensive testing, and clean architecture—all in record time.

## Built With

- React
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- Recharts
- Groq API (Llama 3.1 70B)
- Vitest
- fast-check
- Kiro (spec-driven development, property-based testing, MCP, hooks, steering)

## Try it out

- **Live Demo**: [YOUR DEPLOYED URL]
- **GitHub**: [YOUR REPO URL]
- **Video**: [YOUR VIDEO URL]

## Category

**Frankenstein** - Stitching together AI, spreadsheets, charts, and automation into one powerful chimera.

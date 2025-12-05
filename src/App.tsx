import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navigation } from './components/Navigation';
import { FormulaBar } from './components/FormulaBar';
import { SpreadsheetGrid } from './components/SpreadsheetGrid';
import { SidebarPanel } from './components/SidebarPanel';
import { AIOutputDrawer } from './components/AIOutputDrawer';
import { ChartModal } from './components/ChartModal';
import { WizardSidebar } from './components/WizardSidebar';
import { CreateSheetModal } from './components/CreateSheetModal';
import { MacroBuilder } from './components/MacroBuilder';
import { AppBuilderMode } from './components/AppBuilderMode';
import { DataAnalyzerPanel } from './components/DataAnalyzerPanel';
import { SheetEngine } from './lib/SheetEngine';
import { callGroqAI } from './lib/groqAI';
import type { CellAddress, CellValue, Chart, Macro } from './types';

// AI Action types for activity log
export interface AIAction {
  id: string;
  time: string;
  action: string;
  detail: string;
  type: 'formula' | 'chart' | 'macro' | 'format' | 'data';
  affectedCells?: CellAddress[];
  chartId?: string;
  macroId?: string;
}

// Command history type
export interface CommandHistoryItem {
  id: string;
  time: string;
  command: string;
  status: 'completed' | 'failed';
}

function App() {
  // Theme and UI state
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showMacroBuilder, setShowMacroBuilder] = useState(false);
  const [appBuilderMode, setAppBuilderMode] = useState(false);
  const [showDataAnalyzer, setShowDataAnalyzer] = useState(false);
  
  // Sheet state
  const [sheetName, setSheetName] = useState('Untitled SpecterSheet');
  const engineRef = useRef<SheetEngine>(new SheetEngine());
  const [cellData, setCellData] = useState<Map<CellAddress, { raw: string; display: CellValue; error: string | null }>>(new Map());
  
  // Selection state
  const [selectedCell, setSelectedCell] = useState<CellAddress | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: CellAddress; end: CellAddress } | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<Set<CellAddress>>(new Set());
  
  // AI state
  const [aiActive, setAiActive] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiGeneratingCells, setAiGeneratingCells] = useState<Set<CellAddress>>(new Set());
  const [aiCommand, setAiCommand] = useState('');
  const [aiActions, setAiActions] = useState<AIAction[]>([]);
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([
    { id: '1', time: '2m ago', command: 'Create monthly budget tracker', status: 'completed' },
    { id: '2', time: '15m ago', command: 'Generate revenue projections', status: 'completed' },
    { id: '3', time: '1h ago', command: 'Build expense categorization', status: 'completed' },
  ]);
  
  // Charts and Macros
  const [charts, setCharts] = useState<Chart[]>([]);
  const [macros, setMacros] = useState<Macro[]>([]);
  const [pendingChart, setPendingChart] = useState<Partial<Chart> | null>(null);
  
  // Formula bar state
  const [formulaBarValue, setFormulaBarValue] = useState('');
  
  // Sync formula bar with selected cell
  useEffect(() => {
    if (selectedCell) {
      const cellInfo = cellData.get(selectedCell);
      setFormulaBarValue(cellInfo?.raw || '');
    } else {
      setFormulaBarValue('');
    }
  }, [selectedCell, cellData]);
  
  // Escape key to exit AI mode
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aiActive) {
        setAiActive(false);
        setAiCommand('');
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [aiActive]);
  
  // Cell operations
  const updateCell = useCallback((address: CellAddress, rawValue: string) => {
    const engine = engineRef.current;
    engine.setCellValue(address, rawValue);
    
    const cell = engine.getCell(address);
    setCellData(prev => {
      const next = new Map(prev);
      next.set(address, {
        raw: rawValue,
        display: cell?.displayValue ?? null,
        error: cell?.error?.message ?? null,
      });
      return next;
    });
    
    // Also update dependents in cellData
    const allCells = engine.getAllCells();
    setCellData(prev => {
      const next = new Map(prev);
      for (const c of allCells) {
        if (c.address !== address) {
          next.set(c.address, {
            raw: c.rawValue,
            display: c.displayValue,
            error: c.error?.message ?? null,
          });
        }
      }
      return next;
    });
  }, []);
  
  // AI Command Processing (using Groq AI)
  const processAICommand = useCallback(async (command: string) => {
    if (!command.trim()) return;
    
    console.log('🚀 Processing AI command:', command);
    
    setAiThinking(true);
    setAiActive(true);
    setDrawerOpen(true);
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newActions: AIAction[] = [];
    
    try {
      // Call Groq AI
      console.log('📡 Calling Groq API...');
      const response = await callGroqAI(command);
      console.log('✅ Got response:', response);
      
      // Handle chart creation
      if (response.action === 'create-chart' && response.chartConfig) {
        setPendingChart({
          type: response.chartConfig.type,
          dataRange: { start: 'A1', end: 'B6' },
          config: {
            type: response.chartConfig.type,
            dataRange: { start: 'A1', end: 'B6' },
            title: response.chartConfig.title || 'Chart',
          },
        });
        setShowChartModal(true);
        
        newActions.push({
          id: crypto.randomUUID(),
          time: timestamp,
          action: `Preparing ${response.chartConfig.type} chart`,
          detail: response.chartConfig.title || 'Chart',
          type: 'chart',
        });
      }
      
      // Handle cell filling - find empty space first
      if (response.cells && response.cells.length > 0) {
        const affectedCells: CellAddress[] = [];
        
        // Find first empty column by scanning existing data
        let startCol = 0; // A = 0
        for (let col = 0; col < 26; col++) {
          const colLetter = String.fromCharCode(65 + col);
          let colEmpty = true;
          for (let row = 1; row <= 10; row++) {
            const cell = cellData.get(`${colLetter}${row}` as CellAddress);
            if (cell?.raw && cell.raw.trim() !== '') {
              colEmpty = false;
              break;
            }
          }
          if (colEmpty) {
            startCol = col;
            break;
          }
          startCol = col + 1; // Move to next column after last occupied
        }
        
        // Offset the AI cells to empty area
        const offsetCells = response.cells.map(({ address, value }) => {
          const match = address.match(/([A-Z]+)(\d+)/);
          if (!match) return { address, value };
          
          const origCol = match[1].charCodeAt(0) - 65; // A=0, B=1, etc.
          const row = match[2];
          const newCol = String.fromCharCode(65 + startCol + origCol);
          const newAddress = `${newCol}${row}`;
          
          // Also offset any cell references in formulas
          let newValue = value;
          if (value.startsWith('=')) {
            newValue = value.replace(/([A-Z]+)(\d+)/g, (_, col, r) => {
              const colNum = col.charCodeAt(0) - 65;
              const newColLetter = String.fromCharCode(65 + startCol + colNum);
              return `${newColLetter}${r}`;
            });
          }
          
          return { address: newAddress, value: newValue };
        });
        
        for (const { address, value } of offsetCells) {
          const cellAddress = address as CellAddress;
          affectedCells.push(cellAddress);
          setAiGeneratingCells(prev => new Set([...prev, cellAddress]));
          
          await new Promise(resolve => setTimeout(resolve, 60));
          updateCell(cellAddress, value);
          
          setTimeout(() => {
            setAiGeneratingCells(prev => {
              const next = new Set(prev);
              next.delete(cellAddress);
              return next;
            });
          }, 400);
        }
        
        const startColLetter = String.fromCharCode(65 + startCol);
        newActions.push({
          id: crypto.randomUUID(),
          time: timestamp,
          action: response.message || 'AI generated data',
          detail: `${response.cells.length} cells added starting at column ${startColLetter}`,
          type: response.cells.some(c => c.value.startsWith('=')) ? 'formula' : 'data',
          affectedCells: affectedCells.slice(0, 10),
        });
      }
      
      // Handle app builder
      if (response.action === 'build-app') {
        setTimeout(() => {
          setAppBuilderMode(true);
        }, 1000);
        
        newActions.push({
          id: crypto.randomUUID(),
          time: timestamp,
          action: 'Opening App Builder',
          detail: response.message || 'Building app from data...',
          type: 'data',
        });
      }
      
      // Handle macro creation
      if (response.action === 'create-macro') {
        const newMacro: Macro = {
          id: crypto.randomUUID(),
          name: response.message || 'AI Generated Macro',
          description: 'Created by AI',
          trigger: { type: 'manual' },
          actions: response.cells?.map(c => ({
            type: 'set-cell' as const,
            address: c.address,
            value: c.value,
          })) || [],
          code: '// AI-generated macro',
          enabled: true,
        };
        
        setMacros(prev => [...prev, newMacro]);
        setShowMacroBuilder(true);
        
        newActions.push({
          id: crypto.randomUUID(),
          time: timestamp,
          action: 'Created new macro',
          detail: newMacro.name,
          type: 'macro',
          macroId: newMacro.id,
        });
      }
      
    } catch (error) {
      console.error('❌ AI error:', error);
      alert(`Error: ${error}`);
      newActions.push({
        id: crypto.randomUUID(),
        time: timestamp,
        action: 'AI encountered an error',
        detail: 'Using fallback response',
        type: 'data',
      });
    }
    
    console.log('✅ AI command completed!');
    
    // Update AI actions and command history
    setAiActions(prev => [...newActions, ...prev]);
    setCommandHistory(prev => [{
      id: crypto.randomUUID(),
      time: 'Just now',
      command,
      status: 'completed',
    }, ...prev]);
    
    setAiThinking(false);
    setAiCommand('');
    
    // Deactivate AI after a delay
    setTimeout(() => {
      setAiActive(false);
    }, 3000);
  }, [updateCell]);
  
  // Handle formula bar submission
  const handleFormulaBarSubmit = useCallback(() => {
    if (selectedCell) {
      updateCell(selectedCell, formulaBarValue);
    }
  }, [selectedCell, formulaBarValue, updateCell]);
  
  // Handle AI action click (highlight affected cells)
  const handleAIActionClick = useCallback((action: AIAction) => {
    if (action.affectedCells && action.affectedCells.length > 0) {
      setHighlightedCells(new Set(action.affectedCells));
      setSelectedCell(action.affectedCells[0]);
      
      // Clear highlight after 2 seconds
      setTimeout(() => {
        setHighlightedCells(new Set());
      }, 2000);
    }
    
    if (action.chartId) {
      // Find and highlight chart
      const chart = charts.find(c => c.id === action.chartId);
      if (chart) {
        // Scroll to chart or highlight it
      }
    }
  }, [charts]);
  
  // Handle file upload
  const handleFileUpload = useCallback(async (data: { headers: string[]; rows: string[][] }) => {
    setAiActive(true);
    setAiThinking(true);
    setDrawerOpen(true);
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const affectedCells: CellAddress[] = [];
    
    // Insert headers
    for (let col = 0; col < data.headers.length; col++) {
      const colLetter = String.fromCharCode(65 + col);
      const address = `${colLetter}1` as CellAddress;
      affectedCells.push(address);
      
      setAiGeneratingCells(prev => new Set([...prev, address]));
      await new Promise(resolve => setTimeout(resolve, 30));
      updateCell(address, data.headers[col]);
      
      setTimeout(() => {
        setAiGeneratingCells(prev => {
          const next = new Set(prev);
          next.delete(address);
          return next;
        });
      }, 300);
    }
    
    // Insert data rows
    for (let row = 0; row < Math.min(data.rows.length, 100); row++) {
      for (let col = 0; col < data.rows[row].length; col++) {
        const colLetter = String.fromCharCode(65 + col);
        const address = `${colLetter}${row + 2}` as CellAddress;
        affectedCells.push(address);
        
        setAiGeneratingCells(prev => new Set([...prev, address]));
        await new Promise(resolve => setTimeout(resolve, 10));
        updateCell(address, data.rows[row][col]);
        
        setTimeout(() => {
          setAiGeneratingCells(prev => {
            const next = new Set(prev);
            next.delete(address);
            return next;
          });
        }, 200);
      }
    }
    
    // Log the action
    setAiActions(prev => [{
      id: crypto.randomUUID(),
      time: timestamp,
      action: `Imported ${data.rows.length} rows from file`,
      detail: `Columns: ${data.headers.join(', ')}`,
      type: 'data',
      affectedCells: affectedCells.slice(0, 20),
    }, ...prev]);
    
    setCommandHistory(prev => [{
      id: crypto.randomUUID(),
      time: 'Just now',
      command: `Upload file (${data.rows.length} rows)`,
      status: 'completed',
    }, ...prev]);
    
    setAiThinking(false);
    setTimeout(() => setAiActive(false), 2000);
  }, [updateCell]);
  
  // Add chart to canvas
  const handleAddChart = useCallback((chartConfig: Partial<Chart>) => {
    const newChart: Chart = {
      id: crypto.randomUUID(),
      type: chartConfig.type || 'bar',
      dataRange: chartConfig.dataRange || { start: 'A1', end: 'B6' },
      config: chartConfig.config || {
        type: 'bar',
        dataRange: { start: 'A1', end: 'B6' },
        title: 'Chart',
      },
      position: { x: 500, y: 100 },
      size: { width: 400, height: 300 },
    };
    
    setCharts(prev => [...prev, newChart]);
    setShowChartModal(false);
    setPendingChart(null);
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setAiActions(prev => [{
      id: crypto.randomUUID(),
      time: timestamp,
      action: `Added ${newChart.type} chart to canvas`,
      detail: `Data range: ${newChart.dataRange.start}:${newChart.dataRange.end}`,
      type: 'chart',
      chartId: newChart.id,
    }, ...prev]);
  }, []);
  
  // Run macro
  const handleRunMacro = useCallback((macro: Macro) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    // Simulate macro execution
    for (const action of macro.actions) {
      if (action.type === 'set-cell') {
        setAiGeneratingCells(prev => new Set([...prev, action.address]));
        setTimeout(() => {
          updateCell(action.address, action.value);
          setAiGeneratingCells(prev => {
            const next = new Set(prev);
            next.delete(action.address);
            return next;
          });
        }, 500);
      }
    }
    
    setAiActions(prev => [{
      id: crypto.randomUUID(),
      time: timestamp,
      action: `Executed macro: ${macro.name}`,
      detail: `${macro.actions.length} actions performed`,
      type: 'macro',
      macroId: macro.id,
    }, ...prev]);
  }, [updateCell]);
  
  // If in app builder mode, render that instead
  if (appBuilderMode) {
    return (
      <AppBuilderMode
        darkMode={darkMode}
        cellData={cellData}
        onBack={() => setAppBuilderMode(false)}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
    );
  }
  
  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      {/* Top Navigation */}
      <Navigation
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onSummonAI={() => setAiActive(!aiActive)}
        aiActive={aiActive}
        onShowCreate={() => setShowCreateModal(true)}
        sheetName={sheetName}
        onSheetNameChange={setSheetName}
        onFileUpload={handleFileUpload}
      />
      
      {/* Formula Bar */}
      <FormulaBar
        darkMode={darkMode}
        aiActive={aiActive}
        aiThinking={aiThinking}
        selectedCell={selectedCell}
        value={formulaBarValue}
        onChange={setFormulaBarValue}
        onSubmit={handleFormulaBarSubmit}
        aiCommand={aiCommand}
        onAICommandChange={setAiCommand}
        onAICommandSubmit={() => processAICommand(aiCommand)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-0">
        {/* Left Sidebar */}
        <SidebarPanel
          darkMode={darkMode}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onShowChart={() => setShowChartModal(true)}
          onShowWizard={() => setShowWizard(true)}
          onActivateAI={() => setAiActive(true)}
          commandHistory={commandHistory}
          onCommandSelect={(cmd) => {
            setAiCommand(cmd);
            processAICommand(cmd);
          }}
          onShowMacroBuilder={() => setShowMacroBuilder(true)}
          onShowDataAnalyzer={() => setShowDataAnalyzer(true)}
        />
        
        {/* Spreadsheet Grid */}
        <div className="flex-1 flex flex-col relative min-w-0">
          <SpreadsheetGrid
            darkMode={darkMode}
            aiActive={aiActive}
            aiGeneratingCells={aiGeneratingCells}
            selectedCell={selectedCell}
            selectedRange={selectedRange}
            highlightedCells={highlightedCells}
            cellData={cellData}
            onCellSelect={setSelectedCell}
            onCellRangeSelect={setSelectedRange}
            onCellChange={updateCell}
            charts={charts}
            onChartUpdate={(id, updates) => {
              setCharts(prev => prev.map(c => 
                c.id === id ? { ...c, ...updates } : c
              ));
            }}
            onChartDelete={(id) => {
              setCharts(prev => prev.filter(c => c.id !== id));
            }}
          />
        </div>
        
        {/* Right Sidebar - Wizard */}
        <AnimatePresence>
          {showWizard && (
            <WizardSidebar
              darkMode={darkMode}
              onClose={() => setShowWizard(false)}
              onGenerateApp={() => {
                setShowWizard(false);
                setAppBuilderMode(true);
              }}
            />
          )}
        </AnimatePresence>
        
        {/* Macro Builder */}
        <AnimatePresence>
          {showMacroBuilder && (
            <MacroBuilder
              darkMode={darkMode}
              macros={macros}
              onClose={() => setShowMacroBuilder(false)}
              onRunMacro={handleRunMacro}
              onCreateMacro={(macro) => setMacros(prev => [...prev, macro])}
            />
          )}
        </AnimatePresence>
        
        {/* Data Analyzer Panel */}
        <DataAnalyzerPanel
          darkMode={darkMode}
          isOpen={showDataAnalyzer}
          onClose={() => setShowDataAnalyzer(false)}
          cellData={cellData}
          onApplyFormula={updateCell}
          onCreateChart={handleAddChart}
        />
      </div>
      
      {/* Bottom AI Output Drawer */}
      <AIOutputDrawer
        darkMode={darkMode}
        isOpen={drawerOpen}
        onToggle={() => setDrawerOpen(!drawerOpen)}
        aiActions={aiActions}
        aiThinking={aiThinking}
        onActionClick={handleAIActionClick}
      />
      
      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateSheetModal
            darkMode={darkMode}
            onClose={() => setShowCreateModal(false)}
            onSelectTemplate={(template) => {
              setShowCreateModal(false);
              
              // Each template triggers a specific AI command
              const templateCommands: Record<string, string> = {
                'Blank SpecterSheet': '', // Just close modal
                'AI-Powered Budget': 'Create a monthly budget tracker with categories like Rent, Utilities, Food, Transport, Entertainment, Savings. Include amounts and a total formula.',
                'Revenue Dashboard': 'Create a sales revenue dashboard with Products, Units Sold, Unit Price, and Total Revenue columns. Include 6 products and sum formulas.',
                'Inventory Manager': 'Create an inventory tracker with Product Name, SKU, Quantity In Stock, Reorder Level, and Status columns. Add 5 sample products.',
                'Team Planner': 'Create a team schedule planner with Team Member, Monday, Tuesday, Wednesday, Thursday, Friday columns. Add 4 team members with task assignments.',
                'Project Timeline': 'Create a project timeline with Task Name, Start Date, End Date, Status, and Owner columns. Add 5 project tasks.',
              };
              
              const command = templateCommands[template];
              if (command) {
                setTimeout(() => processAICommand(command), 300);
              }
            }}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showChartModal && (
          <ChartModal
            darkMode={darkMode}
            onClose={() => {
              setShowChartModal(false);
              setPendingChart(null);
            }}
            onConfirm={handleAddChart}
            pendingChart={pendingChart}
            cellData={cellData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
